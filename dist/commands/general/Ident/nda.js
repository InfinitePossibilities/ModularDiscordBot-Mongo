"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config");
// import { setMainEmbedColor } from '../../util';
module.exports = class moosic {
    constructor() {
        this._command = "nda";
        this._aliases = [];
        this._description = "Prompt to agree/sign NonDisclosure Agreement.";
        this._syntax = "";
        this._isTest = false;
        this._arguments = [];
        this._Type = config_1.CommandType.GENERAL;
        this._SubCategory = "Ident";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2dlbmVyYWwvSWRlbnQvbmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNENBQThDO0FBSzlDLGtEQUFrRDtBQUVsRCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sTUFBTTtJQUFaO1FBQ0ksYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsaUJBQVksR0FBRywrQ0FBK0MsQ0FBQztRQUMvRCxZQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2IsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLE9BQU8sQ0FBQztRQUM1QixpQkFBWSxHQUFHLE9BQU8sQ0FBQztRQUV4QyxTQUFJLEdBQUc7WUFDSCxPQUFPLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUMvQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQztZQUN2QyxXQUFXLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFBLENBQUMsQ0FBQztZQUN2RCxNQUFNLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM3QyxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFBLENBQUMsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7WUFDOUMsV0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQSxDQUFDLENBQUM7U0FDMUQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyw2QkFBNkI7UUFDakMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztDQUFBLENBQUEifQ==