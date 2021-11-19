import { IBotDB } from "../IBotAPIs";

module.exports = class nda implements IBotDB {
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
        console.log("NDA CreateDB Test");
    }
}