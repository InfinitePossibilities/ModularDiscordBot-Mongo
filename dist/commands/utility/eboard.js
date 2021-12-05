"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Last modified: 2021/12/05 01:30:48
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const util_1 = require("../../util");
const modulardiscordbot_auth_1 = require("modulardiscordbot-auth");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
module.exports = class eboard {
    constructor() {
        this._info = {
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
        };
        this._isTest = false;
        this._Type = config_1.CommandType.UTILITY;
        this.info = {
            getCommand: () => { return this._info.command; },
            getAliases: () => { return this._info.aliases; },
            getDescription: () => { return this._info.description; },
            getSyntax: () => { return this._info.syntax; },
            getArguments: () => { return this._info.arguments; },
            isTest: () => { return this._isTest; },
            getType: () => { return this._Type; }
        };
        this.runCommand = async (_args, _msgObject, _client) => {
            // TODO:
            if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !_msgObject.guild?.available)
                return;
            if (!await _authenticate(_msgObject, _client))
                return;
            let localAuth = new modulardiscordbot_auth_1.guild.auth(_msgObject.guild, _msgObject.author);
            let mainAuth = new modulardiscordbot_auth_1.main.auth(_msgObject.author);
            let role = _msgObject.guild.roles.cache.find((r) => { return r.id === "909579278159601675"; });
            const errorButtonRow = {
                type: 1 /* ACTION_ROW */,
                components: [
                    {
                        label: "Discord",
                        style: "LINK",
                        url: "https://discord.gg/VYp9qprv2u",
                        // customId: "nda-accept",
                        type: 2 /* BUTTON */,
                        disabled: false
                    },
                    {
                        label: "Error (WIP)",
                        style: "DANGER",
                        customId: "error",
                        type: 2 /* BUTTON */,
                        disabled: false
                    }
                ]
            };
            let errorEmbed = {
                color: [255, 0, 0],
                title: "Error",
                description: "",
                thumbnail: {
                    url: _client.user?.displayAvatarURL()
                },
                timestamp: new Date(),
                footer: {
                    text: _client.user?.username,
                    icon_url: _client.user?.displayAvatarURL(),
                },
            };
            if (_args.length == 0) {
                errorEmbed.title = "Error - Missing required arguments";
                errorEmbed.description = "Please use the help command for information on the valid arguments.";
                _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            }
            if (_args.length > 0) {
                let subArgument = _args[0];
                if (this._info.arguments.find(arg => { return arg.arg === subArgument.toLowerCase() || arg.aliases.indexOf(subArgument.toLowerCase()) > -1; })) {
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
        };
    }
};
let handleArguments = async (_args, _msgObject, _client, _arguments) => {
    let _subCommand = _arguments.find(arg => { return arg.arg === _args[0].toLowerCase() || arg.aliases.indexOf(_args[0].toLowerCase()) > -1; });
    if (!_subCommand)
        return;
    if (!_msgObject.guild?.available)
        return;
    let _guildSettings = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(_msgObject.guild, true));
    let _embedBoardSchema = await modulardiscordbot_db_1.schemas.template.templateSchema(`${_msgObject.guild?.id}_EmbedBoards`, {
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
            }, default: { url: _client.user?.displayAvatarURL() } },
        fields: { type: [{
                    name: { type: String, required: true },
                    value: { type: String, required: true },
                    inline: { type: Boolean, required: true },
                }], default: { name: "Field Name", value: "Field Value", inline: false } },
    });
    let _embedBoardDB = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.template.templateModel(`${_msgObject.guild?.id}_EmbedBoards`, true, _embedBoardSchema));
    const errorButtonRow = {
        type: 1 /* ACTION_ROW */,
        components: [
            {
                label: "Discord",
                style: "LINK",
                url: "https://discord.gg/VYp9qprv2u",
                // customId: "nda-accept",
                type: 2 /* BUTTON */,
                disabled: false
            },
            {
                label: "Error (WIP)",
                style: "DANGER",
                customId: "error",
                type: 2 /* BUTTON */,
                disabled: false
            }
        ]
    };
    let errorEmbed = {
        color: [255, 0, 0],
        title: "Error",
        description: "",
        thumbnail: {
            url: _client.user?.displayAvatarURL()
        },
        timestamp: new Date(),
        footer: {
            text: _client.user?.username,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    let handleQuestions = async (questionObj, editPropsObj) => {
        let removeButton = {
            label: "Remove",
            style: "DANGER",
            customId: "remove-setting",
            type: 2 /* BUTTON */,
            disabled: false
        };
        let clientButton = {
            label: "Default",
            style: "PRIMARY",
            customId: "set-default",
            type: 2 /* BUTTON */,
            disabled: false
        };
        let valueRow = {
            type: 1 /* ACTION_ROW */,
            components: []
        };
        let questionEmbed = {
            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
        };
        for (let question of questionObj.questions) {
            questionEmbed.description = question.question;
            if (question.id === "Setting Value") {
                if (editPropsObj) {
                    let _setting = questionObj.questions.find(q => { return q.id === "Setting Name"; });
                    let _targetArg = editPropsObj.args.find(arg => { return arg.arg === _setting?.response.toLowerCase(); });
                    if (_targetArg?.nullable)
                        valueRow.components.push(removeButton);
                    if (_targetArg?.default)
                        valueRow.components.push(clientButton);
                    let _msg = _msgObject.channel.send({ embeds: [questionEmbed], components: [valueRow] });
                    let _argFilter = (msg) => { return msg.author.id === _msgObject.author.id; };
                    let _argCollector = _msgObject.channel.createMessageCollector({ filter: _argFilter, max: 1, time: 25000 });
                    const _buttonFilter = (i) => (i.customId === 'set-default' || i.customId === 'remove-setting') && i.user.id === _msgObject.author.id;
                    const _controlsCollector = (await _msg).createMessageComponentCollector({ filter: _buttonFilter, max: 1, time: 25000 });
                    let response = await new Promise(async (resolve, reject) => {
                        _argCollector.on("collect", (msg) => {
                            _controlsCollector.stop("collected");
                            resolve(msg.content);
                        });
                        _argCollector.on("end", (collected, reason) => {
                            if (reason === "collected" || collected.size > 0)
                                return;
                            resolve("");
                        });
                        _controlsCollector.on("collect", (collected) => {
                            if (collected.customId === 'set-default') {
                                if (valueRow.components[0])
                                    valueRow.components[0].disabled = true;
                                if (valueRow.components[1])
                                    valueRow.components[1].disabled = true;
                                collected.message.edit({ embeds: [questionEmbed], components: [valueRow] });
                                _argCollector.stop("collected");
                                collected.deferUpdate();
                                _controlsCollector.stop("collected");
                                resolve("default");
                            }
                            if (collected.customId === 'remove-setting') {
                                if (valueRow.components[0])
                                    valueRow.components[0].disabled = true;
                                if (valueRow.components[1])
                                    valueRow.components[1].disabled = true;
                                collected.message.edit({ embeds: [questionEmbed], components: [valueRow] });
                                _argCollector.stop("collected");
                                collected.deferUpdate();
                                _controlsCollector.stop("collected");
                                resolve("remove");
                            }
                        });
                        _controlsCollector.on("end", (collected, reason) => {
                            if (reason === "collected" || collected.size > 0)
                                return;
                            resolve("");
                        });
                    });
                    if (response) {
                        question.response = await response;
                        continue;
                    }
                    errorEmbed.title = questionObj.id + " - Cancelled";
                    errorEmbed.description = `You failed to answer the \`${question.id}\` question.`;
                    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                    break;
                }
            }
            _msgObject.channel.send({ embeds: [questionEmbed] });
            let _argFilter = (msg) => { return msg.author.id === _msgObject.author.id; };
            let _argCollector = _msgObject.channel.createMessageCollector({ filter: _argFilter, max: 1, time: 25000 });
            let response = await new Promise((resolve, reject) => {
                _argCollector.on("collect", (msg) => {
                    resolve(msg.content);
                });
                _argCollector.on("end", (collected) => {
                    resolve("");
                });
            });
            if (response) {
                question.response = await response;
                continue;
            }
            errorEmbed.title = questionObj.id + " - Cancelled";
            errorEmbed.description = `You failed to answer the \`${question.id}\` question.`;
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            break;
        }
    };
    let responseCheck = async (questionObj) => {
        for (let question of questionObj.questions) {
            if (question.response)
                continue;
            return false;
        }
        return true;
    };
    let _boardName = _args[1] ? _args[1] : "";
    if (_boardName) {
        if (_subCommand.arg == "create") {
            let _channelid = _args[2] ? _args[2].replace("<", "").replace("#", "").replace(">", "") : "";
            let _channel = _msgObject.guild?.channels.cache.find(channel => { return channel.id === _channelid; });
            if (_channel) {
                // _msgObject.channel.send(`Creating board ${_boardName} in ` + _channel);
                _channel.send("embed").then(msg => {
                    _embedBoardDB.createRecords([{
                            message: {
                                id: msg.id,
                                channelId: _channel
                            },
                            boardName: _boardName
                        }]).then(async (newRecords) => {
                        msg.edit({ content: null, embeds: [newRecords[0]] });
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
                    msg.edit({ content: null, embeds: [newRecords[0]] });
                });
            });
            return;
        }
        if (_subCommand.arg == "delete") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === _boardRecord.message.channelId; });
                let _boardmessage = _boardchannel.messages.fetch(_boardRecord.message.id);
                await (await _boardmessage).delete();
                await _embedBoardDB.deleteRecords([{ boardName: _boardName }]);
                let successEmbed = {
                    color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
                };
                _msgObject.channel.send({ embeds: [successEmbed] });
                return;
            }
            errorEmbed.title = "Error - Does not exist";
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "unlink") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                await _embedBoardDB.deleteRecords([{ boardName: _boardName }]);
                let successEmbed = {
                    color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
                };
                _msgObject.channel.send({ embeds: [successEmbed] });
                return;
            }
            errorEmbed.title = "Error - Does not exist";
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "edit") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === _boardRecord.message.channelId; });
                let _boardmessage = _boardchannel.messages.fetch(_boardRecord.message.id);
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
                    ];
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
                    };
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
                    };
                    await handleQuestions(questionObject, _editArgs);
                    if (!await responseCheck(questionObject))
                        return;
                    let _answers = {
                        setting: questionObject.questions.find(question => { return question.id === "Setting Name"; })?.response,
                        value: questionObject.questions.find(question => { return question.id === "Setting Value"; })?.response,
                    };
                    let _targetArg = _editArgs.args.find(arg => { return arg.arg === _answers.setting.toLowerCase(); });
                    if (_targetArg) {
                        if (_answers.value == "remove" && _editArgs.args.find(arg => { return arg.arg == _answers.setting; })?.nullable)
                            _answers.value = null;
                        if ((_answers.value == "default" || _answers.value == "client") && _editArgs.args.find(arg => { return arg.arg == _answers.setting; })?.default)
                            _answers.value = await _defaults.find((def) => { return def.arg == _answers.setting; })?.default;
                        _targetArg.issubprop ? (_boardRecord)[_targetArg.prop][_targetArg.subprop] = _answers.value : (_boardRecord)[_targetArg.prop] = _answers.value;
                        await (await _boardmessage).edit({ embeds: [_boardRecord] });
                        await _embedBoardDB.updateRecords([{ boardName: _boardName }], { [_targetArg.prop]: (_boardRecord)[_targetArg.prop] });
                        let successEmbed = {
                            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
                        };
                        _msgObject.channel.send({ embeds: [successEmbed] });
                        return;
                    }
                    errorEmbed.title = "Error - Setting not valid";
                    errorEmbed.description = "The setting you specified is not a valid listed setting.";
                    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                    return;
                }
                errorEmbed.title = "Error - Missing Board";
                errorEmbed.description = "The board you specified no longer exists or has been removed.";
                _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                return;
            }
            errorEmbed.title = "Error - Does not exist";
            errorEmbed.description = "There are no records of the board you have specified in my database. \n\nPlease make sure the name is valid.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "addfield") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === _boardRecord.message.channelId; });
                let _boardmessage = _boardchannel.messages.fetch(_boardRecord.message.id);
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
                    };
                    await handleQuestions(questionObject, undefined);
                    if (!await responseCheck(questionObject))
                        return;
                    let _newField = {
                        name: questionObject.questions.find(question => { return question.id === "Field Name"; })?.response,
                        value: questionObject.questions.find(question => { return question.id === "Field Value"; })?.response,
                        inline: (questionObject.questions.find(question => { return question.id === "Inline"; })?.response.toLowerCase() === 'true' ? true : questionObject.questions.find(question => { return question.id === "Inline"; })?.response.toLowerCase() === 'false' ? false : false),
                    };
                    _boardRecord.fields.push(_newField);
                    await (await _boardmessage).edit({ embeds: [_boardRecord] });
                    await _embedBoardDB.updateRecords([{ boardName: _boardName }], { fields: _boardRecord.fields });
                    let successEmbed = {
                        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
                    };
                    _msgObject.channel.send({ embeds: [successEmbed] });
                    return;
                }
                errorEmbed.title = "Error - Missing Board";
                errorEmbed.description = "The board you specified no longer exists or has been removed.";
                _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                return;
            }
            errorEmbed.title = "Error - Does not exist";
            errorEmbed.description = "There are no records of the board you have specified in my database. \n\nPlease make sure the name is valid.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "deletefield") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === _boardRecord.message.channelId; });
                let _boardmessage = _boardchannel.messages.fetch(_boardRecord.message.id);
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
                    };
                    await handleQuestions(questionObject, undefined);
                    if (!await responseCheck(questionObject))
                        return;
                    (_boardRecord.fields) = (_boardRecord.fields).filter(field => { return field.name != questionObject.questions.find(question => { return question.id === "Field Name"; })?.response; });
                    await (await _boardmessage).edit({ embeds: [_boardRecord] });
                    await _embedBoardDB.updateRecords([{ boardName: _boardName }], { fields: _boardRecord.fields });
                    let successEmbed = {
                        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
                        title: "Board Updated",
                        description: `Successfully deleted field \`${questionObject.questions.find(question => { return question.id === "Field Name"; })?.response}\` from \`${_boardName}\` board.`,
                        thumbnail: {
                            url: _client.user?.displayAvatarURL(),
                        },
                        timestamp: new Date(),
                        footer: {
                            text: _client.user?.username,
                            icon_url: _client.user?.displayAvatarURL(),
                        },
                    };
                    _msgObject.channel.send({ embeds: [successEmbed] });
                    return;
                }
                errorEmbed.title = "Error - Missing Board";
                errorEmbed.description = "The board you specified no longer exists or has been removed.";
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
                let _boardchannel = _msgObject.guild.channels.cache.find(channel => { return channel.id === _boardRecord.message.channelId; });
                let _boardmessage = _boardchannel.messages.fetch(_boardRecord.message.id);
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
                    };
                    await handleQuestions(questionObject, undefined);
                    if (!await responseCheck(questionObject))
                        return;
                    let _newField = {
                        name: questionObject.questions.find(question => { return question.id === "Field Name"; })?.response,
                        value: questionObject.questions.find(question => { return question.id === "Field Value"; })?.response,
                        inline: (questionObject.questions.find(question => { return question.id === "Inline"; })?.response.toLowerCase() === 'true' ? true : questionObject.questions.find(question => { return question.id === "Inline"; })?.response.toLowerCase() === 'false' ? false : false),
                    };
                    let _existingFieldName = questionObject.questions.find(question => { return question.id === "Current Name"; })?.response;
                    let _existingField = _boardRecord.fields.find(field => { return field.name === _existingFieldName; });
                    if (_existingField) {
                        _existingField.name = _newField.name;
                        _existingField.value = _newField.value;
                        _existingField.inline = _newField.inline;
                        await (await _boardmessage).edit({ embeds: [_boardRecord] });
                        await _embedBoardDB.updateRecords([{ boardName: _boardName }], { fields: _boardRecord.fields });
                        let successEmbed = {
                            color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
                        };
                        _msgObject.channel.send({ embeds: [successEmbed] });
                        return;
                    }
                    errorEmbed.title = "Error - Does not exist";
                    errorEmbed.description = "There are no records of the field you have specified for this board. \n\nPlease make sure the name is valid.";
                    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                    return;
                }
                errorEmbed.title = "Error - Missing Board";
                errorEmbed.description = "The board you specified no longer exists or has been removed.";
                _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
                return;
            }
            errorEmbed.title = "Error - Does not exist";
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        if (_subCommand.arg == "listfields") {
            let _boardRecord = (await _embedBoardDB.readRecords([{ boardName: _boardName }]))[0];
            if (_boardRecord) {
                let _boardFields = _boardRecord.fields;
                let _fieldList = new Array();
                let _itemsPerPage = 20;
                let _currentPage = 1;
                let _pageCount = 0;
                _boardFields.forEach(field => {
                    _fieldList.push(field.name);
                });
                _fieldList.sort();
                let _firstPage = _fieldList.slice((_currentPage - 1) * _itemsPerPage, (_currentPage - 1) * _itemsPerPage + _itemsPerPage);
                _pageCount = Math.ceil(_fieldList.length / _itemsPerPage);
                const _fieldListButtonRow = {
                    type: 1 /* ACTION_ROW */,
                    components: [
                        {
                            customId: "prev",
                            emoji: "⏪",
                            style: "PRIMARY",
                            // customId: "nda-accept",
                            type: 2 /* BUTTON */,
                            disabled: true
                        },
                        {
                            customId: "next",
                            emoji: "⏩",
                            style: "PRIMARY",
                            // customId: "nda-accept",
                            type: 2 /* BUTTON */,
                            disabled: _pageCount == 1 ? true : false
                        }
                    ]
                };
                let _fieldListEmbed = {
                    color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
                };
                _msgObject.channel.send({ embeds: [_fieldListEmbed], components: [_fieldListButtonRow] }).then(msg => {
                    const _controlsFilter = (i) => (i.customId === 'prev' || i.customId === 'next') && i.user.id === _msgObject.author.id;
                    const _controlsCollector = msg.createMessageComponentCollector({ filter: _controlsFilter, time: 60000 });
                    _controlsCollector.on("collect", (_button => {
                        if (_button.customId == 'next') {
                            if (_currentPage >= _pageCount) {
                                _currentPage = _pageCount;
                                _fieldListButtonRow.components[1].disabled = true;
                                msg.edit({ embeds: [_fieldListEmbed], components: [_fieldListButtonRow] });
                                _button.deferUpdate();
                                return;
                            }
                            ;
                            _currentPage++;
                            let _begin = (_currentPage - 1) * _itemsPerPage;
                            let _end = _begin + _itemsPerPage;
                            let _pageItems = _fieldList.slice(_begin, _end);
                            _fieldListEmbed.description = _pageItems.join('\n');
                            _fieldListEmbed.footer.text = `${_currentPage} of ${_pageCount}`;
                            if (_currentPage <= _pageCount) {
                                _fieldListButtonRow.components[0].disabled = false;
                            }
                            ;
                            if (_currentPage <= _pageCount) {
                                _fieldListButtonRow.components[1].disabled = true;
                            }
                            ;
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
                            }
                            ;
                            _currentPage--;
                            let _begin = (_currentPage - 1) * _itemsPerPage;
                            let _end = _begin + _itemsPerPage;
                            let _pageItems = _fieldList.slice(_begin, _end);
                            _fieldListEmbed.description = _pageItems.join('\n');
                            _fieldListEmbed.footer.text = `${_currentPage} of ${_pageCount}`;
                            if (_currentPage <= _pageCount) {
                                _fieldListButtonRow.components[0].disabled = true;
                            }
                            ;
                            if (_currentPage <= _pageCount) {
                                _fieldListButtonRow.components[1].disabled = false;
                            }
                            ;
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
            errorEmbed.title = "Error - Does not exist";
            errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        return;
    }
    if (_subCommand.arg == "listboards") {
        let _boardRecords = (await _embedBoardDB.readAllRecords());
        if (_boardRecords) {
            let _boardList = new Array();
            let _itemsPerPage = 20;
            let _currentPage = 1;
            let _pageCount = 0;
            for (let _board of _boardRecords) {
                let _boardchannel = _msgObject.guild?.channels.cache.find(channel => { return channel.id === _board.message.channelId; });
                let _boardmessage = _boardchannel.messages.fetch(_board.message.id);
                if (await _boardmessage) {
                    _boardList.push(`[${_board.boardName}](${(await _boardmessage).url})`);
                }
            }
            _boardList.sort();
            let _firstPage = _boardList.slice((_currentPage - 1) * _itemsPerPage, (_currentPage - 1) * _itemsPerPage + _itemsPerPage);
            _pageCount = Math.ceil(_boardList.length / _itemsPerPage);
            const _boardListButtonRow = {
                type: 1 /* ACTION_ROW */,
                components: [
                    {
                        customId: "prev",
                        emoji: "⏪",
                        style: "PRIMARY",
                        // customId: "nda-accept",
                        type: 2 /* BUTTON */,
                        disabled: true
                    },
                    {
                        customId: "next",
                        emoji: "⏩",
                        style: "PRIMARY",
                        // customId: "nda-accept",
                        type: 2 /* BUTTON */,
                        disabled: _pageCount == 1 ? true : false
                    }
                ]
            };
            let _boardListEmbed = {
                color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
            };
            _msgObject.channel.send({ embeds: [_boardListEmbed], components: [_boardListButtonRow] }).then(msg => {
                const _controlsFilter = (i) => (i.customId === 'prev' || i.customId === 'next') && i.user.id === _msgObject.author.id;
                const _controlsCollector = msg.createMessageComponentCollector({ filter: _controlsFilter, time: 60000 });
                _controlsCollector.on("collect", (_button => {
                    if (_button.customId == 'next') {
                        if (_currentPage >= _pageCount) {
                            _currentPage = _pageCount;
                            _boardListButtonRow.components[1].disabled = true;
                            msg.edit({ embeds: [_boardListEmbed], components: [_boardListButtonRow] });
                            _button.deferUpdate();
                            return;
                        }
                        ;
                        _currentPage++;
                        let _begin = (_currentPage - 1) * _itemsPerPage;
                        let _end = _begin + _itemsPerPage;
                        let _pageItems = _boardList.slice(_begin, _end);
                        _boardListEmbed.description = _pageItems.join('\n');
                        _boardListEmbed.footer.text = `${_currentPage} of ${_pageCount}`;
                        if (_currentPage <= _pageCount) {
                            _boardListButtonRow.components[0].disabled = false;
                        }
                        ;
                        if (_currentPage <= _pageCount) {
                            _boardListButtonRow.components[1].disabled = true;
                        }
                        ;
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
                        }
                        ;
                        _currentPage--;
                        let _begin = (_currentPage - 1) * _itemsPerPage;
                        let _end = _begin + _itemsPerPage;
                        let _pageItems = _boardList.slice(_begin, _end);
                        _boardListEmbed.description = _pageItems.join('\n');
                        _boardListEmbed.footer.text = `${_currentPage} of ${_pageCount}`;
                        if (_currentPage <= _pageCount) {
                            _boardListButtonRow.components[0].disabled = true;
                        }
                        ;
                        if (_currentPage <= _pageCount) {
                            _boardListButtonRow.components[1].disabled = false;
                        }
                        ;
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
        errorEmbed.title = "Error - Does not exist";
        errorEmbed.description = "There are no records of the board you have specified. \n\nPlease make sure the name is valid.";
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
        return;
    }
    errorEmbed.title = "Error - Invalid Arguments";
    errorEmbed.description = "Please use the help command for information on the valid arguments.";
    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
    return;
};
let _authenticate = async (msgObject, _client) => {
    if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !msgObject.guild?.available)
        return false;
    let localAuth = new modulardiscordbot_auth_1.guild.auth(msgObject.guild, msgObject.author);
    let mainAuth = new modulardiscordbot_auth_1.main.auth(msgObject.author);
    if (!(await mainAuth.isOwner() || await mainAuth.isDev() || localAuth.isGuildOwner() || await localAuth.isOwner() || await localAuth.isAdmin()) && !msgObject.author.bot) {
        const errorButtonRow = new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
            .setLabel('Discord')
            .setURL('https://discord.gg/VYp9qprv2u')
            .setStyle('LINK'), new discord_js_1.MessageButton()
            .setCustomId('error')
            .setLabel('Error (WIP)')
            .setStyle('DANGER'));
        const errorEmbed = {
            color: [255, 0, 0],
            title: 'Error',
            description: `You do not have permission to run this command! \n\nPlease report any unfixable errors below.`,
            timestamp: new Date(),
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        await msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] }).then((msg) => {
            setTimeout(() => {
                msg.delete();
                msgObject.delete();
            }, 5000);
        });
        return false;
    }
    else {
        return true;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWJvYXJkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1hbmRzL3V0aWxpdHkvZWJvYXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLDJDQUE2SjtBQUc3Six5Q0FBMkM7QUFDM0MscUNBQTJDO0FBQzNDLG1FQUFxRDtBQUNyRCwrREFBbUQ7QUFFbkQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLE1BQU07SUFBWjtRQUNJLFVBQUssR0FBRztZQUNyQixPQUFPLEVBQUUsUUFBUTtZQUNqQixPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDO1lBQ3BFLFdBQVcsRUFBRSx3QkFBd0I7WUFDckMsTUFBTSxFQUFFLFFBQVE7WUFDaEIsU0FBUyxFQUFFO2dCQUNQO29CQUNJLEdBQUcsRUFBRSxRQUFRO29CQUNiLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDZCxXQUFXLEVBQUUsa0NBQWtDO29CQUMvQyxNQUFNLEVBQUUsMEJBQTBCO2lCQUNyQztnQkFDRDtvQkFDSSxHQUFHLEVBQUUsUUFBUTtvQkFDYixPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUM7b0JBQ3RDLFdBQVcsRUFBRSx1Q0FBdUM7b0JBQ3BELE1BQU0sRUFBRSxnQkFBZ0I7aUJBQzNCO2dCQUNEO29CQUNJLEdBQUcsRUFBRSxRQUFRO29CQUNiLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQztvQkFDZixXQUFXLEVBQUUscUdBQXFHO29CQUNsSCxNQUFNLEVBQUUsZ0JBQWdCO2lCQUMzQjtnQkFDRDtvQkFDSSxHQUFHLEVBQUUsTUFBTTtvQkFDWCxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ2QsV0FBVyxFQUFFLDBLQUEwSztvQkFDdkwsTUFBTSxFQUFFLGNBQWM7aUJBQ3pCO2dCQUNEO29CQUNJ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