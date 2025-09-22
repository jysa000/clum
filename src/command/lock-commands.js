import {onIPC} from "../ipc/ipc-manager.js";

let lockMap = {}; // key : { expiresAt : timestamp }

onIPC("lock", ({keys, ttl})=>{
    let now = Date.now();
    
    for(let key in keys){
        if(lockMap[key] && lockMap[key].expiresAt > now){
            return false;
        }
    }
    
    for(let key in keys){
        lockMap[key] = {
            expiresAt: now + ttl
        };
    }
    
    return true;
});

onIPC("unlock", ({keys})=>{
   for(let key in keys){
       delete lockMap[key];
   } 
   
   return true;
});

onIPC("unlock-all", ()=>{
   lockMap = {};
   return true;
});

setInterval(() => {
    const now = Date.now();
    for (const key in lockMap) {
        if (lockMap[key].expiresAt <= now) {
            delete lockMap[key];
        }
    }
}, 5000); // removing expired locks