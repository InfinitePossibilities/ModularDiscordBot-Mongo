// Last modified: 2021/11/24 02:43:39
import * as Discord from "discord.js";
import { IBotCommand } from "../../../IBotAPIs";
import { CommandType } from "../../../config";
import { db, schemas } from "modulardiscordbot-db";
import { miscFunctions } from "../../../util";
// import { GuildSettings } from "../../database";
import { commands } from "../../../app";
// import { setMainEmbedColor } from '../../util';

module.exports = class moosic implements IBotCommand {
    private readonly _info = {
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
    }
    private readonly _isTest = false;
    private readonly _Type = CommandType.GENERAL;

    info = {
        getCommand: (): string => { return this._info.command },
        getAliases: () => { return this._info.aliases },
        getDescription: (): string => { return this._info.description },
        getSyntax: (): string => { return this._info.syntax },
        getArguments: () => { return this._info.arguments },
        isTest: (): boolean => { return this._isTest },
        getType: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {
        // TODO: - Test Command stuff
    }
}