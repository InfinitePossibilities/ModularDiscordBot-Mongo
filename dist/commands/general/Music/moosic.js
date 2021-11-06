"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config");
// import { setMainEmbedColor } from '../../util';
module.exports = class moosic {
    constructor() {
        this._command = "moosic";
        this._description = "Cool Moosic command. Does cool stuff.";
        this._syntax = "<extra>";
        this._isTest = false;
        this._arguments = ["play", "pause", "stop", "queue", "skip"];
        this._Type = config_1.CommandType.GENERAL;
        this._SubCategory = "Moosic";
        this.info = {
            command: () => { return this._command; },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9vc2ljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2dlbmVyYWwvTXVzaWMvbW9vc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNENBQThDO0FBSzlDLGtEQUFrRDtBQUVsRCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sTUFBTTtJQUFaO1FBQ0ksYUFBUSxHQUFHLFFBQVEsQ0FBQztRQUNwQixpQkFBWSxHQUFHLHVDQUF1QyxDQUFDO1FBQ3ZELFlBQU8sR0FBRyxTQUFTLENBQUM7UUFDcEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixlQUFVLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEQsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBQzVCLGlCQUFZLEdBQUcsUUFBUSxDQUFDO1FBRXpDLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLFdBQVcsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUEsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzdDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztZQUM5QyxXQUFXLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFBLENBQUMsQ0FBQztTQUMxRCxDQUFBO1FBRUQsZUFBVSxHQUFHLEtBQUssRUFBRSxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFpQixFQUFFO1lBQ3JHLDZCQUE2QjtRQUNqQyxDQUFDLENBQUE7SUFDTCxDQUFDO0NBQUEsQ0FBQSJ9