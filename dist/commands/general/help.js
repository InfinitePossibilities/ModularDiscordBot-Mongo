"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Last modified: 2021/11/24 23:32:26
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
const app_1 = require("../../app");
module.exports = class help {
    constructor() {
        this._info = {
            command: "help",
            aliases: ["h"],
            description: "Shows basic information and command syntax.",
            syntax: "<command>",
            arguments: [
                {
                    arg: "list",
                    aliases: ["l"],
                    description: "List commands",
                    syntax: "list",
                }
            ],
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
    let _guildSettings = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(_msgObject.guild, true));
    let _guildPrefix = String(_msgObject.content.substring(0, 1));
    let _title = `\`Usage: ${_guildPrefix + _helpClass.info.getCommand() + " " + _helpClass.info.getSyntax()}\`\n\n`;
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
                let commandName = command.info.getCommand();
                let commandSyntax = command.info.getSyntax();
                let commandDesc = command.info.getDescription();
                if (!command.info.getSubcategory) {
                    switch (command.info.getType()) {
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
                    let _category = command.info.getSubcategory();
                    if (!_categories.includes(_category))
                        _categories.push(_category);
                    _categorizedCommands.push([_category, command.info.getType(), `> :white_medium_small_square: \`${_guildPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`]);
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
        thumbnail: {
            url: _client.user?.displayAvatarURL()
        },
        timestamp: new Date(),
        footer: {
            text: (await _guildSettings.readRecords(undefined, "botname"))[0].botname,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    _msgObject.channel.send({ embeds: [helpEmbed], components: [helpButtonRow] });
};
let sendCommandHelp = async (_client, _msgObject, args, type) => {
    let _commandClass = app_1.commands.find((command) => { return command.info.getCommand() == args[0].toLowerCase() || command.info.getAliases().indexOf(args[0].toLowerCase()) > -1; });
    let sendembed = async (_command, _aliases, _usage, _args, _description) => {
        if (!_msgObject.guild?.available || type == "undefined")
            return;
        let _guildSettings = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(_msgObject.guild, true));
        const embed = {
            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
            title: `**Command Information**`,
            description: _command + _aliases + _usage + _args + "\n" + _description,
            thumbnail: {
                url: _client.user?.displayAvatarURL()
            },
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        _msgObject.channel.send({ embeds: [embed] });
    };
    let sendCommandEmbed = async (_commandClass) => {
        if (!_msgObject.guild?.available || type == "undefined")
            return;
        let _cmdArgs = [];
        for (let _arg of _commandClass.info.getArguments()) {
            _cmdArgs.push(_arg["arg"]);
        }
        let _guildPrefix = String(_msgObject.content.substring(0, 1));
        let _command = `\`Command: ${_commandClass.info.getCommand().charAt(0).toUpperCase() + _commandClass.info.getCommand().slice(1)}\`\n`;
        let _usage = `\`Usage: ${_guildPrefix + _commandClass.info.getCommand() + " " + _commandClass.info.getSyntax()}\`\n`;
        let _aliases = (_commandClass.info.getAliases().length > 0) ? `\`Aliases: ${_commandClass.info.getAliases().sort().join(", ")}\`\n` : "";
        let _args = _cmdArgs ? ((_cmdArgs.length > 0) ? "> " + `\`Arguments: ${_cmdArgs.sort().join(", ")}\`\n` : "") : "";
        let _description = "> " + _commandClass.info.getDescription();
        await sendembed(_command, _aliases, _usage, _args, _description);
    };
    let handleSubargumentEmbed = async (_commandClass) => {
        if (!_msgObject.guild?.available || type == "undefined")
            return;
        let _subArgument = _commandClass.info.getArguments().find((arg) => { return arg["arg"] == args[1].toLowerCase(); });
        if (!_subArgument)
            return;
        let _guildPrefix = String(_msgObject.content.substring(0, 1));
        let _command = `\`Argument: ${_subArgument["arg"].charAt(0).toUpperCase() + _subArgument["arg"].slice(1)}\`\n`;
        let _usage = `\`Usage: ${_guildPrefix + _commandClass.info.getCommand() + " " + _subArgument["syntax"]}\`\n`;
        let _aliases = (_subArgument["aliases"].length > 0) ? `\`Aliases: ${_subArgument["aliases"].sort().join(", ")}\`\n` : "";
        let _args = "";
        let _description = "> " + _subArgument["description"];
        await sendembed(_command, _aliases, _usage, _args, _description);
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
            thumbnail: {
                url: _client.user?.displayAvatarURL()
            },
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
    };
    _commandClass
        ? args.length == 1 ? await sendCommandEmbed(_commandClass) : await handleSubargumentEmbed(_commandClass)
        : await sendErrorEmbed();
};
function getCommandType(targetCommand) {
    for (const command of app_1.commands) {
        try {
            if (command.info.getCommand() == targetCommand.toLowerCase() || command.info.getAliases().indexOf(targetCommand.toLowerCase()) > -1) {
                switch (command.info.getType()) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL2hlbHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsMkNBQStGO0FBRS9GLHlDQUEyQztBQUMzQywrREFBbUQ7QUFDbkQsbUNBQXFDO0FBRXJDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJO0lBQVY7UUFDSSxVQUFLLEdBQUc7WUFDckIsT0FBTyxFQUFFLE1BQU07WUFDZixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDZCxXQUFXLEVBQUUsNkNBQTZDO1lBQzFELE1BQU0sRUFBRSxXQUFXO1lBQ25CLFNBQVMsRUFBRTtnQkFDUDtvQkFDSSxHQUFHLEVBQUUsTUFBTTtvQkFDWCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ2QsV0FBVyxFQUFFLGVBQWU7b0JBQzVCLE1BQU0sRUFBRSxNQUFNO2lCQUNqQjthQUNKO1NBQ0osQ0FBQTtRQUNnQixZQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ2hCLFVBQUssR0FBRyxvQkFBVyxDQUFDLE9BQU8sQ0FBQztRQUU3QyxTQUFJLEdBQUc7WUFDSCxVQUFVLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDdkQsVUFBVSxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQy9DLGNBQWMsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFBLENBQUMsQ0FBQztZQUMvRCxTQUFTLEVBQUUsR0FBVyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQSxDQUFDLENBQUM7WUFDckQsWUFBWSxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxD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