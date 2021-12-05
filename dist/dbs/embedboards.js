"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
module.exports = class embedboards {
    constructor() {
        this._id = "embedboards";
        this._isGuildDB = true;
        this._isManual = false;
        this.info = {
            _id: () => { return this._id; },
            isGuildDB: () => { return this._isGuildDB; },
            isManual: () => { return this._isManual; },
        };
        this.queryDB = async (_guild) => {
            try {
                if (!await util_1.miscFunctions.dbFunctions.collectionExists(`${_guild.id}_EmbedBoards`)) {
                    console.log(`Creating ${_guild.id}_EmbedBoards`);
                    await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.template.templateModel(`${_guild.id}_EmbedBoards`, true)).createCollection()
                        .then(() => {
                        console.log(`Successfully created ${_guild.id}_EmbedBoards`);
                    }).catch((e) => {
                        console.log(`Failed creating ${_guild.id}_EmbedBoards`);
                        console.log(e);
                    });
                }
            }
            catch (e) {
                console.log(`Failed creating ${_guild.id}_EmbedBoards`);
                console.log(e);
            }
        };
    }
    isGuildDB() { return this._isGuildDB; }
    ;
    isManual() { return this._isManual; }
    ;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1iZWRib2FyZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGJzL2VtYmVkYm9hcmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0NBQXdDO0FBQ3hDLCtEQUFtRDtBQUduRCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sV0FBVztJQUFqQjtRQUNJLFFBQUcsR0FBRyxhQUFhLENBQUM7UUFDcEIsZUFBVSxHQUFHLElBQUksQ0FBQztRQUNsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRW5DLFNBQUksR0FBRztZQUNILEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUEsQ0FBQyxDQUFDO1lBQzlCLFNBQVMsRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO1lBQ3BELFFBQVEsRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUEsQ0FBQyxDQUFDO1NBQ3JELENBQUE7UUFLRCxZQUFPLEdBQUcsS0FBSyxFQUFFLE1BQWEsRUFBaUIsRUFBRTtZQUM3QyxJQUFJO2dCQUNBLElBQUksQ0FBQyxNQUFNLG9CQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsY0FBYyxDQUFDLEVBQUU7b0JBQy9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxNQUFNLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztvQkFDakQsTUFBTSxJQUFJLHlCQUFFLENBQUMsOEJBQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUU7eUJBQ2hHLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsTUFBTSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBQ2pFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLE1BQU0sQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO3dCQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUNsQixDQUFDLENBQUMsQ0FBQztpQkFDTjthQUNKO1lBQUEsT0FBTSxDQUFDLEVBQUU7Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsTUFBTSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEI7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBcEJHLFNBQVMsS0FBYyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO0lBQUEsQ0FBQztJQUNoRCxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQztJQUFBLENBQUM7Q0FtQmpELENBQUEifQ==