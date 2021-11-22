"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
module.exports = class nda {
    constructor() {
        this._isGuildDB = true;
        this._isManual = false;
        this.queryDB = async (_guild) => {
            try {
                if (!await util_1.miscFunctions.dbFunctions.collectionExists(`${_guild.id}_NDA`)) {
                    console.log(`Creating ${_guild.id}_NDA`);
                    await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.template.templateModel(`${_guild.id}_NDA`)).createCollection()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Ricy9uZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxrQ0FBd0M7QUFDeEMsK0RBQW1EO0FBR25ELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxHQUFHO0lBQVQ7UUFDSSxlQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFLbkMsWUFBTyxHQUFHLEtBQUssRUFBRSxNQUFhLEVBQWlCLEVBQUU7WUFDN0MsSUFBSTtnQkFDQSxJQUFJLENBQUMsTUFBTSxvQkFBYSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUN2RSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3pDLE1BQU0sSUFBSSx5QkFBRSxDQUFDLDhCQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUU7eUJBQ2xGLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3pELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUNsQixDQUFDLENBQUMsQ0FBQztpQkFDTjthQUNKO1lBQUEsT0FBTSxDQUFDLEVBQUU7Z0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbEI7UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBcEJHLFNBQVMsS0FBYyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO0lBQUEsQ0FBQztJQUNoRCxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQztJQUFBLENBQUM7Q0FtQmpELENBQUEifQ==