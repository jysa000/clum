import {onIPC, sendIPC} from "../ipc/ipc-manager.js";

var subMap = {};

// managing subscriptions and relay publish packets
onIPC("clum:sub", (data) => {
    subMap[data.key] = subMap[data.key] ?? new Set();
    subMap[data.key].add(data.__senderId);
});

onIPC("clum:pub", (data) => {
    if(subMap[data.key]){
        sendIPC(subMap[data.key], "clum:pub", data);
    }
    return true;
});