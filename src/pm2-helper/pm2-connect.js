import pm2 from "pm2";
import {logDebug} from "../logger/logger.js";

export async function connectPM2(){
    global.__clum.pm2 = global.__clum.pm2 || {};
    
    if(global.__clum.pm2.isConnected){
        return;
    }

    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) return reject(err);
            global.__clum.pm2.isConnected = true;
            logDebug("connected to pm2 successfully");
            resolve();
        });
    });
}