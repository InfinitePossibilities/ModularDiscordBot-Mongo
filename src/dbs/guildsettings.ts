// Last modified: 2021/11/21 19:30:24
import { IBotDB } from "../IBotAPIs";
import { miscFunctions } from "../util";
import { db, schemas } from "modulardiscordbot-db";
import { Guild } from "discord.js";

module.exports = class guildsettings implements IBotDB {
    private readonly _isGuildDB = true;
    private readonly _isManual = false;

    default_guild_settings = {
        "running": true,
        "prefix": "-",
        "botname": "Test Bot",
        "maincolor": [0, 0, 0],
    };
    
    isGuildDB(): boolean { return this._isGuildDB };
    isManual(): boolean { return this._isManual };
    queryDB = async (_guild: Guild): Promise<void> => {
        try {
            if (!await miscFunctions.dbFunctions.collectionExists(`${_guild.id}_CoreSettings`)) {
                console.log(`Creating ${_guild.id}_CoreSettings`);
                await new db(schemas.guild.coreGuildModel(_guild, true)).createRecords([
                    this.default_guild_settings
                ])
                .then(() => {
                    console.log(`Successfully created ${_guild.id}_CoreSettings`);
                }).catch((e) => {
                    console.log(`Failed creating ${_guild.id}_CoreSettings`);
                    console.log(e)
                });
            }
        }catch(e) {
            console.log(`Failed creating ${_guild.id}_CoreSettings`);
            console.log(e);
        }
    }
}