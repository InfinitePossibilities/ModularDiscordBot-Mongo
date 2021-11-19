"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config");
// import { setMainEmbedColor } from '../../util';
module.exports = class moosic {
    constructor() {
        this._command = "moosic";
        this._aliases = [];
        this._description = "Cool Moosic command. Does cool stuff.";
        this._syntax = "<extra>";
        this._isTest = false;
        this._arguments = ["play", "pause", "stop", "queue", "skip"];
        this._Type = config_1.CommandType.GENERAL;
        this._SubCategory = "Moosic";
        this.info = {
            command: () => { return this._command; },
            aliases: () => { return this._aliases; },
            description: () => { return this._description; },
            syntax: () => { return this._syntax; },
            arguments: () => { return this._arguments; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; },
            subcategory: () => { return this._SubCategory; }
        };
        this.runCommand = async (args, msgObject, client) => {
            // TODO: - Test Command stuff
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9vc2ljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2dlbmVyYWwvTXVzaWMvbW9vc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNENBQThDO0FBSzlDLGtEQUFrRDtBQUVsRCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sTUFBTTtJQUFaO1FBQ0ksYUFBUSxHQUFHLFFBQVEsQ0FBQztRQUNwQixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsaUJBQVksR0FBRyx1Q0FBdUMsQ0FBQztRQUN2RCxZQUFPLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsZUFBVSxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hELFVBQUssR0FBRyxvQkFBVyxDQUFDLE9BQU8sQ0FBQztRQUM1QixpQkFBWSxHQUFHLFFBQVEsQ0FBQztRQUV6QyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUN2QyxXQUFXLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFBLENBQUMsQ0FBQztZQUN2RCxNQUFNLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM3QyxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7WUFDOUMsV0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQSxDQUFDLENBQUM7U0FDMUQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyw2QkFBNkI7UUFDakMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztDQUFBLENBQUEifQ==