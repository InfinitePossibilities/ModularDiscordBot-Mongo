"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config");
// import { setMainEmbedColor } from '../../util';
module.exports = class moosic {
    constructor() {
        this._info = {
            command: "moosic",
            aliases: [],
            description: "Cool music command. Does cool stuff.",
            syntax: "<extra>",
            arguments: [
                {
                    arg: "play",
                    aliases: ["p"],
                    description: "Play music",
                    syntax: "play [song]",
                },
                {
                    arg: "pause",
                    aliases: [],
                    description: "Pause music",
                    syntax: "pause",
                },
                {
                    arg: "stop",
                    aliases: [],
                    description: "Stop music",
                    syntax: "stop",
                },
                {
                    arg: "queue",
                    aliases: ["q"],
                    description: "List music queue",
                    syntax: "queue",
                },
                {
                    arg: "skip",
                    aliases: ["s"],
                    description: "Skip song",
                    syntax: "skip [number]",
                },
            ],
            subcategory: "Moosic",
        };
        this._isTest = false;
        this._Type = config_1.CommandType.GENERAL;
        this.info = {
            getCommand: () => { return this._info.command; },
            getAliases: () => { return this._info.aliases; },
            getDescription: () => { return this._info.description; },
            getSyntax: () => { return this._info.syntax; },
            getArguments: () => { return this._info.arguments; },
            isTest: () => { return this._isTest; },
            getType: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            // TODO: - Test Command stuff
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9vc2ljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2dlbmVyYWwvTXVzaWMvbW9vc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsNENBQThDO0FBSzlDLGtEQUFrRDtBQUVsRCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sTUFBTTtJQUFaO1FBQ0ksVUFBSyxHQUFHO1lBQ3JCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLE9BQU8sRUFBRSxFQUFFO1lBQ1gsV0FBVyxFQUFFLHNDQUFzQztZQUNuRCxNQUFNLEVBQUUsU0FBUztZQUNqQixTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksR0FBRyxFQUFFLE1BQU07b0JBQ1gsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNkLFdBQVcsRUFBRSxZQUFZO29CQUN6QixNQUFNLEVBQUUsYUFBYTtpQkFDeEI7Z0JBQ0Q7b0JBQ0ksR0FBRyxFQUFFLE9BQU87b0JBQ1osT0FBTyxFQUFFLEVBQUU7b0JBQ1gsV0FBVyxFQUFFLGFBQWE7b0JBQzFCLE1BQU0sRUFBRSxPQUFPO2lCQUNsQjtnQkFDRDtvQkFDSSxHQUFHLEVBQUUsTUFBTTtvQkFDWCxPQUFPLEVBQUUsRUFBRTtvQkFDWCxXQUFXLEVBQUUsWUFBWTtvQkFDekIsTUFBTSxFQUFFLE1BQU07aUJBQ2pCO2dCQUNEO29CQUNJLEdBQUcsRUFBRSxPQUFPO29CQUNaLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDZCxXQUFXLEVBQUUsa0JBQWtCO29CQUMvQixNQUFNLEVBQUUsT0FBTztpQkFDbEI7Z0JBQ0Q7b0JBQ0ksR0FBRyxFQUFFLE1BQU07b0JBQ1gsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNkLFdBQVcsRUFBRSxXQUFXO29CQUN4QixNQUFNLEVBQUUsZUFBZTtpQkFDMUI7YUFDSjtZQUNELFdBQVcsRUFBRSxRQUFRO1NBQ3hCLENBQUE7UUFDZ0IsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixVQUFLLEdBQUcsb0JBQVcsQ0FBQyxPQUFPLENBQUM7UUFFN0MsU0FBSSxHQUFHO1lBQ0gsVUFBVSxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQ3ZELFVBQVUsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUMvQyxjQUFjLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQSxDQUFDLENBQUM7WUFDL0QsU0FBUyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDO1lBQ3JELFlBQVksRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFBLENBQUMsQ0FBQztZQUNuRCxNQUFNLEVBQUUsR0FBWSxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUM5QyxPQUFPLEVBQUUsR0FBZ0IsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQSxDQUFDLENBQUM7U0FDcEQsQ0FBQTtRQUVELGVBQVUsR0FBRyxLQUFLLEVBQUUsSUFBYyxFQUFFLFNBQTBCLEVBQUUsTUFBc0IsRUFBaUIsRUFBRTtZQUNyRyw2QkFBNkI7UUFDakMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztDQUFBLENBQUEifQ==