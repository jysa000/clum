import {onIPC} from "../ipc/ipc-manager.js";


// cache commands (volatile data, tied to process lifecycle)
onIPC("get-cache", (packet)=>{
   let {key} = packet;
   return get(global.__clum.volatileData, key);
});
onIPC("set-cache", (packet) => {
   let {key, data, args} = packet;
   return set(global.__clum.volatileData, key, data, args);
});
onIPC("del-cache", (packet)=>{
    let {key} = packet;
    return del(global.__clum.volatileData, key);
})



// data commands (persistent data, independent of process lifecycle)
onIPC("get-data", (packet)=>{
    let {key} = packet;
    return get(global.__clum.persistentData, key);
})
onIPC("set-data", (packet) => {
    let {key, data, args} = packet;
    return set(global.__clum.persistentData, key, data, args);
});
onIPC("del-data", (packet)=>{
    let {key} = packet;
    return del(global.__clum.persistentData, key);
})




// implementations
function get(target, key){
    if(target[key] !== undefined){
        return target[key];
    }
    
    return null;
}

function set(target, key, data, args){
    if(args != null && args.NX && target[key] !== undefined){
        return false;
    }
    
    target[key] = data;
    return true;
}

function del(target, key){
    delete target[key];
    return true;
}