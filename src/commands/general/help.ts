// Last modified: 2021/11/24 23:32:26
import { Message, Client, MessageActionRow, MessageButton, ColorResolvable } from "discord.js";
import { IBotCommand } from "../../IBotAPIs";
import { CommandType } from "../../config";
import { db, schemas } from "modulardiscordbot-db";
import { commands } from "../../app";

module.exports = class help implements IBotCommand {
    private readonly _info = {
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
    }
    private readonly _isTest = false;
    private readonly _Type = CommandType.GENERAL;

    info = {
        getCommand: (): string => { return this._info.command },
        getAliases: () => { return this._info.aliases },
        getDescription: (): string => { return this._info.description },
        getSyntax: (): string => { return this._info.syntax },
        getArguments: () => { return this._info.arguments },
        isTest: (): boolean => { return this._isTest },
        getType: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Message, client: Client): Promise<void> => {

        // Do not ocntinue if message author is a bot.
        if (msgObject.author.bot) return;

        // Handle based on arguements
        if (args.length == 0) {
            // send Help Message if no arguements
            await sendHelpList(client, msgObject);
        }else if (args.length > 0) {
            // Handle arguements
            let type = getCommandType(args[0]);
            args[0].toLowerCase() == 'list' || args[0].toLowerCase() == '--keep' 
                ? await sendHelpList(client, msgObject)
                : await sendCommandHelp(client, msgObject, args, type)
        }
    }
}

