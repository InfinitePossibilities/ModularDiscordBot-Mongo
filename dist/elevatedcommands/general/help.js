"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Last modified: 2021/11/24 02:05:31
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
                    aliases: [],
                    description: "",
                    syntax: "",
                }
            ]
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
            // (new MessageEmbed())
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
    let _title = `\`Usage: ${_mainPrefix + _helpClass.info.getCommand() + " " + _helpClass.info.getSyntax()}\`\n\n`;
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
                let commandName = command.info.getCommand();
                let commandSyntax = command.info.getSyntax();
                let commandDesc = command.info.getDescription();
                if (!command.info.getSubcategory) {
                    switch (command.info.getType()) {
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
                    let _category = command.info.getSubcategory();
                    if (!_categories.includes(_category))
                        _categories.push(_category);
                    _categorizedCommands.push([_category, command.info.getType(), `> :white_medium_small_square: \`${_mainPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`]);
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
        thumbnail: {
            url: _client.user?.displayAvatarURL()
        },
        timestamp: new Date(),
        footer: {
            text: (await _mainSettings.readRecords(undefined, "botname"))[0].botname,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    _msgObject.channel.send({ embeds: [helpEmbed], components: [helpButtonRow] });
};
let sendCommandHelp = async (_client, _msgObject, args, type) => {
    let _commandClass = app_1.elevated_commands.find((command) => { return command.info.getCommand() == args[0].toLowerCase(); });
    let sendCommandEmbed = async (_commandClass) => {
        if (!_msgObject.guild?.available || type == "undefined")
            return;
        let _mainSettings = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true));
        let _mainPrefix = String(_msgObject.content.substring(0, 1)).repeat(2);
        let _command = `\`Command: ${_commandClass.info.getCommand().charAt(0).toUpperCase() + _commandClass.info.getCommand().slice(1)}\`\n`;
        let _usage = `\`Usage: ${_mainPrefix + _commandClass.info.getCommand() + " " + _commandClass.info.getSyntax()}\`\n`;
        let _aliases = (_commandClass.info.getAliases().length > 0) ? `\`Aliases: ${_commandClass.info.getAliases().sort().join(", ")}\`\n` : "";
        let _args = _commandClass.info.getArguments() ? ((_commandClass.info.getArguments()?.length > 0) ? `\`Arguments: ${_commandClass.info.getArguments().sort().join(", ")}\`\n` : "") : "";
        let _description = _commandClass.info.getDescription();
        const commandEmbed = {
            color: (await _mainSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
        ? await sendCommandEmbed(_commandClass)
        : await sendErrorEmbed();
};
function getCommandType(targetCommand) {
    for (const command of app_1.elevated_commands) {
        try {
            if (command.info.getCommand() == targetCommand.toLowerCase()) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lbGV2YXRlZGNvbW1hbmRzL2dlbmVyYWwvaGVscC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQywyQ0FBZ0k7QUFFaEkseUNBQTJDO0FBQzNDLCtEQUFtRDtBQUNuRCxtQ0FBOEM7QUFFOUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUk7SUFBVjtRQUNJLFVBQUssR0FBRztZQUNyQixPQUFPLEVBQUUsTUFBTTtZQUNmLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztZQUNkLFdBQVcsRUFBRSw2Q0FBNkM7WUFDMUQsTUFBTSxFQUFFLFdBQVc7WUFDbkIsU0FBUyxFQUFFO2dCQUNQO29CQUNJLEdBQUcsRUFBRSxNQUFNO29CQUNYLE9BQU8sRUFBRSxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFFO29CQUNmLE1BQU0sRUFBRSxFQUFFO2lCQUNiO2FBQ0o7U0FDSixDQUFBO1FBQ2dCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILFVBQVUsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUN2RCxVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDL0MsY0FBYyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUEsQ0FBQyxDQUFDO1lBQy9ELFNBQVMsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUNyRCxZQUFZLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQSxDQUFDLENBQUM7WUFDbkQsTUFBTSxFQUFFLEdBQVksRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDOUMsT0FBTyxFQUFFLEdBQWdCLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1NBQ3BELENBQUE7UUFFRCxlQUFVLEdBQUcsS0FBSyxFQUFFLElBQWMsRUFBRSxTQUFrQixFQUFFLE1BQWMsRUFBaUIsRUFBRTtZQUNyRix1QkFBdUI7WUFFdkIsOENBQThDO1lBQzlDLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHO2dCQUFFLE9BQU87WUFFakMsNkJBQTZCO1lBQzdCLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQ2xCLHFDQUFxQztnQkFDckMsTUFBTSxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3pDO2lCQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLG9CQUFvQjtnQkFDcEIsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxRQUFRO29CQUNoRSxDQUFDLENBQUMsTUFBTSxZQUFZLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztvQkFDdkMsQ0FBQyxDQUFDLE1BQU0sZUFBZSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO2FBQzdEO1FBQ0wsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztDQUFBLENBQUE7QUFFRCxJQUFJLFlBQVksR0FBRyxLQUFLLEVBQUUsT0FBZSxFQUFFLFVBQW1CLEVBQUUsRUFBRTtJQUM5RCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTO1FBQUUsT0FBTztJQUV6QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUIsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLEVBQWlCLENBQUM7SUFFNUMsSUFBSSxhQUFhLEdBQUcsTUFBTSxJQUFJLHlCQUFFLENBQUMsOEJBQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkUsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV4RSxJQUFJLE1BQU0sR0FBRyxZQUFZLFdBQVcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7SUFDaEgsSUFBSSxhQUFhLEdBQUcsd0JBQXdCLEVBQUUsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQ3BFLElBQUksYUFBYSxHQUFHLHdCQUF3QixFQUFFLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUNwRSxJQUFJLGVBQWUsR0FBRyw0QkFBNEIsRUFBRSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7SUFDNUUsSUFBSSxXQUFXLEdBQWEsRUFBRSxDQUFDO0lBQy9CLElBQUksb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0lBRTlCLHVCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO0lBRXpCLEtBQUssTUFBTSxPQUFPLElBQUksdUJBQWlCLEVBQUU7UUFDckMsSUFBSTtZQUVBLElBQUksTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLElBQUksRUFBRSxHQUFFO2lCQUFLO2dCQUM1QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUM1QyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUM3QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUVoRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7b0JBQzlCLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTt3QkFDNUIsS0FBSyxDQUFDLG9CQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzs0QkFBRSxnQkFBZ0IsSUFBSSxpQ0FBaUMsV0FBVyxHQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsYUFBYSxRQUFRLFdBQVcsSUFBSSxDQUFDOzRCQUFDLE1BQU07eUJBQUU7d0JBQzFNLEtBQUssQ0FBQyxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQUUsZ0JBQWdCLElBQUksaUNBQWlDLFdBQVcsR0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLGFBQWEsUUFBUSxXQUFXLElBQUksQ0FBQzs0QkFBQyxNQUFNO3lCQUFFO3dCQUMxTSxLQUFLLENBQUMsb0JBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzRCQUFFLGtCQUFrQixJQUFJLGlDQUFpQyxXQUFXLEdBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxhQUFhLFFBQVEsV0FBVyxJQUFJLENBQUM7NEJBQUMsTUFBTTt5QkFBRTtxQkFDak47aUJBQ0o7cUJBQUs7b0JBQ0YsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDOUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO3dCQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ2xFLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLG1DQUFtQyxXQUFXLEdBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxhQUFhLFFBQVEsV0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUNwTjthQUNKO1NBRUo7UUFBQSxPQUFPLFNBQVMsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDMUI7S0FDSjtJQUVELFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUU1QixLQUFLLE1BQU0sU0FBUyxJQUFJLFdBQVcsRUFBRTtRQUNqQyxJQUFJO1lBQ0EsSUFBSSxjQUFjLEdBQUcsMEJBQTBCLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO1lBQ3pHLElBQUksZ0JBQWdCLEdBQUcsY0FBYyxDQUFDO1lBQ3RDLElBQUksZ0JBQWdCLEdBQUcsY0FBYyxDQUFDO1lBQ3RDLElBQUksa0JBQWtCLEdBQUcsY0FBYyxDQUFDO1lBRXhDLEtBQUssTUFBTSxtQkFBbUIsSUFBSSxvQkFBb0IsRUFBRTtnQkFDcEQsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTO29CQUFFLFNBQVM7Z0JBRWxELFFBQVEsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQzVCLEtBQUssQ0FBQyxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQUUsZ0JBQWdCLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQUMsTUFBTTtxQkFBRTtvQkFDbEYsS0FBSyxDQUFDLG9CQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFBRSxnQkFBZ0IsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFBQyxNQUFNO3FCQUFFO29CQUNsRixLQUFLLENBQUMsb0JBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUFFLGtCQUFrQixJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUFDLE1BQU07cUJBQUU7aUJBQ3pGO2FBQ0o7WUFFRCxJQUFJLGdCQUFnQixJQUFJLGNBQWM7Z0JBQUUsZ0JBQWdCLEdBQUcsQ0FBQyxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2xHLElBQUksZ0JBQWdCLElBQUksY0FBYztnQkFBRSxnQkFBZ0IsR0FBRyxDQUFDLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLENBQUM7WUFDbEcsSUFBSSxrQkFBa0IsSUFBSSxjQUFjO2dCQUFFLGtCQUFrQixHQUFHLENBQUMsa0JBQWtCLElBQUksa0JBQWtCLENBQUMsQ0FBQztTQUM3RztRQUFBLE9BQU8sU0FBUyxFQUFFO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMxQjtLQUNKO0lBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSw2QkFBZ0IsRUFBRSxDQUFDLGFBQWEsQ0FDdEQsSUFBSSwwQkFBYSxFQUFFO1NBQ2QsUUFBUSxDQUFDLFNBQVMsQ0FBQztTQUNuQixNQUFNLENBQUMsK0JBQStCLENBQUM7U0FDdkMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUN4QixDQUFBO0lBQ0QsTUFBTSxTQUFTLEdBQUc7UUFDZCxLQUFLLEVBQUUsQ0FBQyxNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBNEI7UUFDaEcsS0FBSyxFQUFFLHVCQUF1QjtRQUM5QixXQUFXLEVBQUUsTUFBTSxHQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxHQUFDLGdCQUFnQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvTixTQUFTLEVBQUU7WUFDUCxHQUFHLEVBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBYTtTQUNwRDtRQUNELFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRTtRQUNyQixNQUFNLEVBQUU7WUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUN4RSxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtTQUM3QztLQUNKLENBQUM7SUFDRixVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUNoRixDQUFDLENBQUE7QUFFRCxJQUFJLGVBQWUsR0FBRyxLQUFLLEVBQUUsT0FBZSxFQUFFLFVBQW1CLEVBQUUsSUFBYyxFQUFFLElBQVksRUFBRSxFQUFFO0lBQy9GLElBQUksYUFBYSxHQUFHLHVCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXZILElBQUksZ0JBQWdCLEdBQUcsS0FBSyxFQUFFLGFBQTBCLEVBQUUsRUFBRTtRQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLElBQUksSUFBSSxJQUFJLFdBQVc7WUFBRSxPQUFPO1FBRWhFLElBQUksYUFBYSxHQUFHLE1BQU0sSUFBSSx5QkFBRSxDQUFDLDhCQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25FLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBRSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEUsSUFBSSxRQUFRLEdBQUcsY0FBYyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3BJLElBQUksTUFBTSxHQUFHLFlBQVksV0FBVyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztRQUNwSCxJQUFJLFFBQVEsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBZSxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBZSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDaEssSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsTUFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWlCLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDL00sSUFBSSxZQUFZLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2RCxNQUFNLFlBQVksR0FBRztZQUNqQixLQUFLLEVBQUUsQ0FBQyxNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBNEI7WUFDaEcsS0FBSyxFQUFFLHlCQUF5QjtZQUNoQyxXQUFXLEVBQUUsUUFBUSxHQUFDLFFBQVEsR0FBQyxNQUFNLEdBQUMsS0FBSyxHQUFDLElBQUksR0FBQyxZQUFZO1lBQzdELFNBQVMsRUFBRTtnQkFDUCxHQUFHLEVBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBYTthQUNwRDtZQUNELFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRTtZQUNyQixNQUFNLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUTtnQkFDNUIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7YUFDN0M7U0FDSixDQUFDO1FBRUYsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQyxDQUFBO0lBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSw2QkFBZ0IsRUFBRSxDQUFDLGFBQWEsQ0FDdkQsSUFBSSwwQkFBYSxFQUFFO1NBQ2QsUUFBUSxDQUFDLFNBQVMsQ0FBQztTQUNuQixNQUFNLENBQUMsK0JBQStCLENBQUM7U0FDdkMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUNyQixJQUFJLDBCQUFhLEVBQUU7U0FDZCxXQUFXLENBQUMsT0FBTyxDQUFDO1NBQ3BCLFFBQVEsQ0FBQyxhQUFhLENBQUM7U0FDdkIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUMxQixDQUFBO0lBQ0QsSUFBSSxjQUFjLEdBQUcsS0FBSyxJQUFJLEVBQUU7UUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUztZQUFFLE9BQU87UUFFekMsTUFBTSxVQUFVLEdBQUc7WUFDZixLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBb0I7WUFDbkMsS0FBSyxFQUFFLE9BQU87WUFDZCxXQUFXLEVBQUUsbUdBQW1HO1lBQ2hILFNBQVMsRUFBRTtnQkFDUCxHQUFHLEVBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBYTthQUNwRDtZQUNELFNBQVMsRUFBRSxJQUFJLElBQUksRUFBRTtZQUNyQixNQUFNLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUTtnQkFDNUIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7YUFDN0M7U0FDSixDQUFDO1FBRUYsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEYsQ0FBQyxDQUFBO0lBRUQsYUFBYTtRQUNULENBQUMsQ0FBQyxNQUFNLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztRQUN2QyxDQUFDLENBQUMsTUFBTSxjQUFjLEVBQUUsQ0FBQztBQUNqQyxDQUFDLENBQUE7QUFFRCxTQUFTLGNBQWMsQ0FBQyxhQUFxQjtJQUN6QyxLQUFLLE1BQU0sT0FBTyxJQUFJLHVCQUFpQixFQUFFO1FBQ3JDLElBQUk7WUFFQSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUMxRCxRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQzVCLEtBQUssQ0FBQyxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQUUsT0FBTyxTQUFTLENBQUM7cUJBQUU7b0JBQ2pELEtBQUssQ0FBQyxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQUUsT0FBTyxTQUFTLENBQUM7cUJBQUU7b0JBQ2pELEtBQUssQ0FBQyxvQkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQUUsT0FBTyxXQUFXLENBQUM7cUJBQUU7aUJBQ3hEO2FBQ0o7aUJBQUssR0FBRTtTQUVYO1FBQUEsT0FBTyxTQUFTLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFCO0tBQ0o7SUFFRCxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDIn0=