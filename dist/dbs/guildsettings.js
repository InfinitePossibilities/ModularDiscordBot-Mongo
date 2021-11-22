"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
module.exports = class guildsettings {
    constructor() {
        this._isGuildDB = true;
        this._isManual = false;
        this.default_guild_settings = {
            "running": true,
            "prefix": "-",
            "botname": "Test Bot",
            "maincolor": [0, 0, 0],
        };
        this.queryDB = async (_guild) => {
            try {
                if (!await util_1.miscFunctions.dbFunctions.collectionExists(`${_guild.id}_CoreSettings`)) {
                    console.log(`Creating ${_guild.id}_CoreSettings`);
                    await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(_guild, true)).createRecords([
                        this.default_guild_settings
                    ])
                        .then(() => {
                        console.log(`Successfully created ${_guild.id}_CoreSettings`);
                    }).catch((e) => {
                        console.log(`Failed creating ${_guild.id}_CoreSettings`);
                        console.log(e);
                    });
                }
            }
            catch (e) {
                console.log(`Failed creating ${_guild.id}_CoreSettings`);
                console.log(e);
            }
        };
    }
    isGuildDB() { return this._isGuildDB; }
    ;
    isManual() { return this._isManual; }
    ;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpbGRzZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kYnMvZ3VpbGRzZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGtDQUF3QztBQUN4QywrREFBbUQ7QUFHbkQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLGFBQWE7SUFBbkI7UUFDSSxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbkMsMkJBQXNCLEdBQUc7WUFDckIsU0FBUyxFQUFFLElBQUk7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3pCLENBQUM7UUFJRixZQUFPLEdBQUcsS0FBSyxFQUFFLE1BQWEsRUFBaUIsRUFBRTtZQUM3QyxJQUFJO2dCQUNBLElBQUksQ0FBQyxNQUFNLG9CQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsZUFBZSxDQUFDLEVBQUU7b0JBQ2hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxNQUFNLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQztvQkFDbEQsTUFBTSxJQUFJLHlCQUFFLENBQUMsOEJBQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQzt3QkFDbkUsSUFBSSxDQUFDLHNCQUFzQjtxQkFDOUIsQ0FBQzt5QkFDRCxJQUFJLENBQUMsR0FBRyxFQUFFO3dCQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLE1BQU0sQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO29CQUNsRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTt3QkFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixNQUFNLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQzt3QkFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDbEIsQ0FBQyxDQUFDLENBQUM7aUJBQ047YUFDSjtZQUFBLE9BQU0sQ0FBQyxFQUFFO2dCQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLE1BQU0sQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2dCQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xCO1FBQ0wsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQXJCRyxTQUFTLEtBQWMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFBLENBQUMsQ0FBQztJQUFBLENBQUM7SUFDaEQsUUFBUSxLQUFjLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQSxDQUFDLENBQUM7SUFBQSxDQUFDO0NBb0JqRCxDQUFBIn0=