let sendHelpList = async (_client: Client, _msgObject: Message) => {
    if (!_msgObject.guild?.available) return;

    let _help = require("./help");
    let _helpClass = new _help() as IBotCommand;

    let _guildSettings = await new db(schemas.guild.coreGuildModel(_msgObject.guild, true));
    let _guildPrefix = String( _msgObject.content.substring(0,1) );

    let _title = `\`Usage: ${_guildPrefix + _helpClass.info.getCommand() + " " + _helpClass.info.getSyntax()}\`\n\n`;
    let _generalTitle = '**General Commands**\n', _generalCommands = ``;
    let _utilityTitle = '**Utility Commands**\n', _utilityCommands = ``;
    let _developerTitle = '**Development Commands**\n', _developerCommands = ``;
    let _categories: string[] = [];
    let _categorizedCommands = [];

    commands.sort();

    for (const command of commands) {
        try {

            if (await command.info.isTest() == true) {}else {
                let commandName = command.info.getCommand();
                let commandSyntax = command.info.getSyntax();
                let commandDesc = command.info.getDescription();

                if (!command.info.getSubcategory) {
                    switch (command.info.getType()) {
                        case (CommandType.GENERAL): { _generalCommands += `:white_medium_small_square: \`${_guildPrefix+commandName.charAt(0).toUpperCase()+commandName.slice(1)+" "+commandSyntax}\` - ${commandDesc}\n`; break; }
                        case (CommandType.UTILITY): { _utilityCommands += `:white_medium_small_square: \`${_guildPrefix+commandName.charAt(0).toUpperCase()+commandName.slice(1)+" "+commandSyntax}\` - ${commandDesc}\n`; break; }
                        case (CommandType.DEVELOPER): { _developerCommands += `:white_medium_small_square: \`${_guildPrefix+commandName.charAt(0).toUpperCase()+commandName.slice(1)+" "+commandSyntax}\` - ${commandDesc}\n`; break; }
                    }
                }else {
                    let _category = command.info.getSubcategory();
                    if (!_categories.includes(_category)) _categories.push(_category);
                    _categorizedCommands.push([_category, command.info.getType(), `> :white_medium_small_square: \`${_guildPrefix+commandName.charAt(0).toUpperCase()+commandName.slice(1)+" "+commandSyntax}\` - ${commandDesc}\n`]);
                }
            }

        }catch (exception) {
            console.log(exception);
        }
    }

    _categories.sort().reverse();
    _categorizedCommands.sort();

    for (const _category of _categories) {
        try {
            let _categoryTitle = `:small_blue_diamond: **${_category.charAt(0).toUpperCase()+_category.slice(1)}**\n`
            let _categoryGeneral = _categoryTitle;
            let _categoryUtility = _categoryTitle;
            let _categoryDeveloper = _categoryTitle;

            for (const _categorizedCommand of _categorizedCommands) {
                if (_categorizedCommand[0] != _category) continue;

                switch (_categorizedCommand[1]) {
                    case (CommandType.GENERAL): { _categoryGeneral += _categorizedCommand[2]; break; }
                    case (CommandType.UTILITY): { _categoryUtility += _categorizedCommand[2]; break; }
                    case (CommandType.DEVELOPER): { _categoryDeveloper += _categorizedCommand[2]; break; }
                }
            }

            if (_categoryGeneral != _categoryTitle) _generalCommands = (_categoryGeneral += _generalCommands);
            if (_categoryUtility != _categoryTitle) _utilityCommands = (_categoryUtility += _utilityCommands);
            if (_categoryDeveloper != _categoryTitle) _developerCommands = (_categoryDeveloper += _developerCommands);
        }catch (exception) {
            console.log(exception);
        }
    }

    const helpButtonRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel('Discord')
            .setURL('https://discord.gg/VYp9qprv2u')
            .setStyle('LINK'),
    )
    const helpEmbed = {
        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
        title: '**Commands**',
        description: _title+(_generalCommands ? (_generalTitle+_generalCommands) + "\n" : "")+(_utilityCommands ? (_utilityTitle+_utilityCommands) + "\n" : "")+(_developerCommands ? (_developerTitle+_developerCommands) + "\n" : ""),
        thumbnail: { 
            url: (_client.user?.displayAvatarURL() as string) 
        },
        timestamp: new Date(),
        footer: {
            text: (await _guildSettings.readRecords(undefined, "botname"))[0].botname,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    _msgObject.channel.send({embeds: [helpEmbed], components: [helpButtonRow]});
}

let sendCommandHelp = async (_client: Client, _msgObject: Message, args: string[], type: string) => {
    let _commandClass = commands.find((command) => { return command.info.getCommand() == args[0].toLowerCase() || (command.info.getAliases() as string[]).indexOf(args[0].toLowerCase()) > -1 });
    
    let sendembed = async (_command: string, _aliases: string, _usage: string, _args: string, _description: string) => {
        if (!_msgObject.guild?.available || type == "undefined") return;

        let _guildSettings = await new db(schemas.guild.coreGuildModel(_msgObject.guild, true));
        
        const embed = {
            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
            title: `**Command Information**`,
            description: _command+_aliases+_usage+_args+"\n"+_description,
            thumbnail: { 
                url: (_client.user?.displayAvatarURL() as string) 
            },
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
    
        _msgObject.channel.send({ embeds: [embed] });
    }
    let sendCommandEmbed = async (_commandClass: IBotCommand) => {
        if (!_msgObject.guild?.available || type == "undefined") return;
        let _cmdArgs: string[] = [];
        for (let _arg of _commandClass.info.getArguments() as []) {
            _cmdArgs.push(_arg["arg"]);
        }
        
        let _guildPrefix = String( _msgObject.content.substring(0,1) );
    
        let _command = `\`Command: ${_commandClass.info.getCommand().charAt(0).toUpperCase()+_commandClass.info.getCommand().slice(1)}\`\n`;
        let _usage = `\`Usage: ${_guildPrefix + _commandClass.info.getCommand() + " " + _commandClass.info.getSyntax()}\`\n`;
        let _aliases = (_commandClass.info.getAliases().length as number > 0) ? `\`Aliases: ${(_commandClass.info.getAliases() as string[]).sort().join(", ")}\`\n` : ""
        let _args = _cmdArgs ? ((_cmdArgs.length as number > 0) ? "> " + `\`Arguments: ${_cmdArgs.sort().join(", ")}\`\n` : "") : ""
        let _description = "> " + _commandClass.info.getDescription();

        await sendembed(_command, _aliases, _usage, _args, _description);
    }
    let handleSubargumentEmbed = async (_commandClass: IBotCommand) => {
        if (!_msgObject.guild?.available || type == "undefined") return;
        let _subArgument = (_commandClass.info.getArguments() as []).find((arg) => { return arg["arg"] == args[1].toLowerCase() });
        if (!_subArgument) return;

        let _guildPrefix = String( _msgObject.content.substring(0,1) );
    
        let _command = `\`Argument: ${(_subArgument["arg"] as string).charAt(0).toUpperCase()+(_subArgument["arg"] as string).slice(1)}\`\n`;
        let _usage = `\`Usage: ${_guildPrefix + _commandClass.info.getCommand() + " " + (_subArgument["syntax"] as string)}\`\n`;
        let _aliases = ((_subArgument["aliases"] as string[]).length as number > 0) ? `\`Aliases: ${(_subArgument["aliases"] as string[]).sort().join(", ")}\`\n` : ""
        let _args = ""
        let _description = "> " + _subArgument["description"] as string;

        await sendembed(_command, _aliases, _usage, _args, _description);
    }

    const errorButtonRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setLabel('Discord')
            .setURL('https://discord.gg/VYp9qprv2u')
            .setStyle('LINK'),
        new MessageButton()
            .setCustomId('error')
            .setLabel('Error (WIP)')
            .setStyle('DANGER')
    )
    let sendErrorEmbed = async () => {
        if (!_msgObject.guild?.available) return;

        const errorEmbed = {
            color: [255,0,0] as ColorResolvable,
            title: 'Error',
            description: `No command with the specified name or alias exists! \n\nPlease report any unfixable errors below.`,
            thumbnail: { 
                url: (_client.user?.displayAvatarURL() as string) 
            },
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
    
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
    }
    
    _commandClass
        ? args.length == 1 ? await sendCommandEmbed(_commandClass) : await handleSubargumentEmbed(_commandClass)
        : await sendErrorEmbed();
}

function getCommandType(targetCommand: string): string {
    for (const command of commands) {
        try {

            if (command.info.getCommand() == targetCommand.toLowerCase() || (command.info.getAliases() as string[]).indexOf(targetCommand.toLowerCase()) > -1) {
                switch (command.info.getType()) {
                    case (CommandType.GENERAL): { return "general"; }
                    case (CommandType.UTILITY): { return "utility"; }
                    case (CommandType.DEVELOPER): { return "developer"; }
                }
            }else {}

        }catch (exception) {
            console.log(exception);
        }
    }

    return "undefined";
}