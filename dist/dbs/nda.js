"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
module.exports = class nda {
    constructor() {
        this._id = "nda";
        this._isGuildDB = true;
        this._isManual = false;
        this.info = {
            _id: () => { return this._id; },
            isGuildDB: () => { return this._isGuildDB; },
            isManual: () => { return this._isManual; },
        };
        this.queryDB = async (_guild) => {
            try {
                if (!await util_1.miscFunctions.dbFunctions.collectionExists(`${_guild.id}_NDA`)) {
                    console.log(`Creating ${_guild.id}_NDA`);
                    await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.template.templateModel(`${_guild.id}_NDA`, true)).createCollection()
                        .then(() => {
                        console.log(`Successfully created ${_guild.id}_NDA`);
                    }).catch((e) => {
                        console.log(`Failed creating ${_guild.id}_NDA`);
                        console.log(e);
                    });
                }
            }
            catch (e) {
                console.log(`Failed creating ${_guild.id}_NDA`);
                console.log(e);
            }
        };
    }
    isGuildDB() { return this._isGuildDB; }
    ;
    isManual() { return this._isManual; }
    ;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Ricy9uZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxrQ0FBd0M7QUFDeEMsK0RBQW1EO0FBR25ELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxHQUFHO0lBQVQ7UUFDSSxRQUFHLEdBQUcsS0FBSyxDQUFDO1FBQ1osZUFBVSxHQUFHLElBQUksQ0FBQztRQUNsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRW5DLFNBQUksR0FBRztZQUNILEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUEsQ0FBQyxDQUFDO1lBQzlCLFNBQVMsRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO1lBQ3BELFFBQVEsRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUEsQ0FBQyxDQUFDO1NBQ3JELENBQUE7UUFLRCxZQUFPLEdBQUcsS0FBSyxFQUFFLE1BQWEsRUFBaUIsRUFBRTtZQUM3QyxJQUFJO2dCQUNBLElBQUksQ0FBQyxNQUFNLG9CQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUU7b0JBQ3ZFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDekMsTUFBTSxJQUFJLHlCQUFFLENBQUMsOEJBQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUU7eUJBQ3hGLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3pELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUNsQixDQUFDLENBQUMsQ0FBQztpQkFDTjthQUNKO1lBQUEsT0FBTSxDQUFDLEVBQUU7Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEI7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBcEJHLFNBQVMsS0FBYyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO0lBQUEsQ0FBQztJQUNoRCxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQztJQUFBLENBQUM7Q0FtQmpELENBQUEifQ==