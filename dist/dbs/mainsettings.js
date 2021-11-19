"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const database_1 = require("../database");
module.exports = class mainsettings {
    constructor() {
        this._isGuildDB = false;
        this._isManual = false;
        this.default_main_settings = {
            "running": true,
            "prefix": "-",
            "botname": "Test Bot",
            "maincolor": [0, 0, 0],
            "owners": [175390734608891905],
            "devs": [175390734608891905],
            "robloxEnabled": false,
        };
        this.queryDB = async () => {
            if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings")) {
                await new database_1.db(database_1.schemas.main.coreMainModel(true)).createRecords([
                    this.default_main_settings
                ]);
            }
        };
    }
    isGuildDB() { return this._isGuildDB; }
    ;
    isManual() { return this._isManual; }
    ;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbnNldHRpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Ricy9tYWluc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrQ0FBd0M7QUFDeEMsMENBQTBDO0FBRTFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxZQUFZO0lBQWxCO1FBQ0ksZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRW5DLDBCQUFxQixHQUFHO1lBQ3BCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsUUFBUSxFQUFFLEdBQUc7WUFDYixTQUFTLEVBQUUsVUFBVTtZQUNyQixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztZQUM5QixNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztZQUM1QixlQUFlLEVBQUUsS0FBSztTQUN6QixDQUFDO1FBSUYsWUFBTyxHQUFHLEtBQUssSUFBbUIsRUFBRTtZQUNoQyxJQUFJLENBQUMsTUFBTSxvQkFBYSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO2dCQUN4RSxNQUFNLElBQUksYUFBRSxDQUFDLGtCQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztvQkFDekQsSUFBSSxDQUFDLHFCQUFxQjtpQkFDN0IsQ0FBQyxDQUFDO2FBQ047UUFDTCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBVEcsU0FBUyxLQUFjLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQSxDQUFDLENBQUM7SUFBQSxDQUFDO0lBQ2hELFFBQVEsS0FBYyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUEsQ0FBQyxDQUFDO0lBQUEsQ0FBQztDQVFqRCxDQUFBIn0=