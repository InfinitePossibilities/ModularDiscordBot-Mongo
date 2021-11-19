import { IBotDB } from "../IBotAPIs";
import { miscFunctions } from "../util";
import { db, schemas } from "../database";

module.exports = class mainsettings implements IBotDB {
    private readonly _isGuildDB = false;
    private readonly _isManual = false;

    default_main_settings = {
        "running": true,
        "prefix": "-",
        "botname": "Test Bot",
        "maincolor": [0, 0, 0],
        "owners": [175390734608891905],
        "devs": [175390734608891905],
        "robloxEnabled": false,
    };
    
    isGuildDB(): boolean { return this._isGuildDB };
    isManual(): boolean { return this._isManual };
    queryDB = async (): Promise<void> => {
        if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings")) {
            await new db(schemas.main.coreMainModel(true)).createRecords([
                this.default_main_settings
            ]);
        }
    }
}