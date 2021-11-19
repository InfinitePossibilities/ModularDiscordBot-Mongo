"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const database_1 = require("../../database");
// import { GuildSettings } from "../../database";
const app_1 = require("../../app");
// import { setMainEmbedColor } from '../../util';
module.exports = class help {
    constructor() {
        this._command = "help";
        this._aliases = ["h"];
        this._description = "Shows basic information and command syntax.";
        this._syntax = "<command>";
        this._arguments = ["list"];
        this._isTest = false;
        this._Type = config_1.CommandType.GENERAL;
        this.info = {
            command: () => { return this._command; },
            aliases: () => { return this._aliases; },
            description: () => { return this._description; },
            syntax: () => { return this._syntax; },
            arguments: () => { return this._arguments; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            // Do not ocntinue if message author is a bot.
            if (msgObject.author.bot)
                return;
            // Handle based on arguements
            if (args.length == 0) {
                // send Help Message if no arguements
                await sendHelpList(client, msgObject);
            }
            else if (args.length > 0) {
                // Handle arguements
                let type = getCommandType(args[0]);
                args[0].toLowerCase() == 'list' || args[0].toLowerCase() == '--keep'
                    ? await sendHelpList(client, msgObject)
                    : await sendCommandHelp(client, msgObject, args, type);
            }
        };
    }
};
let sendHelpList = async (_client, _msgObject) => {
    if (!_msgObject.guild?.available)
        return;
    let _help = require("./help");
    let _helpClass = new _help();
    let _guildSettings = await new database_1.db(database_1.schemas.guild.coreGuildModel(_msgObject.guild, true));
    let _guildPrefix = String(_msgObject.content.substring(0, 1));
    let _title = `\`Usage: ${_guildPrefix + _helpClass.info.command() + " " + _helpClass.info.syntax()}\`\n\n`;
    let _generalTitle = '**General Commands**\n', _generalCommands = ``;
    let _utilityTitle = '**Utility Commands**\n', _utilityCommands = ``;
    let _developerTitle = '**Development Commands**\n', _developerCommands = ``;
    let _categories = [];
    let _categorizedCommands = [];
    app_1.commands.sort();
    for (const command of app_1.commands) {
        try {
            if (await command.info.isTest() == true) { }
            else {
                let commandName = command.info.command();
                let commandSyntax = command.info.syntax();
                let commandDesc = command.info.description();
                if (!command.info.subcategory) {
                    switch (command.info.Type()) {
                        case (config_1.CommandType.GENERAL): {
                            _generalCommands += `:white_medium_small_square: \`${_guildPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`;
                            break;
                        }
                        case (config_1.CommandType.UTILITY): {
                            _utilityCommands += `:white_medium_small_square: \`${_guildPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`;
                            break;
                        }
                        case (config_1.CommandType.DEVELOPER): {
                            _developerCommands += `:white_medium_small_square: \`${_guildPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`;
                            break;
                        }
                    }
                }
                else {
                    let _category = command.info.subcategory();
                    if (!_categories.includes(_category))
                        _categories.push(_category);
                    _categorizedCommands.push([_category, command.info.Type(), `> :white_medium_small_square: \`${_guildPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`]);
                }
            }
        }
        catch (exception) {
            console.log(exception);
        }
    }
    _categories.sort().reverse();
    _categorizedCommands.sort();
    for (const _category of _categories) {
        try {
            let _categoryTitle = `:small_blue_diamond: **${_category.charAt(0).toUpperCase() + _category.slice(1)}**\n`;
            let _categoryGeneral = _categoryTitle;
            let _categoryUtility = _categoryTitle;
            let _categoryDeveloper = _categoryTitle;
            for (const _categorizedCommand of _categorizedCommands) {
                if (_categorizedCommand[0] != _category)
                    continue;
                switch (_categorizedCommand[1]) {
                    case (config_1.CommandType.GENERAL): {
                        _categoryGeneral += _categorizedCommand[2];
                        break;
                    }
                    case (config_1.CommandType.UTILITY): {
                        _categoryUtility += _categorizedCommand[2];
                        break;
                    }
                    case (config_1.CommandType.DEVELOPER): {
                        _categoryDeveloper += _categorizedCommand[2];
                        break;
                    }
                }
            }
            if (_categoryGeneral != _categoryTitle)
                _generalCommands = (_categoryGeneral += _generalCommands);
            if (_categoryUtility != _categoryTitle)
                _utilityCommands = (_categoryUtility += _utilityCommands);
            if (_categoryDeveloper != _categoryTitle)
                _developerCommands = (_categoryDeveloper += _developerCommands);
        }
        catch (exception) {
            console.log(exception);
        }
    }
    const helpButtonRow = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
        .setLabel('Discord')
        .setURL('https://discord.gg/VYp9qprv2u')
        .setStyle('LINK'));
    const helpEmbed = {
        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
        title: '**Commands**',
        description: _title + (_generalCommands ? (_generalTitle + _generalCommands) + "\n" : "") + (_utilityCommands ? (_utilityTitle + _utilityCommands) + "\n" : "") + (_developerCommands ? (_developerTitle + _developerCommands) + "\n" : ""),
        timestamp: new Date(),
        footer: {
            text: (await _guildSettings.readRecords(undefined, "botname"))[0].botname,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    _msgObject.channel.send({ embeds: [helpEmbed], components: [helpButtonRow] });
};
let sendCommandHelp = async (_client, _msgObject, args, type) => {
    let _commandClass = app_1.commands.find((command) => { return command.info.command() == args[0].toLowerCase(); });
    let sendCommandEmbed = async (_commandClass) => {
        if (!_msgObject.guild?.available || type == "undefined")
            return;
        let _guildSettings = await new database_1.db(database_1.schemas.guild.coreGuildModel(_msgObject.guild, true));
        let _guildPrefix = String(_msgObject.content.substring(0, 1));
        let _command = `\`Command: ${_commandClass.info.command().charAt(0).toUpperCase() + _commandClass.info.command().slice(1)}\`\n`;
        let _usage = `\`Usage: ${_guildPrefix + _commandClass.info.command() + " " + _commandClass.info.syntax()}\`\n`;
        let _aliases = (_commandClass.info.aliases().length > 0) ? `\`Aliases: ${_commandClass.info.aliases().sort().join(", ")}\`\n` : "";
        let _args = _commandClass.info.arguments() ? ((_commandClass.info.arguments()?.length > 0) ? `\`Arguments: ${_commandClass.info.arguments().sort().join(", ")}\`\n` : "") : "";
        let _description = _commandClass.info.description();
        const commandEmbed = {
            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
            title: `**Command Information**`,
            description: _command + _aliases + _usage + _args + "\n" + _description,
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        _msgObject.channel.send({ embeds: [commandEmbed] });
    };
    const errorButtonRow = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
        .setLabel('Discord')
        .setURL('https://discord.gg/VYp9qprv2u')
        .setStyle('LINK'), new discord_js_1.MessageButton()
        .setCustomId('error')
        .setLabel('Error (WIP)')
        .setStyle('DANGER'));
    let sendErrorEmbed = async () => {
        if (!_msgObject.guild?.available)
            return;
        const errorEmbed = {
            color: [255, 0, 0],
            title: 'Error',
            description: `No command with the specified name or alias exists! \n\nPlease report any unfixable errors below.`,
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
    };
    _commandClass
        ? await sendCommandEmbed(_commandClass)
        : await sendErrorEmbed();
};
function getCommandType(targetCommand) {
    for (const command of app_1.commands) {
        try {
            if (command.info.command() == targetCommand.toLowerCase()) {
                switch (command.info.Type()) {
                    case (config_1.CommandType.GENERAL): {
                        return "general";
                    }
                    case (config_1.CommandType.UTILITY): {
                        return "utility";
                    }
                    case (config_1.CommandType.DEVELOPER): {
                        return "developer";
                    }
                }
            }
            else { }
        }
        catch (exception) {
            console.log(exception);
        }
    }
    return "undefined";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL2hlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBK0Y7QUFFL0YseUNBQTJDO0FBQzNDLDZDQUE2QztBQUU3QyxrREFBa0Q7QUFDbEQsbUNBQXFDO0FBQ3JDLGtEQUFrRDtBQUVsRCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sSUFBSTtJQUFWO1FBQ0ksYUFBUSxHQUFHLE1BQU0sQ0FBQztRQUNsQixhQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixpQkFBWSxHQUFHLDZDQUE2QyxDQUFDO1FBQzdELFlBQU8sR0FBRyxXQUFXLENBQUM7UUFDdEIsZUFBVSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixVQUFLLEdBQUcsb0JBQVcsQ0FBQyxPQUFPLENBQUM7UUFFN0MsU0FBSSxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7WUFDL0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7WUFDdkMsV0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQSxDQUFDLENBQUM7WUFDdkQsTUFBTSxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDN0MsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQSxDQUFDLENBQUM7WUFDM0MsTUFBTSxFQUFFLEdBQVksRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDOUMsSUFBSSxFQUFFLEdBQWdCLEVBQUUsR0FBRyxP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