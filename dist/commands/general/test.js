"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const config_1 = require("../../config");
const database_1 = require("../../database");
// import { GuildSettings } from "../../database";
const app_1 = require("../../app");
// import { setMainEmbedColor } from '../../util';
module.exports = class test {
    constructor() {
        this._command = "test";
        this._description = "Cool test command, yes?";
        this._syntax = "<command>";
        this._arguments = ["list"];
        this._isTest = false;
        this._Type = config_1.CommandType.GENERAL;
        this.info = {
            command: () => { return this._command; },
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
    // commands.sort();
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
    const helpButtonRow = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
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
        let _args = _commandClass.info.arguments() ? ((_commandClass.info.arguments()?.length > 0) ? `\`Arguments: ${_commandClass.info.arguments().sort().join(", ")}\`\n` : "") : "";
        let _description = _commandClass.info.description();
        const commandEmbed = {
            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
            title: `**Command Information**`,
            description: _command + _usage + _args + "\n" + _description,
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        _msgObject.channel.send({ embeds: [commandEmbed] });
    };
    let sendErrorEmbed = async () => {
        if (!_msgObject.guild?.available || type == "undefined")
            return;
        const errorEmbed = {
            color: [255, 0, 0],
            title: 'Error',
            description: `Tis' an error! \n\nPlease report any unfixable errors below.`,
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        _msgObject.channel.send({ embeds: [errorEmbed] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXNDO0FBRXRDLHlDQUEyQztBQUMzQyw2Q0FBNkM7QUFFN0Msa0RBQWtEO0FBQ2xELG1DQUFxQztBQUNyQyxrREFBa0Q7QUFFbEQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLElBQUk7SUFBVjtRQUNJLGFBQVEsR0FBRyxNQUFNLENBQUM7UUFDbEIsaUJBQVksR0FBRyx5QkFBeUIsQ0FBQztRQUN6QyxZQUFPLEdBQUcsV0FBVyxDQUFDO1FBQ3RCLGVBQVUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLFdBQVcsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUEsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzdDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztTQUNqRCxDQUFBO1FBRUQsZUFBVSxHQUFHLEtBQUssRUFBRSxJQUFjLEVBQUUsU0FBMEIsRUFBRSxNQUFzQixFQUFpQixFQUFFO1lBRXJHLDhDQUE4QztZQUM5QyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRztnQkFBRSxPQUFPO1lBRWpDLDZCQUE2QjtZQUM3QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNsQixxQ0FBcUM7Z0JBQ3JDLE1BQU0sWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN6QztpQkFBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixvQkFBb0I7Z0JBQ3BCLElBQUksSUFBSSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksUUFBUTtvQkFDaEUsQ0FBQyxDQUFDLE1BQU0sWUFBWSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUM7b0JBQ3ZDLENBQUMsQ0FBQyxNQUFNLGVBQWUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTthQUM3RDtRQUNMLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FBQSxDQUFBO0FBRUQsSUFBSSxZQUFZLEdBQUcsS0FBSyxFQUFFLE9BQXVCLEVBQUUsVUFBMkIsRUFBRSxFQUFFO0lBQzlFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVM7UUFBRSxPQUFPO0lBRXpDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixJQUFJLFVBQVUsR0FBRyxJQUFJLEtBQUssRUFBaUIsQ0FBQztJQUU1QyxJQUFJLGNBQWMsR0FBRyxNQUFNLElBQUksYUFBRSxDQUFDLGtCQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEYsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO0lBRS9ELElBQUksTUFBTSxHQUFHLFlBQVksWUFBWSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztJQUMzRyxJQUFJLGFBQWEsR0FBRyx3QkFBd0IsRUFBRSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDcEUsSUFBSSxhQUFhLEdBQUcsd0JBQXdCLEVBQUUsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQ3BFLElBQUksZUFBZSxHQUFHLDRCQUE0QixFQUFFLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztJQUM1RSxJQUFJLFdBQVcsR0FBYSxFQUFFLENBQUM7SUFDL0IsSUFBSSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFFOUIsbUJBQW1CO0lBRW5CLEtBQUssTUFBTSxPQUFPLElBQUksY0FBUSxFQUFFO1FBQzVCLElBQUk7WUFFQSxJQUFJLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxJQUFJLEVBQUUsR0FBRTtpQkFBSztnQkFDNUMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDekMsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDMUMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFFN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUMzQixRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7d0JBQ3pCLEtBQUssQ0FBQyxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7NEJBQUUsZ0JBQWdCLElBQUksaUNBQWlDLFlBQVksR0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUMsR0FBRyxHQUFDLGFBQWEsUUFBUSxXQUFXLElBQUksQ0FBQzs0QkFBQyxNQUFNO3lCQUFFO3dCQUMzTSxLQUFLLENBQUMsb0JBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzRCQUFFLGdCQUFnQixJQUFJLGlDQUFpQyxZQUFZLEdBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsR0FBQyxhQUFhLFFBQVEsV0FBVyxJQUFJLENBQUM7NEJBQUMsTUFBTTt5QkFBRTt3QkFDM00sS0FBSyxDQUFDLG9CQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs0QkFBRSxrQkFBa0IsSUFBSSxpQ0FBaUMsWUFBWSxHQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsYUFBYSxRQUFRLFdBQVcsSUFBSSxDQUFDOzRCQUFDLE1BQU07eUJBQUU7cUJBQ2xOO2lCQUNKO3FCQUFLO29CQUNGLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQzt3QkFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNsRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxtQ0FBbUMsWUFBWSxHQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEdBQUMsYUFBYSxRQUFRLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDbE47YUFDSjtTQUVKO1FBQUEsT0FBTyxTQUFTLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFCO0tBQ0o7SUFFRCxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0Isb0JBQW9CLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFNUIsS0FBSyxNQUFNLFNBQVMsSUFBSSxXQUFXLEVBQUU7UUFDakMsSUFBSTtZQUNBLElBQUksY0FBYyxHQUFHLDBCQUEwQixTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtZQUN6RyxJQUFJLGdCQUFnQixHQUFHLGNBQWMsQ0FBQztZQUN0QyxJQUFJLGdCQUFnQixHQUFHLGNBQWMsQ0FBQztZQUN0QyxJQUFJLGtCQUFrQixHQUFHLGNBQWMsQ0FBQztZQUV4QyxLQUFLLE1BQU0sbUJBQW1CLElBQUksb0JBQW9CLEVBQUU7Z0JBQ3BELElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUztvQkFBRSxTQUFTO2dCQUVsRCxRQUFRLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUM1QixLQUFLLENBQUMsb0JBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3dCQUFFLGdCQUFnQixJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUFDLE1BQU07cUJBQUU7b0JBQ2xGLEtBQUssQ0FBQyxvQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7d0JBQUUsZ0JBQWdCLElBQUksbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQUMsTUFBTTtxQkFBRTtvQkFDbEYsS0FBSyxDQUFDLG9CQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFBRSxrQkFBa0IsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFBQyxNQUFNO3FCQUFFO2lCQUN6RjthQUNKO1lBRUQsSUFBSSxnQkFBZ0IsSUFBSSxjQUFjO2dCQUFFLGdCQUFnQixHQUFHLENBQUMsZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsQ0FBQztZQUNsRyxJQUFJLGdCQUFnQixJQUFJLGNBQWM7Z0JBQUUsZ0JBQWdCLEdBQUcsQ0FBQyxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ2xHLElBQUksa0JBQWtCLElBQUksY0FBYztnQkFBRSxrQkFBa0IsR0FBRyxDQUFDLGtCQUFrQixJQUFJLGtCQUFrQixDQUFDLENBQUM7U0FDN0c7UUFBQSxPQUFPLFNBQVMsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDMUI7S0FDSjtJQUVELE1BQU0sYUFBYSxHQUFHLElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUMsYUFBYSxDQUM5RCxJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7U0FDdEIsUUFBUSxDQUFDLFNBQVMsQ0FBQztTQUNuQixNQUFNLENBQUMsK0JBQStCLENBQUM7U0FDdkMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUN4QixDQUFBO0lBQ0QsTUFBTSxTQUFTLEdBQUc7UUFDZCxLQUFLLEVBQUUsQ0FBQyxNQUFNLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBb0M7UUFDekcsS0FBSyxFQUFFLGNBQWM7UUFDckIsV0FBVyxFQUFFLE1BQU0sR0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsR0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLEdBQUMsZ0JBQWdCLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxHQUFDLGtCQUFrQixDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDL04sU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFO1FBQ3JCLE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxDQUFDLE1BQU0sY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO1lBQ3pFLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1NBQzdDO0tBQ0osQ0FBQztJQUNGLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUMsQ0FBQTtBQUVELElBQUksZUFBZSxHQUFHLEtBQUssRUFBRSxPQUF1QixFQUFFLFVBQTJCLEVBQUUsSUFBYyxFQUFFLElBQVksRUFBRSxFQUFFO0lBQy9HLElBQUksYUFBYSxHQUFHLGNBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUUxRyxJQUFJLGdCQUFnQixHQUFHLEtBQUssRUFBRSxhQUEwQixFQUFFLEVBQUU7UUFDeEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxJQUFJLElBQUksSUFBSSxXQUFXO1lBQUUsT0FBTztRQUVoRSxJQUFJLGNBQWMsR0FBRyxNQUFNLElBQUksYUFBRSxDQUFDLGtCQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEYsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBRSxDQUFDO1FBRS9ELElBQUksUUFBUSxHQUFHLGNBQWMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUM5SCxJQUFJLE1BQU0sR0FBRyxZQUFZLFlBQVksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDL0csSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsTUFBZ0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWlCLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFlLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDdE0sSUFBSSxZQUFZLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVwRCxNQUFNLFlBQVksR0FBRztZQUNqQixLQUFLLEVBQUUsQ0FBQyxNQUFNLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBb0M7WUFDekcsS0FBSyxFQUFFLHlCQUF5QjtZQUNoQyxXQUFXLEVBQUUsUUFBUSxHQUFDLE1BQU0sR0FBQyxLQUFLLEdBQUMsSUFBSSxHQUFDLFlBQVk7WUFDcEQsU0FBUyxFQUFFLElBQUksSUFBSSxFQUFFO1lBQ3JCLE1BQU0sRUFBRTtnQkFDSixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRO2dCQUM1QixRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTthQUM3QztTQUNKLENBQUM7UUFFRixVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUE7SUFFRCxJQUFJLGNBQWMsR0FBRyxLQUFLLElBQUksRUFBRTtRQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLElBQUksSUFBSSxJQUFJLFdBQVc7WUFBRSxPQUFPO1FBRWhFLE1BQU0sVUFBVSxHQUFHO1lBQ2YsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQTRCO1lBQzNDLEtBQUssRUFBRSxPQUFPO1lBQ2QsV0FBVyxFQUFFLDhEQUE4RDtZQUMzRSxTQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUU7WUFDckIsTUFBTSxFQUFFO2dCQUNKLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLFFBQVE7Z0JBQzVCLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2FBQzdDO1NBQ0osQ0FBQztRQUVGLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQTtJQUVELGFBQWE7UUFDVCxDQUFDLENBQUMsTUFBTSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7UUFDdkMsQ0FBQyxDQUFDLE1BQU0sY0FBYyxFQUFFLENBQUM7QUFDakMsQ0FBQyxDQUFBO0FBRUQsU0FBUyxjQUFjLENBQUMsYUFBcUI7SUFDekMsS0FBSyxNQUFNLE9BQU8sSUFBSSxjQUFRLEVBQUU7UUFDNUIsSUFBSTtZQUVBLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxhQUFhLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ3ZELFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFDekIsS0FBSyxDQUFDLG9CQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFBRSxPQUFPLFNBQVMsQ0FBQztxQkFBRTtvQkFDakQsS0FBSyxDQUFDLG9CQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFBRSxPQUFPLFNBQVMsQ0FBQztxQkFBRTtvQkFDakQsS0FBSyxDQUFDLG9CQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFBRSxPQUFPLFdBQVcsQ0FBQztxQkFBRTtpQkFDeEQ7YUFDSjtpQkFBSyxHQUFFO1NBRVg7UUFBQSxPQUFPLFNBQVMsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDMUI7S0FDSjtJQUVELE9BQU8sV0FBVyxDQUFDO0FBQ3ZCLENBQUMifQ==