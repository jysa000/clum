export async function logDebug(msg){
    if(global.__clum && global.__clum.debug){
        console.log(msg);
    }
}

export async function setDebugMode(){
    global.__clum = global.__clum || {};
    global.__clum.debug = true;
}