import pm2 from "pm2";
import {connectPM2} from "./pm2-helper/pm2-connect.js";

// importing commands
import './command/default-commands.js';
import './command/hash-commands.js';
import './command/lock-commands.js';
import './command/pub-sub-commands.js';

// initializing global variables
global.__clum = global.__clum ?? {};
global.__clum.volatileData = global.__clum.volatileData ?? {};
global.__clum.persistentData = global.__clum.persistentData ?? {};

(async()=>{
    await connectPM2();
    console.log("clum is running...");
})();

