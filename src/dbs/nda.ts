// Last modified: 2021/11/21 19:30:12
import { IBotDB } from "../IBotAPIs";
import { miscFunctions } from "../util";
import { db, schemas } from "modulardiscordbot-db";
import { Guild } from "discord.js";

module.exports = class nda implements IBotDB {
    private readonly _isGuildDB = true;
    private readonly _isManual = false;

    isGuildDB(): boolean { return this._isGuildDB };
    isManual(): boolean { return this._isManual };

    queryDB = async (_guild: Guild): Promise<void> => {
        try {
            if (!await miscFunctions.dbFunctions.collectionExists(`${_guild.id}_NDA`)) {
                console.log(`Creating ${_guild.id}_NDA`);
                await new db(schemas.template.templateModel(`${_guild.id}_NDA`)).createCollection()
                .then(() => {
                    console.log(`Successfully created ${_guild.id}_NDA`);
                }).catch((e) => {
                    console.log(`Failed creating ${_guild.id}_NDA`);
                    console.log(e)
                });
            }
        }catch(e) {
            console.log(`Failed creating ${_guild.id}_NDA`);
            console.log(e);
        }
    }
}