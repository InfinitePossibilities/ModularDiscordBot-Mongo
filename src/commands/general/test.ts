import * as Discord from "discord.js";
import { IBotCommand } from "../../IBotAPIs";
import { CommandType } from "../../config";
import { db, schemas } from "../../database";
import { miscFunctions } from "../../util";
// import { GuildSettings } from "../../database";
import { commands } from "../../app";
// import { setMainEmbedColor } from '../../util';

module.exports = class test implements IBotCommand {
    private readonly _command = "test";
    private readonly _aliases = [];
    private readonly _description = "Cool test command, yes?";
    private readonly _syntax = "<command>";
    private readonly _arguments = ["list"];
    private readonly _isTest = false;
    private readonly _Type = CommandType.GENERAL;

    info = {
        command: (): string => { return this._command },
        aliases: () => { return this._aliases },
        description: (): string => { return this._description },
        syntax: (): string => { return this._syntax },
        arguments: () => { return this._arguments },
        isTest: (): boolean => { return this._isTest },
        Type: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {
        // TODO:
    }
}