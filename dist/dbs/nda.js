"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = class nda {
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
            console.log("NDA CreateDB Test");
        };
    }
    isGuildDB() { return this._isGuildDB; }
    ;
    isManual() { return this._isManual; }
    ;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Ricy9uZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sR0FBRztJQUFUO1FBQ0ksZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRW5DLDBCQUFxQixHQUFHO1lBQ3BCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsUUFBUSxFQUFFLEdBQUc7WUFDYixTQUFTLEVBQUUsVUFBVTtZQUNyQixXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixRQUFRLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztZQUM5QixNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztZQUM1QixlQUFlLEVBQUUsS0FBSztTQUN6QixDQUFDO1FBS0YsWUFBTyxHQUFHLEtBQUssSUFBbUIsRUFBRTtZQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQU5HLFNBQVMsS0FBYyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO0lBQUEsQ0FBQztJQUNoRCxRQUFRLEtBQWMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQztJQUFBLENBQUM7Q0FLakQsQ0FBQSJ9