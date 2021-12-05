"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config");
const util_1 = require("../../../util");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
const modulardiscordbot_auth_1 = require("modulardiscordbot-auth");
module.exports = class nda {
    constructor() {
        this._info = {
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
        };
        this._isTest = false;
        this._Type = config_1.CommandType.GENERAL;
        this.info = {
            getCommand: () => { return this._info.command; },
            getAliases: () => { return this._info.aliases; },
            getDescription: () => { return this._info.description; },
            getSyntax: () => { return this._info.syntax; },
            getArguments: () => { return this._info.arguments; },
            getSubcategory: () => { return this._info.subcategory; },
            isTest: () => { return this._isTest; },
            getType: () => { return this._Type; }
        };
        this.runCommand = async (_args, _msgObject, _client) => {
            if (!_msgObject.guild?.available)
                return;
            let ndaDB = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.template.templateModel(`${_msgObject.guild.id}_NDA`, true));
            if (_args.length == 0) {
                if (!await util_1.miscFunctions.dbFunctions.template_RecordExists('userId', _msgObject.author.id, modulardiscordbot_db_1.schemas.template.templateModel(`${_msgObject.guild.id}_NDA`, true))) {
                    await sendNDA(_msgObject, _client);
                    return;
                }
            }
            await handleArgs(_args, _msgObject, _client);
        };
    }
};
let sendNDA = async (_msgObject, _client) => {
    if (!_msgObject.guild?.available)
        return;
    const ndaButtonRow = {
        type: 1 /* ACTION_ROW */,
        components: [
            {
                label: "",
                style: "SUCCESS",
                emoji: "✅",
                customId: "nda-accept",
                type: 2 /* BUTTON */,
                disabled: false
            },
            {
                label: "",
                style: "DANGER",
                emoji: "⛔",
                customId: "nda-reject",
                type: 2 /* BUTTON */,
                disabled: false
            }
        ]
    };
    let _guildSettings = new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(_msgObject.guild, true));
    const ndaEmbed = {
        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
            url: _client.user?.displayAvatarURL(),
        },
        footer: {
            text: _client.user?.username,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    await _msgObject.channel.send({ embeds: [ndaEmbed], components: [ndaButtonRow] }).then((msg) => {
        const ndaFilter = (i) => (i.customId === 'nda-accept' || i.customId === 'nda-reject') && i.user.id === _msgObject.author.id;
        const ndaCollector = msg.createMessageComponentCollector({ filter: ndaFilter, max: 1, time: 25000 });
        ndaCollector.on('collect', async (buttoni) => {
            if (buttoni.customId === 'nda-accept') {
                let ndaDB = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.template.templateModel(`${_msgObject.guild?.id}_NDA`, true, {
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
                ndaEmbed.color = [0, 255, 0];
                ndaEmbed.fields[0] = {
                    name: "Status",
                    value: "Accepted",
                    inline: true
                };
            }
            if (buttoni.customId === 'nda-reject') {
                ndaEmbed.color = [255, 0, 0];
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
            if (collected.size > 0)
                return;
            ndaEmbed.color = [255, 0, 0];
            ndaEmbed.description = "";
            ndaEmbed.fields[0] = {
                name: "Status",
                value: "Timed out",
                inline: true
            };
            msg.edit({ embeds: [ndaEmbed], components: [] });
        });
    });
};
let handleArgs = async (_args, _msgObject, _client) => {
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
        await sendStatus(_msgObject.author.id, _msgObject, _client);
        return;
    }
    if (_args.length == 1) {
        if (_args[0].toLowerCase() == "status") {
            await sendStatus(_msgObject.author.id, _msgObject, _client, _msgObject.member);
            return;
        }
        errorEmbed.title = "Error - Invalid Arguments";
        errorEmbed.description = "Please use the help command for information on the valid arguments.";
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
        return;
    }
    if (_args.length == 2) {
        if (!await _authenticate(_msgObject, _client))
            return;
        if (_args[0].toLowerCase() == "status") {
            let _userid = _args[1].toLowerCase().replace("<@!", "").replace(">", "");
            let _guildMember = _msgObject.guild?.members.cache.find(member => { return member.user.id == _userid; });
            if (_guildMember) {
                await sendStatus(_userid, _msgObject, _client, _guildMember);
                return;
            }
            ;
            errorEmbed.title = "Error - Invalid Member";
            errorEmbed.description = "The target user does not exist or is no longer in this Guild.";
            _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
            return;
        }
        errorEmbed.title = "Error - Invalid Arguments";
        errorEmbed.description = "Please use the help command for information on the valid arguments.";
        _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
        return;
    }
    errorEmbed.title = "Error - Invalid Arguments";
    errorEmbed.description = "Please use the help command for information on the valid arguments.";
    _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
    return;
};
let sendStatus = async (userid, _msgObject, _client, _member) => {
    if (!_msgObject.guild?.available)
        return;
    let _guildSettings = new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(_msgObject.guild, true));
    if (!await util_1.miscFunctions.dbFunctions.template_RecordExists('userId', userid, modulardiscordbot_db_1.schemas.template.templateModel(`${_msgObject.guild.id}_NDA`, true))) {
        const rejectedEmbed = {
            color: [255, 0, 0],
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
                url: _client.user?.displayAvatarURL(),
            },
            footer: {
                text: _client.user?.username,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };
        await _msgObject.channel.send({ embeds: [rejectedEmbed] });
        return;
    }
    const acceptedEmbed = {
        color: (await _guildSettings.readRecords(undefined, "maincolor"))[0].maincolor,
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
            url: _client.user?.displayAvatarURL(),
        },
        footer: {
            text: _client.user?.username,
            icon_url: _client.user?.displayAvatarURL(),
        },
    };
    await _msgObject.channel.send({ embeds: [acceptedEmbed] });
    return;
};
let _authenticate = async (msgObject, _client) => {
    if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !msgObject.guild?.available)
        return false;
    let localAuth = new modulardiscordbot_auth_1.guild.auth(msgObject.guild, msgObject.author);
    let mainAuth = new modulardiscordbot_auth_1.main.auth(msgObject.author);
    if (!(await mainAuth.isOwner() || await mainAuth.isDev() || localAuth.isGuildOwner() || await localAuth.isOwner() || await localAuth.isAdmin()) && !msgObject.author.bot) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbW1hbmRzL2dlbmVyYWwvSWRlbnQvbmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsNENBQThDO0FBRTlDLHdDQUE4QztBQUM5QywrREFBbUQ7QUFDbkQsbUVBQXFEO0FBRXJELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxHQUFHO0lBQVQ7UUFDSSxVQUFLLEdBQUc7WUFDckIsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsRUFBRTtZQUNYLFdBQVcsRUFBRSwrQ0FBK0M7WUFDNUQsTUFBTSxFQUFFLEVBQUU7WUFDVixTQUFTLEVBQUU7Z0JBQ1A7b0JBQ0ksR0FBRyxFQUFFLE1BQU07b0JBQ1gsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsV0FBVyxFQUFFLG1DQUFtQztvQkFDaEQsTUFBTSxFQUFFLGNBQWM7aUJBQ3pCO2FBQ0o7WUFDRCxXQUFXLEVBQUUsT0FBTztTQUN2QixDQUFBO1FBQ2dCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILFVBQVUsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUN2RCxVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDL0MsY0FBYyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUEsQ0FBQyxDQUFDO1lBQy9ELFNBQVMsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUNyRCxZQUFZLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMs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