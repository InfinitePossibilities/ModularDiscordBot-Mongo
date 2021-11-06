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
module.exports = class status {
    constructor() {
        this._command = "status";
        this._description = "Shows bot status.";
        this._syntax = "<command>";
        this._arguments = [];
        this._isTest = false;
        this._Type = config_1.CommandType.UTILITY;
        this.info = {
            command: () => { return this._command; },
            description: () => { return this._description; },
            syntax: () => { return this._syntax; },
            arguments: () => { return this._arguments; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            // Return if sender is a bot user
            if (msgObject.author.bot)
                return;
            if (args.length == 0) {
                // send Help Message if no arguements
                await sendHelpList(client, msgObject);
            }
            else if (args.length > 0) {
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
    let _title = `\`Usage: ${_guildPrefix + _helpClass.info.command() + _helpClass.info.syntax()}\`\n\n`;
    let _generalTitle = '**General Commands**\n', _generalCommands = ``;
    let _utilityTitle = '\n**Utility Commands**\n', _utilityCommands = ``;
    let _developerTitle = '\n**Development Commands**\n', _developerCommands = ``;
    let _categories = [];
    let _categorizedCommands = [];
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
                    // switch (command.info.Type()) {
                    // default: {
                    let _category = command.info.subcategory();
                    if (!_categories.includes(_category))
                        _categories.push(_category);
                    _categorizedCommands.push([_category, command.info.Type(), `> :white_medium_small_square: \`${_guildPrefix + commandName.charAt(0).toUpperCase() + commandName.slice(1) + " " + commandSyntax}\` - ${commandDesc}\n`]);
                    // }
                    // }
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
        description: _title + (_generalTitle + _generalCommands) + (_utilityTitle + _utilityCommands) + (_developerTitle + _developerCommands),
        timestamp: new Date(),
        footer: {
            text: (await _guildSettings.readRecords(undefined, "botname"))[0].botname,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    _msgObject.channel.send({ embeds: [helpEmbed], components: [helpButtonRow] });
};
let sendCommandHelp = async (_client, _msgObject, args, type) => {
    // if (!_msgObject.guild?.available || type == "undefined") return;
    // let _help = require(`../${type}/${args[0].toLowerCase()}`);
    // let _helpClass = new _help() as IBotCommand;
    // let _guildSettings = await new db(schemas.guild.coreGuildModel(_msgObject.guild, true));
    // let prefix = String( await _guildSettings.readRecords(undefined,'prefix') );
    // let _title = `
    //     ${_helpClass.info.help()}\n
    //     \`Usage: ${prefix + _helpClass.info.usage()}\`\n\n`;
    // await miscFunctions.functions.setMainEmbedColor(_embed, _msgObject.guild);
    // _embed.setAuthor("Help")
    //         .setDescription(_title)
    //         .setFooter((await _guildSettings.readRecords(undefined, 'botname'))[0].botname,_client.user?.displayAvatarURL())
    //         .setTimestamp(new Date());
    // let deleteEmbed = () => {
    //     _msgObject.channel.send({embeds: [_embed]})
    //         .then(m => setTimeout(() => {(m as Discord.Message).delete()}, 5000));
    //         setTimeout(() => {_msgObject.delete()}, 5000);
    // }
    // _msgObject.content.includes('--keep') 
    //     ? _msgObject.channel.send({embeds: [_embed]}) 
    //     : deleteEmbed();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL3V0aWxpdHkvc3RhdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUFzQztBQUV0Qyx5Q0FBMkM7QUFDM0MsNkNBQTZDO0FBRTdDLGtEQUFrRDtBQUNsRCxtQ0FBcUM7QUFDckMsa0RBQWtEO0FBRWxELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxNQUFNO0lBQVo7UUFDSSxhQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsbUJBQW1CLENBQUM7UUFDbkMsWUFBTyxHQUFHLFdBQVcsQ0FBQztRQUN0QixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLFdBQVcsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUEsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzdDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQztTQUNqRCxDQUFBO1FBRUQsZUFBVSxHQUFHLEtBQUssRUFBRSxJQUFjLEVBQUUsU0FBMEIsRUFB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