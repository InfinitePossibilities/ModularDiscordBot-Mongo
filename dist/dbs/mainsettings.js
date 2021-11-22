"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
module.exports = class mainsettings {
    constructor() {
        this._isGuildDB = false;
        this._isManual = false;
        this.default_main_settings = {
            "running": true,
            "prefix": "-",
            "botname": "Test Bot",
            "maincolor": [0, 0, 0],
            "owners": [175390734608891905n],
            "devs": [175390734608891905n, 350893170567020545n],
            "robloxEnabled": false,
        };
        this.queryDB = async () => {
            try {
                if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings")) {
                    console.log("Creating Main_CoreSettings");
                    await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).createRecords([
                        this.default_main_settings
                    ]).then(() => {
                        console.log("Successfully created Main_CoreSettings");
                    }).catch((e) => {
                        console.log("Failed creating Main_CoreSettings");
                        console.log(e);
                    });
                }
            }
            catch (e) {
                console.log("Failed creating Main_CoreSettings");
                console.log(e);
            }
        };
    }
    isGuildDB() { return this._isGuildDB; }
    ;
    isManual() { return this._isManual; }
    ;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnNldHRpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Ricy9tYWluc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxrQ0FBd0M7QUFDeEMsK0RBQW1EO0FBRW5ELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxZQUFZO0lBQWxCO1FBQ0ksZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRW5DLDBCQUFxQixHQUFHO1lBQ3BCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsUUFBUSxFQUFFLEdBQUc7WUFDYixTQUFTLEVBQUUsVUFBVTtZQUNyQixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixRQUFRLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztZQUMvQixNQUFNLEVBQUUsQ0FBQyxtQkFBbUIsRUFBQyxtQkFBbUIsQ0FBQztZQUNqRCxlQUFlLEVBQUUsS0FBSztTQUN6QixDQUFDO1FBSUYsWUFBTyxHQUFHLEtBQUssSUFBbUIsRUFBRTtZQUNoQyxJQUFJO2dCQUNBLElBQUksQ0FBQyxNQUFNLG9CQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEVBQUU7b0JBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztvQkFDMUMsTUFBTSxJQUFJLHlCQUFFLENBQUMsOEJBQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO3dCQUN6RCxJQUFJLENBQUMscUJBQXFCO3FCQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTt3QkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7b0JBQzFELENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO3dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQzt3QkFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDbEIsQ0FBQyxDQUFDLENBQUM7aUJBQ047YUFDSjtZQUFBLE9BQU0sQ0FBQyxFQUFFO2dCQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztnQkFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNqQjtRQUNMLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFwQkcsU0FBUyxLQUFjLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQSxDQUFDLENBQUM7SUFBQSxDQUFDO0lBQ2hELFFBQVEsS0FBYyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUEsQ0FBQyxDQUFDO0lBQUEsQ0FBQztDQW1CakQsQ0FBQSJ9