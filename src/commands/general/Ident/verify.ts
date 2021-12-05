// Last modified: 2021/11/24 02:44:43
import * as Discord from "discord.js";
import { IBotCommand } from "../../../IBotAPIs";
import { CommandType } from "../../../config";

module.exports = class verify implements IBotCommand {
    private readonly _info = {
        command: "verify",
        aliases: [],
        description: "Prompt/Verify Discord-Roblox user connection.",
        syntax: "",
        arguments: [],
        subcategory: "Ident",
    }
    private readonly _isTest = false;
    private readonly _Type = CommandType.GENERAL;

    info = {
        getCommand: (): string => { return this._info.command },
        getAliases: () => { return this._info.aliases },
        getDescription: (): string => { return this._info.description },
        getSyntax: (): string => { return this._info.syntax },
        getArguments: () => { return this._info.arguments },
        getSubcategory: () => { return this._info.subcategory },
        isTest: (): boolean => { return this._isTest },
        getType: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Discord.Message, client: Discord.Client): Promise<void> => {
        // TODO: - Test Command stuff
    }
}