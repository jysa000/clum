import pm2 from "pm2";
import {logDebug} from "../logger/logger.js";

// integrating IPC with pm2

let reqResHandler = {};
let reqId = 0;

let onIPCHander = {};  // msg event handler (for onIPC)

// receiving messages
process.on('message', async (msg) => {
    if(!msg || typeof msg !== 'object') return;
    if(msg.type !== "clum:msg") return;
    
    let { eventName, senderId, data } = msg;
    
    data.__senderId = senderId;
    data.__eventName = eventName;
    
    if(onIPCHander[eventName]){
        let result = await onIPCHander[eventName](data);
        
        // sending response when message requires response (= sender sends msg with reqId)
        if(data.__reqId !== undefined){
            sendIPC(senderId, "clum:res", {
                reqId,
                res
            });
        }
    }
});

// sending message
export async function sendIPC(pmIdArr, eventNameStr, dataObj){
    for(let pmId of pmIdArr){
        pm2.sendDataToProcessId({
            type: 'clum:msg',
            senderId : process.env.pm_id,
            eventName : eventNameStr,
            data : dataObj,
            id : pmId,
            topic: 'manual'
        }, (err, res) => {
            if(err)
                console.error(err);
        });
    }
}

// requesting message via IPC and return response
export async function reqIPC(pmIdArr, eventNameStr, dataObj, timeoutMs = 2000){
    let targetReqId = reqId++;
    if(reqId >= 10000000000)
        reqId = 0;
    
    dataObj.__reqId = targetReqId;
    
    return new Promise((resolve, reject) => {
       let timer = setTimeout(() => {
           delete reqResHandler[targetReqId];
           resolve(null);
           logDebug(`${eventNameStr} request timed out`);
       }, timeoutMs);
       
       reqResHandler[targetReqId] = (data) => {
           clearTimeout(timer);
           delete reqResHandler[targetReqId];
           resolve(data);
       }
       
       sendIPC(pmIdArr, eventNameStr, dataObj);
    });
}
// trigger ipc response
onIPC("clum:res", data => {
    if(reqResHandler[data.reqId]){}
    reqResHandler[data.reqId](data.res);
})



// binding 'on msg with eventName' handler
export async function onIPC(eventName, callback){
    onIPCHander[eventName] = callback;
}