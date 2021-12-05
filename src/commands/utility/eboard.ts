// Last modified: 2021/12/05 01:30:48
import { Message, Client, Role, ColorResolvable, MessageActionRow, MessageButton, MessageEmbed, TextChannel, MessageComponentInteraction } from "discord.js";
import { MessageComponentTypes } from "discord.js/typings/enums";
import { IBotCommand } from "../../IBotAPIs";
import { CommandType } from "../../config";
import { miscFunctions } from "../../util";
import { main, guild } from "modulardiscordbot-auth";
import { db, schemas } from "modulardiscordbot-db";

module.exports = class eboard implements IBotCommand {
    private readonly _info = {
        command: "eboard",
        aliases: ["board", "eboards", "boards", "embedboard", "embedboards"],
        description: "Managable embed boards",
        syntax: "[args]",
        arguments: [
            {
                arg: "create",
                aliases: ["c"],
                description: "Create new managable embed board",
                syntax: "create [board] <channel>",
            },
            {
                arg: "delete",
                aliases: ["d", "del", "remove", "rem"],
                description: "Delete existing managable embed board",
                syntax: "delete [board]",
            },
            {
                arg: "unlink",
                aliases: ["ul"],
                description: "Similar to delete- removes the board from the database but keeps the message. This is irreversible.",
                syntax: "unlink [board]",
            },
            {
                arg: "edit",
                aliases: ["e"],
                description: "Edit existing managable embed board\n\nSettings: name, author, authorurl, title, titleUrl, description, color, footerText, footerIcon(url/client), thumbnail(url/client)",
                syntax: "edit [board]",
            },
            {
                arg: "addfield",
                aliases: ["af", "addfields"],
                description: "Add a field to an existing managable embed board",
                syntax: "addfield [board]",
            },
            {
                arg: "deletefield",
                aliases: ["df", "removefield", "rf", "deletefields", "removefields"],
                description: "Delete a field from an existing managable embed board",
                syntax: "deletefield [board]",
            },
            {
                arg: "editfield",
                aliases: ["ef", "editfields"],
                description: "Edit a field in an existing managable embed board",
                syntax: "editfield [board]",
            },
            {
                arg: "listfields",
                aliases: ["lf"],
                description: "List existing fields in an existing managable embed board",
                syntax: "listfields [board]",
            },
            {
                arg: "listboards",
                aliases: ["boards", "lb"],
                description: "List existing managable embed boards",
                syntax: "listboards",
            }
        ]
    }
    private readonly _isTest = false;
    private readonly _Type = CommandType.UTILITY;

    info = {
        getCommand: (): string => { return this._info.command },
        getAliases: () => { return this._info.aliases },
        getDescription: (): string => { return this._info.description },
        getSyntax: (): string => { return this._info.syntax },
        getArguments: () => { return this._info.arguments },
        isTest: (): boolean => { return this._isTest },
        getType: (): CommandType => { return this._Type }
    }

    runCommand = async (_args: string[], _msgObject: Message, _client: Client): Promise<void> => {
        // TODO:
        if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !_msgObject.guild?.available) return;
        if (!await _authenticate(_msgObject, _client)) return;
        
        let localAuth = new guild.auth(_msgObject.guild, _msgObject.author);
        let mainAuth = new main.auth(_msgObject.author);
        let role = (_msgObject.guild.roles.cache.find((r) => { return r.id === "909579278159601675" }) as Role);

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
            errorEmbed.title = "Error - Missing required arguments";
            errorEmbed.description = "Please use the help command for information on the valid arguments.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
        }
        if (_args.length > 0) {
            let subArgument = _args[0];
            if (this._info.arguments.find(arg => { return arg.arg === subArgument.toLowerCase() || arg.aliases.indexOf(subArgument.toLowerCase()) > -1 })) {
                await handleArguments(_args, _msgObject, _client, this._info.arguments);
                // console.log(0, _args[0], 1,_args[1], 2,_args[2], 3,_args[3], 4,_args[4]);
                return;
            }
            errorEmbed.title = "Error - Invalid arguments";
            errorEmbed.description = "Please use the help command for information on the valid arguments.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
        }
        // -eboard addfield test true ahhh
        // 0 addfield 1 test 2 true 3 ahhh
    }
}
interface argsInterface {
    arg: string;
    aliases: string[];
    description: string;
    syntax: string;
}
let handleArguments = async (_args: string[], _msgObject: Message, _client: Client, _arguments: argsInterface[]) => {
    let _subCommand = _arguments.find(arg => { return arg.arg === _args[0].toLowerCase() || arg.aliases.indexOf(_args[0].toLowerCase()) > -1 });
    if (!_subCommand) return;
    if (!_msgObject.guild?.available) return;
    let _guildSettings = await new db(schemas.guild.coreGuildModel(_msgObject.guild, true));
    
    let _embedBoardSchema = await schemas.template.templateSchema(`${_msgObject.guild?.id}_EmbedBoards`, {
        message: { type: {
            id: { type: String, required: true },
            channelId: { type: String, required: true },
        }, required: true },
        boardName: { type: String, required: true },
        
        author: { type: {
            name: { type: String, required: true },
            url: { type: String, required: true },
        }, default: { name: "Author", url: `https://discord.com/channels/${_msgObject.guild.id}/${_msgObject.channel.id}` } },
        title: { type: String, default: "Title" },
        url: { type: String, default: `https://discord.com/channels/${_msgObject.guild.id}/${_msgObject.channel.id}` },
        description: { type: String, default: "This is a template board!" },
        color: { type: [Number], default: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor },
        footer: { type: {
            text: { type: String, required: true },
            iconURL: { type: String, required: true },
        }, default: { text: "Footer Text", iconURL: _client.user?.displayAvatarURL() } },
        thumbnail: { type: {
            url: { type: String, required: true },
        }, default: { url: _client.user?.displayAvatarURL() }},
        fields: { type: [ { 
            name: { type: String, required: true }, 
            value: { type: String, required: true }, 
            inline: { type: Boolean, required: true }, 
        } ], default: { name: "Field Name", value: "Field Value", inline: false } },
    });
    
    let _embedBoardDB = await new db(schemas.template.templateModel(`${_msgObject.guild?.id}_EmbedBoards`, true, _embedBoardSchema));

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

    let handleQuestions = async (questionObj: { id: string; questions: { id: string; question: string; response: string; }[]; }, editPropsObj: { args: { arg: string; prop: string; subprop: string; issubprop: boolean; required: boolean; nullable: boolean; default: boolean; }[]; } | undefined ) => {
        let removeButton = {
            label: "Remove",
            style: "DANGER",
            customId: "remove-setting",
            type: MessageComponentTypes.BUTTON,
            disabled: false
        }
        let clientButton = {
            label: "Default",
            style: "PRIMARY",
            customId: "set-default",
            type: MessageComponentTypes.BUTTON,
            disabled: false
        }
        let valueRow = {
            type: MessageComponentTypes.ACTION_ROW,
            components: [] as {
                label: string;
                style: string;
                customId: string;
                type: MessageComponentTypes;
                disabled: boolean;
            }[] | never
        }
        let questionEmbed = {
            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
            title: questionObj.id,
            description: ``,
            thumbnail: {
                url: _client.user?.displayAvatarURL(),
            },
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        }
        
        for (let question of questionObj.questions) {
            questionEmbed.description = question.question;

            if (question.id === "Setting Value") {
                if (editPropsObj) {
                    let _setting = questionObj.questions.find(q => { return q.id === "Setting Name" });
                    let _targetArg = editPropsObj.args.find(arg => { return arg.arg === _setting?.response.toLowerCase() });
                    if (_targetArg?.nullable) valueRow.components.push(removeButton);
                    if (_targetArg?.default) valueRow.components.push(clientButton);
                    let _msg = _msgObject.channel.send({ embeds: [questionEmbed], components: [valueRow] });
                    
                    let _argFilter = (msg: Message) => { return msg.author.id === _msgObject.author.id };
                    let _argCollector = _msgObject.channel.createMessageCollector({ filter: _argFilter, max: 1, time: 25000 });
                    const _buttonFilter = (i: MessageComponentInteraction) => ( i.customId === 'set-default' || i.customId === 'remove-setting') && i.user.id === _msgObject.author.id;
                    const _controlsCollector = (await _msg).createMessageComponentCollector({ filter: _buttonFilter, max: 1, time: 25000 });
                    
                    let response = await new Promise(async (resolve, reject) => {
                        _argCollector.on("collect", (msg: Message) => {
                            _controlsCollector.stop("collected");
                            resolve(msg.content);
                        });
                        _argCollector.on("end", (collected, reason) => {
                            if (reason === "collected" || collected.size > 0) return;
                            resolve("");
                        });
                        _controlsCollector.on("collect", (collected: MessageComponentInteraction) => {
                            if (collected.customId === 'set-default') {
                                if (valueRow.components[0]) valueRow.components[0].disabled = true;
                                if (valueRow.components[1]) valueRow.components[1].disabled = true;
                                (collected.message as Message<boolean>).edit({ embeds: [questionEmbed], components: [valueRow] });
                                
                                _argCollector.stop("collected");
                                collected.deferUpdate();
                                _controlsCollector.stop("collected");
                                resolve("default");
                            }
                            if (collected.customId === 'remove-setting') {
                                if (valueRow.components[0]) valueRow.components[0].disabled = true;
                                if (valueRow.components[1]) valueRow.components[1].disabled = true;
                                (collected.message as Message<boolean>).edit({ embeds: [questionEmbed], components: [valueRow] });

                                _argCollector.stop("collected");
                                collected.deferUpdate();
                                _controlsCollector.stop("collected");
                                resolve("remove");
                            }
                        });
                        _controlsCollector.on("end", (collected, reason) => {
                            if (reason === "collected" || collected.size > 0) return;
                            resolve("");
                        });
                    });
                    if (response) {
                        question.response = (await response as string);
                        continue;
                    }
                    errorEmbed.title = questionObj.id + " - Cancelled"
                    errorEmbed.description = `You failed to answer the \`${question.id}\` question.`
                    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                    break;
                }
            }
            _msgObject.channel.send({ embeds: [questionEmbed] });

            let _argFilter = (msg: Message) => { return msg.author.id === _msgObject.author.id };
            let _argCollector = _msgObject.channel.createMessageCollector({ filter: _argFilter, max: 1, time: 25000 });

            let response = await new Promise((resolve, reject) => {
                _argCollector.on("collect", (msg: Message) => {
                    resolve(msg.content);
                });
                _argCollector.on("end", (collected) => {
                    resolve("");
                });
            });
            if (response) {
                question.response = (await response as string);
                continue;
            }
            errorEmbed.title = questionObj.id + " - Cancelled"
            errorEmbed.description = `You failed to answer the \`${question.id}\` question.`
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            break;
        }
    }
    let responseCheck = async (questionObj: { id: string; questions: { id: string; question: string; response: string; }[]; }) => {
        for (let question of questionObj.questions) {
            if (question.response) continue;
            return false;
        }
        return true;
    }
    
    interface _boardInterface {
        "message": {
            id: string,
            channelId: string
        };
        "boardName": string;
        
        "author": {
            name: string,
            url: string,
        } | undefined,
        "title": string;
        "url": string;
        "description": string;
        "color": any;
        "footer": {
            text: string,
            iconURL: string,
        };
        "thumbnail": {
            url: string;
        } | undefined,
        "fields": [
            {
                name: string;
                value: string;
                inline: boolean
            }
        ] | []
    }
    let _boardName = _args[1] ? _args[1] : "";
    
    if (_boardName) {
        if (_subCommand.arg == "create") {
            let _channelid = _args[2] ? _args[2].replace("<","").replace("#","").replace(">","") : "";
            let _channel = _msgObject.guild?.channels.cache.find(channel => { return channel.id === _channelid });
            
            if (_channel) {
                // _msgObject.channel.send(`Creating board ${_boardName} in ` + _channel);
                (_channel as TextChannel).send("embed").then(msg => {
                    _embedBoardDB.createRecords([{
                        message: {
                            id: msg.id,
                            channelId: _channel
                        },
                        boardName: _boardName
                    }]).then(async (newRecords) => {
                        msg.edit({ content: null, embeds: [newRecords[0] as _boardInterface]});
                    });
                });
                return;
            }
            // _msgObject.channel.send(`No channel specified- creating board ${_boardName} here in this channel: ` + _msgObject.channel);
            _msgObject.channel.send("embed").then(msg => {
                _embedBoardDB.createRecords([{
                    message: {
                        id: msg.id,
                        channelId: msg.channel.id
                    },
                    boardName: _boardName
                }]).then(async (newRecords) => {
                    msg.edit({ content: null, embeds: [newRecords[0] as _boardInterface]});
                }); 
            });
            return;
        }
        if (_subCommand.arg == "delete") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === (_boardRecord as _boardInterface).message.channelId; });
                let _boardmessage = (_boardchannel as TextChannel).messages.fetch((_boardRecord as _boardInterface).message.id);

                await (await _boardmessage).delete();
                await _embedBoardDB.deleteRecords([{ boardName: _boardName }]);

                let successEmbed = {
                    color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
                    title: "Board Deleted",
                    description: `Successfully deleted the \`${_boardName}\` board.`,
                    thumbnail: {
                        url: _client.user?.displayAvatarURL(),
                    },
                    timestamp: new Date(),
                    footer: {
                        text: _client.user?.username,
                        icon_url: _client.user?.displayAvatarURL(),
                    },
                }
                _msgObject.channel.send({ embeds: [successEmbed] });
                return;
            }
            errorEmbed.title = "Error - Does not exist"
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid."
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "unlink") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                await _embedBoardDB.deleteRecords([{ boardName: _boardName }]);

                let successEmbed = {
                    color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
                    title: "Board UnLinked",
                    description: `Successfully unlinked the \`${_boardName}\` board.`,
                    thumbnail: {
                        url: _client.user?.displayAvatarURL(),
                    },
                    timestamp: new Date(),
                    footer: {
                        text: _client.user?.username,
                        icon_url: _client.user?.displayAvatarURL(),
                    },
                }
                _msgObject.channel.send({ embeds: [successEmbed] });
                return;
            }
            errorEmbed.title = "Error - Does not exist"
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid."
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "edit") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === (_boardRecord as _boardInterface).message.channelId; });
                let _boardmessage = (_boardchannel as TextChannel).messages.fetch((_boardRecord as _boardInterface).message.id);
                if (await _boardmessage) {
                    let _defaults = [
                        {
                            arg: "authoricon",
                            default: `https://discord.com/channels/${_msgObject.guild.id}/${_msgObject.channel.id}`,
                        },
                        {
                            arg: "color",
                            default: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
                        },
                        {
                            arg: "footertext",
                            default: (await _guildSettings.readRecords(undefined, "botname"))[0].botname,
                        },
                        {
                            arg: "footericon",
                            default: _client.user?.displayAvatarURL(),
                        },
                        {
                            arg: "thumbnail",
                            default: _client.user?.displayAvatarURL(),
                        }
                    ]
                    let _editArgs = {
                        args: [
                            {
                                arg: "author",
                                prop: "author",
                                subprop: "name",
                                issubprop: true,
                                required: true,
                                nullable: true,
                                default: false
                            },
                            {
                                arg: "authorurl",
                                prop: "author",
                                subprop: "url",
                                issubprop: true,
                                required: false,
                                nullable: true,
                                default: false
                            },
                            {
                                arg: "authoricon",
                                prop: "author",
                                subprop: "iconURL",
                                issubprop: true,
                                required: false,
                                nullable: true,
                                default: true
                            },
                            {
                                arg: "title",
                                prop: "title",
                                subprop: "",
                                issubprop: false,
                                required: false,
                                nullable: true,
                                default: false
                            },
                            {
                                arg: "titleurl",
                                prop: "url",
                                subprop: "",
                                issubprop: false,
                                required: false,
                                nullable: true,
                                default: false
                            },
                            {
                                arg: "description",
                                prop: "description",
                                subprop: "",
                                issubprop: false,
                                required: false,
                                nullable: true,
                                default: false
                            },
                            {
                                arg: "color",
                                prop: "color",
                                subprop: "",
                                issubprop: false,
                                required: false,
                                nullable: true,
                                default: true
                            },
                            {
                                arg: "footertext",
                                prop: "footer",
                                subprop: "text",
                                issubprop: true,
                                required: true,
                                nullable: true,
                                default: true
                            },
                            {
                                arg: "footericon",
                                prop: "footer",
                                subprop: "iconURL",
                                issubprop: true,
                                required: false,
                                nullable: true,
                                default: true
                            },
                            {
                                arg: "thumbnail",
                                prop: "thumbnail",
                                subprop: "url",
                                issubprop: true,
                                required: true,
                                nullable: true,
                                default: true
                            },
                        ],
                    }
                    let questionObject = {
                        id: "Edit Board",
                        questions: [
                            {
                                id: "Setting Name",
                                question: "Please specify the setting to edit.\n\nAvailable Settings: author, authorurl, authoricon, title, titleUrl, description, color, footerText, footerIcon(url/client), thumbnail(url/client)",
                                response: ""
                            },
                            {
                                id: "Setting Value",
                                question: "Please specify the setting value.",
                                response: ""
                            },
                        ],
                    }
                    await handleQuestions(questionObject, _editArgs);
                    if (!await responseCheck(questionObject)) return;
    
                    let _answers = {
                        setting: questionObject.questions.find(question => { return question.id === "Setting Name" })?.response as string,
                        value: questionObject.questions.find(question => { return question.id === "Setting Value" })?.response as string | null | any,
                    };
                    let _targetArg = _editArgs.args.find(arg => { return arg.arg === _answers.setting.toLowerCase() });
                    if (_targetArg) {
                        if (_answers.value == "remove" && _editArgs.args.find(arg => { return arg.arg == _answers.setting })?.nullable) _answers.value = null;
                        if ((_answers.value == "default" || _answers.value == "client") && _editArgs.args.find(arg => { return arg.arg == _answers.setting })?.default) _answers.value = await _defaults.find((def) => { return def.arg == _answers.setting })?.default;
                        
                        _targetArg.issubprop ? (_boardRecord)[_targetArg.prop][_targetArg.subprop] = _answers.value : (_boardRecord)[_targetArg.prop] = _answers.value;
                        await (await _boardmessage).edit({ embeds: [_boardRecord] });
                        await _embedBoardDB.updateRecords( [{ boardName: _boardName }], { [(_targetArg.prop as string)]: (_boardRecord)[_targetArg.prop] } );

                        let successEmbed = {
                            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
                            title: "Board Updated",
                            description: `Successfully set setting \`${_answers.setting}\` to value \`${_answers.value}\` for ${_boardName} board.`,
                            thumbnail: {
                                url: _client.user?.displayAvatarURL(),
                            },
                            timestamp: new Date(),
                            footer: {
                                text: _client.user?.username,
                                icon_url: _client.user?.displayAvatarURL(),
                            },
                        }
                        _msgObject.channel.send({ embeds: [successEmbed] });
                        return;
                    }
                    errorEmbed.title = "Error - Setting not valid"
                    errorEmbed.description = "The setting you specified is not a valid listed setting."
                    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                    return;
                }
                errorEmbed.title = "Error - Missing Board"
                errorEmbed.description = "The board you specified no longer exists or has been removed."
                _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                return;
            }
            errorEmbed.title = "Error - Does not exist"
            errorEmbed.description = "There are no records of the board you have specified in my database. \n\nPlease make sure the name is valid."
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "addfield") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === (_boardRecord as _boardInterface).message.channelId; });
                let _boardmessage = (_boardchannel as TextChannel).messages.fetch((_boardRecord as _boardInterface).message.id);
                
                if (await _boardmessage) {
                    let questionObject = {
                        id: "Add Field",
                        questions: [
                            {
                                id: "Field Name",
                                question: "Please specify the new field name.",
                                response: ""
                            },
                            {
                                id: "Field Value",
                                question: "Please specify the value for the field.",
                                response: ""
                            },
                            {
                                id: "Inline",
                                question: "Please specify if the field should be inline via true/false response.",
                                response: ""
                            }
                        ],
                    }
                    await handleQuestions(questionObject, undefined);
                    if (!await responseCheck(questionObject)) return;
                    
                    let _newField = {
                        name: questionObject.questions.find(question => { return question.id === "Field Name" })?.response as string,
                        value: questionObject.questions.find(question => { return question.id === "Field Value" })?.response as string,
                        inline: (questionObject.questions.find(question => { return question.id === "Inline" })?.response.toLowerCase() === 'true' ? true : questionObject.questions.find(question => { return question.id === "Inline" })?.response.toLowerCase() === 'false' ? false : false),
                    };
                    
                    ((_boardRecord as _boardInterface).fields as [{ name: string, value: string, inline: boolean }]).push(_newField);
                    await (await _boardmessage).edit({ embeds: [_boardRecord] });
                    await _embedBoardDB.updateRecords( [{ boardName: _boardName }], { fields: (_boardRecord as _boardInterface).fields} );

                    let successEmbed = {
                        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
                        title: "Board Updated",
                        description: `Successfully added inline \`${_newField.inline}\` field \`${_newField.name}\` with value \`${_newField.value}\` to ${_boardName} board.`,
                        thumbnail: {
                            url: _client.user?.displayAvatarURL(),
                        },
                        timestamp: new Date(),
                        footer: {
                            text: _client.user?.username,
                            icon_url: _client.user?.displayAvatarURL(),
                        },
                    }
                    _msgObject.channel.send({ embeds: [successEmbed] });
                    return;
                }
                errorEmbed.title = "Error - Missing Board"
                errorEmbed.description = "The board you specified no longer exists or has been removed."
                _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                return;
            }
            errorEmbed.title = "Error - Does not exist"
            errorEmbed.description = "There are no records of the board you have specified in my database. \n\nPlease make sure the name is valid."
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "deletefield") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === (_boardRecord as _boardInterface).message.channelId; });
                let _boardmessage = (_boardchannel as TextChannel).messages.fetch((_boardRecord as _boardInterface).message.id);

                if (_boardmessage) {
                    let questionObject = {
                        id: "Add Field",
                        questions: [
                            {
                                id: "Field Name",
                                question: "Please specify the field to delete.",
                                response: ""
                            }
                        ],
                    }
                    await handleQuestions(questionObject, undefined);
                    if (!await responseCheck(questionObject)) return;
                    
                    ((_boardRecord as _boardInterface).fields) = (((_boardRecord as _boardInterface).fields).filter(field => { return field.name != questionObject.questions.find(question => { return question.id === "Field Name" })?.response as string }) as [{ name: string, value: string, inline: boolean }]);
                    await (await _boardmessage).edit({ embeds: [_boardRecord] });
                    await _embedBoardDB.updateRecords( [{ boardName: _boardName }], { fields: (_boardRecord as _boardInterface).fields} );
    
                    let successEmbed = {
                        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
                        title: "Board Updated",
                        description: `Successfully deleted field \`${questionObject.questions.find(question => { return question.id === "Field Name" })?.response as string}\` from \`${_boardName}\` board.`,
                        thumbnail: {
                            url: _client.user?.displayAvatarURL(),
                        },
                        timestamp: new Date(),
                        footer: {
                            text: _client.user?.username,
                            icon_url: _client.user?.displayAvatarURL(),
                        },
                    }
                    _msgObject.channel.send({ embeds: [successEmbed] });
                    return;
                }
                errorEmbed.title = "Error - Missing Board"
                errorEmbed.description = "The board you specified no longer exists or has been removed."
                _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                return;
            }
            errorEmbed.title = "Error - Does not exist";
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "editfield") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === (_boardRecord as _boardInterface).message.channelId; });
                let _boardmessage = (_boardchannel as TextChannel).messages.fetch((_boardRecord as _boardInterface).message.id);

                if (await _boardmessage) {
                    let questionObject = {
                        id: "Add Field",
                        questions: [
                            {
                                id: "Current Name",
                                question: "Please specify by name the field to edit.",
                                response: ""
                            },
                            {
                                id: "Field Name",
                                question: "Please specify the new field name.",
                                response: ""
                            },
                            {
                                id: "Field Value",
                                question: "Please specify the value for the field.",
                                response: ""
                            },
                            {
                                id: "Inline",
                                question: "Please specify if the field should be inline via true/false response.",
                                response: ""
                            }
                        ],
                    }
                    await handleQuestions(questionObject, undefined);
                    if (!await responseCheck(questionObject)) return;
                    
                    let _newField = {
                        name: questionObject.questions.find(question => { return question.id === "Field Name" })?.response as string,
                        value: questionObject.questions.find(question => { return question.id === "Field Value" })?.response as string,
                        inline: (questionObject.questions.find(question => { return question.id === "Inline" })?.response.toLowerCase() === 'true' ? true : questionObject.questions.find(question => { return question.id === "Inline" })?.response.toLowerCase() === 'false' ? false : false),
                    };
                    
                    let _existingFieldName = questionObject.questions.find(question => { return question.id === "Current Name" })?.response as string;
                    let _existingField = ((_boardRecord as _boardInterface).fields as [{ name: string, value: string, inline: boolean }]).find(field => { return field.name === _existingFieldName });
                    if (_existingField) {
                        _existingField.name = _newField.name;
                        _existingField.value = _newField.value;
                        _existingField.inline = _newField.inline;
    
                        await (await _boardmessage).edit({ embeds: [_boardRecord] });
                        await _embedBoardDB.updateRecords( [{ boardName: _boardName }], { fields: (_boardRecord as _boardInterface).fields} );
    
                        let successEmbed = {
                            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
                            title: "Board Updated",
                            description: `Successfully renamed field \`${_existingFieldName}\` to \`${_newField.name}\` and set inline \`${_newField.inline}\` with value \`${_newField.value}\` in \`${_boardName}\` board.`,
                            thumbnail: {
                                url: _client.user?.displayAvatarURL(),
                            },
                            timestamp: new Date(),
                            footer: {
                                text: _client.user?.username,
                                icon_url: _client.user?.displayAvatarURL(),
                            },
                        }
                        _msgObject.channel.send({ embeds: [successEmbed] });
                        return;
                    }
                    errorEmbed.title = "Error - Does not exist"
                    errorEmbed.description = "There are no records of the field you have specified for this board. \n\nPlease make sure the name is valid."
                    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                    return;
                }
                errorEmbed.title = "Error - Missing Board"
                errorEmbed.description = "The board you specified no longer exists or has been removed."
                _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                return;
            }
            errorEmbed.title = "Error - Does not exist"
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid."
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "listfields") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardFields = (_boardRecord as _boardInterface).fields;
                let _fieldList = new Array();
                let _itemsPerPage = 20;
                let _currentPage = 1;
                let _pageCount = 0;

                _boardFields.forEach(field => {
                    _fieldList.push(field.name);
                });

                _fieldList.sort();
                let _firstPage = _fieldList.slice((_currentPage-1) * _itemsPerPage, (_currentPage-1) * _itemsPerPage + _itemsPerPage);
                _pageCount = Math.ceil(_fieldList.length / _itemsPerPage);

                const _fieldListButtonRow = {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            customId: "prev",
                            emoji: "⏪",
                            style: "PRIMARY",
                            // customId: "nda-accept",
                            type: MessageComponentTypes.BUTTON,
                            disabled: true
                        },
                        {
                            customId: "next",
                            emoji: "⏩",
                            style: "PRIMARY",
                            // customId: "nda-accept",
                            type: MessageComponentTypes.BUTTON,
                            disabled: _pageCount == 1 ? true : false
                        }
                    ]
                }

                let _fieldListEmbed = {
                    color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
                    title: `${_boardName} Fields`,
                    description: _firstPage.join('\n'),
                    thumbnail: {
                        url: _client.user?.displayAvatarURL(),
                    },
                    timestamp: new Date(),
                    footer: {
                        text: `1 of ${_pageCount}`,
                        icon_url: _client.user?.displayAvatarURL(),
                    },
                }
                
                _msgObject.channel.send({ embeds: [_fieldListEmbed], components: [_fieldListButtonRow] }).then(msg => {
                    const _controlsFilter = (i: MessageComponentInteraction) => ( i.customId === 'prev' || i.customId === 'next') && i.user.id === _msgObject.author.id;
                    const _controlsCollector = msg.createMessageComponentCollector({ filter: _controlsFilter, time: 60000 });

                    _controlsCollector.on("collect", (_button => {
                        if (_button.customId == 'next') {
                            if (_currentPage >= _pageCount) { 
                                _currentPage = _pageCount;
                                _fieldListButtonRow.components[1].disabled = true;
                                msg.edit({ embeds: [_fieldListEmbed], components: [_fieldListButtonRow] });
                                _button.deferUpdate();
                                return;
                            };
                            
                            _currentPage++;
                            let _begin = (_currentPage - 1) * _itemsPerPage;
                            let _end = _begin + _itemsPerPage;
                            let _pageItems = _fieldList.slice(_begin, _end);
                            
                            _fieldListEmbed.description = _pageItems.join('\n');
                            _fieldListEmbed.footer.text = `${_currentPage} of ${_pageCount}`;
                            if (_currentPage <= _pageCount) { _fieldListButtonRow.components[0].disabled = false; };
                            if (_currentPage <= _pageCount) { _fieldListButtonRow.components[1].disabled = true; };
                            
                            msg.edit({ embeds: [_fieldListEmbed], components: [_fieldListButtonRow] });
                            _button.deferUpdate();
                        }
                        if (_button.customId == 'prev') {
                            if (_currentPage <= 1) { 
                                _currentPage = 1;
                                _fieldListButtonRow.components[0].disabled = true;
                                msg.edit({ embeds: [_fieldListEmbed], components: [_fieldListButtonRow] });
                                _button.deferUpdate();
                                return;
                            };
                            
                            _currentPage--;
                            let _begin = (_currentPage - 1) * _itemsPerPage;
                            let _end = _begin + _itemsPerPage;
                            let _pageItems = _fieldList.slice(_begin, _end);
                            
                            _fieldListEmbed.description = _pageItems.join('\n');
                            _fieldListEmbed.footer.text = `${_currentPage} of ${_pageCount}`;
                            if (_currentPage <= _pageCount) { _fieldListButtonRow.components[0].disabled = true; };
                            if (_currentPage <= _pageCount) { _fieldListButtonRow.components[1].disabled = false; };
                            
                            msg.edit({ embeds: [_fieldListEmbed], components: [_fieldListButtonRow] });
                            _button.deferUpdate();
                        }
                    }));

                    _controlsCollector.on("end", (_button) => {
                        _fieldListButtonRow.components[0].disabled = true;
                        _fieldListButtonRow.components[1].disabled = true;
                        msg.edit({ embeds: [_fieldListEmbed], components: [_fieldListButtonRow] });
                    });
                });
                return;
            }
            errorEmbed.title = "Error - Does not exist"
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid."
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        return;
    }
    if (_subCommand.arg == "listboards") {
        let _boardRecords = (await _embedBoardDB.readAllRecords()) as _boardInterface[];
        if (_boardRecords) {
            let _boardList = new Array();
            let _itemsPerPage = 20;
            let _currentPage = 1;
            let _pageCount = 0;
            
            for (let _board of _boardRecords) {
                let _boardchannel = _msgObject.guild?.channels.cache.find(channel => { return channel.id === (_board as _boardInterface).message.channelId; });
                let _boardmessage = (_boardchannel as TextChannel).messages.fetch(_board.message.id);

                if (await _boardmessage) {
                    _boardList.push(`[${_board.boardName}](${(await _boardmessage).url})`);
                }
            }

            _boardList.sort();
            let _firstPage = _boardList.slice((_currentPage-1) * _itemsPerPage, (_currentPage-1) * _itemsPerPage + _itemsPerPage);
            _pageCount = Math.ceil(_boardList.length / _itemsPerPage);

            const _boardListButtonRow = {
                type: MessageComponentTypes.ACTION_ROW,
                components: [
                    {
                        customId: "prev",
                        emoji: "⏪",
                        style: "PRIMARY",
                        // customId: "nda-accept",
                        type: MessageComponentTypes.BUTTON,
                        disabled: true
                    },
                    {
                        customId: "next",
                        emoji: "⏩",
                        style: "PRIMARY",
                        // customId: "nda-accept",
                        type: MessageComponentTypes.BUTTON,
                        disabled: _pageCount == 1 ? true : false
                    }
                ]
            }

            let _boardListEmbed = {
                color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
                title: `Board List`,
                description: _firstPage.join('\n'),
                thumbnail: {
                    url: _client.user?.displayAvatarURL(),
                },
                timestamp: new Date(),
                footer: {
                    text: `1 of ${_pageCount}`,
                    icon_url: _client.user?.displayAvatarURL(),
                },
            }
            
            _msgObject.channel.send({ embeds: [_boardListEmbed], components: [_boardListButtonRow] }).then(msg => {
                const _controlsFilter = (i: MessageComponentInteraction) => ( i.customId === 'prev' || i.customId === 'next') && i.user.id === _msgObject.author.id;
                const _controlsCollector = msg.createMessageComponentCollector({ filter: _controlsFilter, time: 60000 });

                _controlsCollector.on("collect", (_button => {
                    if (_button.customId == 'next') {
                        if (_currentPage >= _pageCount) { 
                            _currentPage = _pageCount;
                            _boardListButtonRow.components[1].disabled = true;
                            msg.edit({ embeds: [_boardListEmbed], components: [_boardListButtonRow] });
                            _button.deferUpdate();
                            return;
                        };
                        
                        _currentPage++;
                        let _begin = (_currentPage - 1) * _itemsPerPage;
                        let _end = _begin + _itemsPerPage;
                        let _pageItems = _boardList.slice(_begin, _end);
                        
                        _boardListEmbed.description = _pageItems.join('\n');
                        _boardListEmbed.footer.text = `${_currentPage} of ${_pageCount}`;
                        if (_currentPage <= _pageCount) { _boardListButtonRow.components[0].disabled = false; };
                        if (_currentPage <= _pageCount) { _boardListButtonRow.components[1].disabled = true; };
                        
                        msg.edit({ embeds: [_boardListEmbed], components: [_boardListButtonRow] });
                        _button.deferUpdate();
                    }
                    if (_button.customId == 'prev') {
                        if (_currentPage <= 1) { 
                            _currentPage = 1;
                            _boardListButtonRow.components[0].disabled = true;
                            msg.edit({ embeds: [_boardListEmbed], components: [_boardListButtonRow] });
                            _button.deferUpdate();
                            return;
                        };
                        
                        _currentPage--;
                        let _begin = (_currentPage - 1) * _itemsPerPage;
                        let _end = _begin + _itemsPerPage;
                        let _pageItems = _boardList.slice(_begin, _end);
                        
                        _boardListEmbed.description = _pageItems.join('\n');
                        _boardListEmbed.footer.text = `${_currentPage} of ${_pageCount}`;
                        if (_currentPage <= _pageCount) { _boardListButtonRow.components[0].disabled = true; };
                        if (_currentPage <= _pageCount) { _boardListButtonRow.components[1].disabled = false; };
                        
                        msg.edit({ embeds: [_boardListEmbed], components: [_boardListButtonRow] });
                        _button.deferUpdate();
                    }
                }));

                _controlsCollector.on("end", (_button) => {
                    _boardListButtonRow.components[0].disabled = true;
                    _boardListButtonRow.components[1].disabled = true;
                    msg.edit({ embeds: [_boardListEmbed], components: [_boardListButtonRow] });
                });
            });
            return;
        }
        errorEmbed.title = "Error - Does not exist"
        errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid."
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
        return;
    }
    
    errorEmbed.title = "Error - Invalid Arguments"
    errorEmbed.description = "Please use the help command for information on the valid arguments."
    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
    return;
}

let _authenticate = async (msgObject: Message, _client: Client): Promise<boolean> => {
    if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !msgObject.guild?.available) return false;
    let localAuth = new guild.auth(msgObject.guild, msgObject.author);
    let mainAuth = new main.auth(msgObject.author);

    if (!(await mainAuth.isOwner() || await mainAuth.isDev() || localAuth.isGuildOwner() || await localAuth.isOwner() || await localAuth.isAdmin()) && !msgObject.author.bot) {
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