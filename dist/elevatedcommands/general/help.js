"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Last modified: 2021/11/21 19:29:15
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
const app_1 = require("../../app");
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
    let _mainSettings = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true));
    let _mainPrefix = String(_msgObject.content.substring(0, 1)).repeat(2);
    let _title = `\`Usage: ${_mainPrefix + _helpClass.info.command() + " " + _helpClass.info.syntax()}\`\n\n`;
    let _generalTitle = '**General Commands**\n', _generalCommands = ``;
    let _utilityTitle = '**Utility Commands**\n', _utilityCommands = ``;
    let _developerTitle = '**Development Commands**\n', _developerCommands = ``;
    let _categories = [];
    let _categorizedCommands = [];
    app_1.elevated_commands.sort();
    for (const command of app_1.elevated_commands) {
        try {
            if (await command.info.isTest() == true) { }
            else {
                let commandName = command.info.command();
                let commandSyntax = command.info.syntax();
                let commandDesc = command.info.description();
                if (!command.info.subcategory) {
                    switch (command.info.Type()) {
                        case (config_1.CommandType.GENERAL): {
                            _generalCommands += `:white_medium_small_square: \`${_mainPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`;
                            break;
                        }
                        case (config_1.CommandType.UTILITY): {
                            _utilityCommands += `:white_medium_small_square: \`${_mainPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`;
                            break;
                        }
                        case (config_1.CommandType.DEVELOPER): {
                            _developerCommands += `:white_medium_small_square: \`${_mainPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`;
                            break;
                        }
                    }
                }
                else {
                    let _category = command.info.subcategory();
                    if (!_categories.includes(_category))
                        _categories.push(_category);
                    _categorizedCommands.push([_category, command.info.Type(), `> :white_medium_small_square: \`${_mainPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`]);
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
        color: (await _mainSettings.readRecords(undefined, "maincolor"))[0].maincolor,
        title: '**Elevated Commands**',
        description: _title + (_generalCommands ? (_generalTitle + _generalCommands) + "\n" : "") + (_utilityCommands ? (_utilityTitle + _utilityCommands) + "\n" : "") + (_developerCommands ? (_developerTitle + _developerCommands) + "\n" : ""),
        timestamp: new Date(),
        footer: {
            text: (await _mainSettings.readRecords(undefined, "botname"))[0].botname,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    _msgObject.channel.send({ embeds: [helpEmbed], components: [helpButtonRow] });
};
let sendCommandHelp = async (_client, _msgObject, args, type) => {
    let _commandClass = app_1.elevated_commands.find((command) => { return command.info.command() == args[0].toLowerCase(); });
    let sendCommandEmbed = async (_commandClass) => {
        if (!_msgObject.guild?.available || type == "undefined")
            return;
        let _mainSettings = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true));
        let _mainPrefix = String(_msgObject.content.substring(0, 1)).repeat(2);
        let _command = `\`Command: ${_commandClass.info.command().charAt(0).toUpperCase() + _commandClass.info.command().slice(1)}\`\n`;
        let _usage = `\`Usage: ${_mainPrefix + _commandClass.info.command() + " " + _commandClass.info.syntax()}\`\n`;
        let _aliases = (_commandClass.info.aliases().length > 0) ? `\`Aliases: ${_commandClass.info.aliases().sort().join(", ")}\`\n` : "";
        let _args = _commandClass.info.arguments() ? ((_commandClass.info.arguments()?.length > 0) ? `\`Arguments: ${_commandClass.info.arguments().sort().join(", ")}\`\n` : "") : "";
        let _description = _commandClass.info.description();
        const commandEmbed = {
            color: (await _mainSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
    for (const command of app_1.elevated_commands) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lbGV2YXRlZGNvbW1hbmRzL2dlbmVyYWwvaGVscC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQywyQ0FBK0Y7QUFFL0YseUNBQTJDO0FBQzNDLCtEQUFtRDtBQUNuRCxtQ0FBOEM7QUFFOUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUk7SUFBVjtRQUNJLGFBQVEsR0FBRyxNQUFNLENBQUM7UUFDbEIsYUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakIsaUJBQVksR0FBRyw2Q0FBNkMsQ0FBQztRQUM3RCxZQUFPLEdBQUcsV0FBVyxDQUFDO1FBQ3RCLGVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQ3ZDLFdBQVcsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUEsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzdDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJ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