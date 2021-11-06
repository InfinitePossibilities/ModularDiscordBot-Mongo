import * as Discord from "discord.js";
import { IBotCommand } from "../../../IBotAPIs";
import { CommandType } from "../../../config";
import { db, schemas } from "../../../database";
import { miscFunctions } from "../../../util";
// import { GuildSettings } from "../../database";
import { commands } from "../../../app";
// import { setMainEmbedColor } from '../../util';

module.exports = class moosic implements IBotCommand {
    private readonly _command = "moosic";
    private readonly _description = "Cool Moosic command. Does cool stuff.";
    private readonly _syntax = "<extra>";
    private readonly _isTest = false;
    private readonly _arguments = ["play", "pause", "stop", "queue", "skip"];
    private readonly _Type = CommandType.GENERAL;
    private readonly _SubCategory = "Moosic";

    info = {
        command: (): string => { return this._command },
        description: (): string => { return this._description },
        syntax: (): string => { return this._syntax },
        arguments: () => { return this._arguments },
        isTest: (): boolean => { return this._isTest },
        Type: (): CommandType => { return this._Type },
        subcategory: (): string => { return this._SubCategory }
    }

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {
        // TODO: - Test Command stuff
    }
}