import {onIPC} from "../ipc/ipc-manager.js";

// cache commands (volatile data, tied to process lifecycle)
onIPC("hget-cache", (packet)=>{
    let {key, subKey} = packet;
    return hget(global.__clum.volatileData, key, subKey);
});
onIPC("set-cache", (packet) => {
    let {key, subKey, data, args} = packet;
    return hset(global.__clum.volatileData, key, subKey, data, args);
});
onIPC("del-cache", (packet)=>{
    let {key, subKey} = packet;
    return hdel(global.__clum.volatileData, key, subKey);
})



// data commands (persistent data, independent of process lifecycle)
onIPC("hget-data", (packet)=>{
    let {key, subKey} = packet;
    return hget(global.__clum.persistentData, key, subKey);
});
onIPC("set-data", (packet) => {
    let {key, subKey, data, args} = packet;
    return hset(global.__clum.persistentData, key, subKey, data, args);
});
onIPC("del-data", (packet)=>{
    let {key, subKey} = packet;
    return hdel(global.__clum.persistentData, key, subKey);
})






// implementations
async function hget(target, key, subKey){
    if(target[key] === undefined || target[key][subKey] === undefined){
        return null;
    }

    return target[key][subKey];
}

async function hset(target, key, subKey, data, args){
    if(target[key] === undefined || target[key][subKey] === undefined){
        return false;
    }
    
    if(args != null && args.NX && target[key][subKey] != null){
        return false;
    }
    
    target[key] = target[key] ?? {};
    target[key][subKey] = data;
    return true;
}

async function hdel(target, key, subKey){
    if(target[key] === undefined || target[key][subKey] === undefined){
        return true;
    }
    
    delete target[key][subKey];
    return true;
}