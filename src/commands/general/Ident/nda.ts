import * as Discord from "discord.js";
import { IBotCommand } from "../../../IBotAPIs";
import { CommandType } from "../../../config";
import { db, schemas } from "../../../database";
import { miscFunctions } from "../../../util";
// import { GuildSettings } from "../../database";
import { commands } from "../../../app";
// import { setMainEmbedColor } from '../../util';

module.exports = class nda implements IBotCommand {
    private readonly _command = "nda";
    private readonly _aliases = [];
    private readonly _description = "Prompt to agree/sign NonDisclosure Agreement.";
    private readonly _syntax = "";
    private readonly _isTest = false;
    private readonly _arguments = [];
    private readonly _Type = CommandType.GENERAL;
    private readonly _SubCategory = "Ident";

    info = {
        command: (): string => { return this._command },
        aliases: () => { return this._aliases },
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