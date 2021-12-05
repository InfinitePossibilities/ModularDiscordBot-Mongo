// Last modified: 2021/12/04 03:30:58
import { Client, Message, ColorResolvable, MessageComponentInteraction, ButtonInteraction, GuildMember } from "discord.js";
import { IBotCommand } from "../../../IBotAPIs";
import { CommandType } from "../../../config";
import { MessageComponentTypes } from "discord.js/typings/enums";
import { miscFunctions } from "../../../util";
import { db, schemas } from "modulardiscordbot-db";
import { main, guild } from "modulardiscordbot-auth";

module.exports = class nda implements IBotCommand {
    private readonly _info = {
        command: "nda",
        aliases: [],
        description: "Prompt to agree/sign NonDisclosure Agreement.",
        syntax: "",
        arguments: [
            {
                arg: "info",
                aliases: [],
                description: "Display info on user's NDA status",
                syntax: "info [@User]"
            }
        ],
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

    runCommand = async (_args: string[], _msgObject: Message, _client: Client): Promise<void> => {
        if (!_msgObject.guild?.available) return;
        
        let ndaDB = await new db(schemas.template.templateModel(`${_msgObject.guild.id}_NDA`, true));
        
        if (_args.length == 0) {
            if (!await miscFunctions.dbFunctions.template_RecordExists('userId', _msgObject.author.id, schemas.template.templateModel(`${_msgObject.guild.id}_NDA`, true))) {
                await sendNDA(_msgObject, _client);
                return;
            }
        }

        await handleArgs(_args, _msgObject, _client);
    }
}

let sendNDA = async (_msgObject: Message, _client: Client) => {
    if (!_msgObject.guild?.available) return;
    const ndaButtonRow = {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
            {
                label: "",
                style: "SUCCESS",
                emoji: "✅",
                customId: "nda-accept",
                type: MessageComponentTypes.BUTTON,
                disabled: false
            },
            {
                label: "",
                style: "DANGER",
                emoji: "⛔",
                customId: "nda-reject",
                type: MessageComponentTypes.BUTTON,
                disabled: false
            }
        ]
    }
    
    let _guildSettings = new db(schemas.guild.coreGuildModel(_msgObject.guild, true));

    const ndaEmbed = {
        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
        title: `NDA - ${_msgObject.author.username}`,
        description: `I, ${_msgObject.author}, agree not to disclose any information--confidential or otherwise--obtained from conversations within this server or within the Department of Homeland and Internal Security, in general to anyone unless required to do so by law and agree to the contents of and sign Standard Form 312, which can be found here: 
        https://drive.google.com/file/d/1Em1EjrbwPfZRUI6i2_XJZVlyQkZ4uWZS/view`,
        fields: [
            {
                name: "Status",
                value: "n/a",
                inline: true
            },
        ],
        timestamp: new Date(),
        thumbnail: {
            url: _client.user?.displayAvatarURL() as string,
        },
        footer: {
            text: _client.user?.username,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };

    await _msgObject.channel.send({embeds: [ndaEmbed], components: [ndaButtonRow]}).then((msg) => {

        const ndaFilter = (i: MessageComponentInteraction) => ( i.customId === 'nda-accept' || i.customId === 'nda-reject') && i.user.id === _msgObject.author.id;
        const ndaCollector = msg.createMessageComponentCollector({ filter: ndaFilter, max: 1, time: 25000 });

        ndaCollector.on('collect', async (buttoni: ButtonInteraction) => {
            if (buttoni.customId === 'nda-accept') {
                let ndaDB = await new db(schemas.template.templateModel(`${_msgObject.guild?.id}_NDA`, true, { 
                    userId: { type: String, required: true },
                    status: { type: String, required: true },
                    date: { type: Date, required: true }   
                }));
                ndaDB.createRecords([
                    {
                        userId: _msgObject.author.id,
                        status: "Accepted",
                        date: new Date(),
                    }
                ]);
                ndaEmbed.color = [0,255,0] as ColorResolvable;
                ndaEmbed.fields[0] = {
                    name: "Status",
                    value: "Accepted",
                    inline: true
                };
            }
            if (buttoni.customId === 'nda-reject') {
                ndaEmbed.color = [255,0,0] as ColorResolvable;
                ndaEmbed.fields[0] = {
                    name: "Status",
                    value: "Rejected",
                    inline: true
                };
            }
            ndaEmbed.description = "";
            msg.edit({ embeds: [ndaEmbed], components: [] });
            buttoni.deferUpdate();
        });

        ndaCollector.on("end", collected => {
            if (collected.size > 0) return;
            ndaEmbed.color = [255,0,0] as ColorResolvable;
            ndaEmbed.description = "";
            ndaEmbed.fields[0] = {
                name: "Status",
                value: "Timed out",
                inline: true
            };
            msg.edit({ embeds: [ndaEmbed], components: [] })
        });
    });
}

let handleArgs = async (_args: string[], _msgObject: Message, _client: Client) => {
    const errorButtonRow = {
        type: MessageComponentTypes.ACTION_ROW,
        components: [
            {
                label: "Discord",
                style: "LINK",
                url: "https://discord.gg/VYp9qprv2u",
                // customId: "nda-accept",
                type: MessageComponentTypes.BUTTON,
                disabled: false
            },
            {
                label: "Error (WIP)",
                style: "DANGER",
                customId: "error",
                type: MessageComponentTypes.BUTTON,
                disabled: false
            }
        ]
    }
    
    let errorEmbed = {
        color: [255,0,0] as ColorResolvable,
        title: "Error",
        description: "",
        thumbnail: { 
            url: (_client.user?.displayAvatarURL() as string) 
        },
        timestamp: new Date(),
        footer: {
            text: _client.user?.username,
            icon_url: _client.user?.displayAvatarURL(),
        },
    }
    
    if (_args.length == 0) {
        await sendStatus(_msgObject.author.id, _msgObject, _client);
        return;
    }
    if (_args.length == 1) {
        if (_args[0].toLowerCase() == "status") {
            await sendStatus(_msgObject.author.id, _msgObject, _client, (_msgObject.member as GuildMember));
            return;
        }
        errorEmbed.title = "Error - Invalid Arguments"
        errorEmbed.description = "Please use the help command for information on the valid arguments."
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
        return;
    }
    if (_args.length == 2) {
        if (!await _authenticate(_msgObject, _client)) return;
        if (_args[0].toLowerCase() == "status") {
            let _userid = _args[1].toLowerCase().replace("<@!","").replace(">","");
            let _guildMember = _msgObject.guild?.members.cache.find(member => { return member.user.id == _userid });
            if (_guildMember) { await sendStatus(_userid, _msgObject, _client, _guildMember); return; };
            
            errorEmbed.title = "Error - Invalid Member"
            errorEmbed.description = "The target user does not exist or is no longer in this Guild."
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        errorEmbed.title = "Error - Invalid Arguments"
        errorEmbed.description = "Please use the help command for information on the valid arguments."
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
        return;
    }
    errorEmbed.title = "Error - Invalid Arguments"
    errorEmbed.description = "Please use the help command for information on the valid arguments."
    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
    return;
}

let sendStatus = async (userid: string, _msgObject: Message, _client: Client, _member?: GuildMember) => {
    if (!_msgObject.guild?.available) return;

    let _guildSettings = new db(schemas.guild.coreGuildModel(_msgObject.guild, true));
    
    if (!await miscFunctions.dbFunctions.template_RecordExists('userId', userid, schemas.template.templateModel(`${_msgObject.guild.id}_NDA`, true))) {
        
        const rejectedEmbed = {
            color: [255,0,0] as ColorResolvable,
            title: `NDA - ${(_member) ? _member.user.username : userid}`,
            fields: [
                {
                    name: "Status",
                    value: "Not Signed",
                    inline: true
                },
            ],
            timestamp: new Date(),
            thumbnail: {
                url: _client.user?.displayAvatarURL() as string,
            },
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        await _msgObject.channel.send({embeds: [rejectedEmbed]})
        return;
    }
    
    const acceptedEmbed = {
        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
        title: `NDA - ${(_member) ? _member.user.username : userid}`,
        description: `I, <@${userid}>, agree not to disclose any information--confidential or otherwise--obtained from conversations within this server or within the Department of Homeland and Internal Security, in general to anyone unless required to do so by law and agree to the contents of and sign Standard Form 312, which can be found here: 
        https://drive.google.com/file/d/1Em1EjrbwPfZRUI6i2_XJZVlyQkZ4uWZS/view`,
        fields: [
            {
                name: "Status",
                value: "Accepted",
                inline: true
            },
        ],
        timestamp: new Date(),
        thumbnail: {
            url: _client.user?.displayAvatarURL() as string,
        },
        footer: {
            text: _client.user?.username,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    await _msgObject.channel.send({embeds: [acceptedEmbed]})
    return;
}

let _authenticate = async (msgObject: Message, _client: Client): Promise<boolean> => {
    if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !msgObject.guild?.available) return false;
    let localAuth = new guild.auth(msgObject.guild, msgObject.author);
    let mainAuth = new main.auth(msgObject.author);

    if (!(await mainAuth.isOwner() || await mainAuth.isDev() || localAuth.isGuildOwner() || await localAuth.isOwner() || await localAuth.isAdmin()) && !msgObject.author.bot) {
        const errorButtonRow = {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
                {
                    label: "Discord",
                    style: "LINK",
                    url: "https://discord.gg/VYp9qprv2u",
                    // customId: "nda-accept",
                    type: MessageComponentTypes.BUTTON,
                    disabled: false
                },
                {
                    label: "Error (WIP)",
                    style: "DANGER",
                    customId: "error",
                    type: MessageComponentTypes.BUTTON,
                    disabled: false
                }
            ]
        }

        const errorEmbed = {
            color: [255,0,0] as ColorResolvable,
            title: 'Error',
            description: `You do not have permission to run this command! \n\nPlease report any unfixable errors below.`,
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };

        await msgObject.channel.send({embeds: [errorEmbed], components: [errorButtonRow]}).then((msg) => {
            setTimeout(() => {
                (msg as Message).delete();
                msgObject.delete();
            }, 5000);
        });

        return false;
    }else {
        return true;
    }
}