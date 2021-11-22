// Last modified: 2021/11/21 19:30:19
import { IBotDB } from "../IBotAPIs";
import { miscFunctions } from "../util";
import { db, schemas } from "modulardiscordbot-db";

module.exports = class mainsettings implements IBotDB {
    private readonly _isGuildDB = false;
    private readonly _isManual = false;

    default_main_settings = {
        "running": true,
        "prefix": "-",
        "botname": "Test Bot",
        "maincolor": [0, 0, 0],
        "owners": [175390734608891905n],
        "devs": [175390734608891905n,350893170567020545n],
        "robloxEnabled": false,
    };
    
    isGuildDB(): boolean { return this._isGuildDB };
    isManual(): boolean { return this._isManual };
    queryDB = async (): Promise<void> => {
        try {
            if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings")) {
                console.log("Creating Main_CoreSettings");
                await new db(schemas.main.coreMainModel(true)).createRecords([
                    this.default_main_settings
                ]).then(() => {
                    console.log("Successfully created Main_CoreSettings");
                }).catch((e) => {
                    console.log("Failed creating Main_CoreSettings");
                    console.log(e)
                });
            }
        }catch(e) {
            console.log("Failed creating Main_CoreSettings");
            console.log(e)
        }
    }
}