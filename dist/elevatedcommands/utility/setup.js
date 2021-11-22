"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Last modified: 2021/11/21 20:08:58
const discord_js_1 = require("discord.js");
const app_1 = require("../../app");
const config_1 = require("../../config");
const util_1 = require("../../util");
const modulardiscordbot_auth_1 = require("modulardiscordbot-auth");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
module.exports = class setup {
    constructor() {
        this._command = "setup";
        this._aliases = [];
        this._description = "Initialize guild related settings.";
        this._syntax = "";
        this._arguments = [];
        this._isTest = false;
        this._Type = config_1.CommandType.UTILITY;
        this.info = {
            command: () => { return this._command; },
            aliases: () => { return this._aliases; },
            description: () => { return this._description; },
            syntax: () => { return this._syntax; },
            arguments: () => { return this._arguments; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (_args, _msgObject, _client) => {
            if (!_msgObject.guild?.available)
                return;
            if (!_authenticate(_msgObject, _client))
                return;
            let _mainSettings = await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true));
            const _embed = {
                color: (await _mainSettings.readRecords(undefined, "maincolor"))[0].maincolor,
                title: 'Setup',
                description: 'Tuning Ion Thrusters...',
                timestamp: new Date(),
                footer: {
                    text: (await _mainSettings.readRecords(undefined, "botname"))[0].botname,
                    icon_url: _client.user?.displayAvatarURL(),
                },
            };
            _msgObject.channel.send({ embeds: [_embed] }).then(async (_message) => {
                if (!_msgObject.guild?.available)
                    return;
                await util_1.indexFunctions.dbs.queryAllDBs(app_1.dbs, _msgObject.guild).then(() => {
                    _embed.color = [0, 255, 0];
                    _embed.description = "Finished tuning Ion Thrusters.";
                    _message.edit({ embeds: [_embed] });
                });
            });
        };
    }
};
let _authenticate = async (_msgObject, _client) => {
    if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !_msgObject.guild?.available)
        return false;
    let mainAuth = new modulardiscordbot_auth_1.main.auth(_msgObject.author);
    if (!(await mainAuth.isOwner() || await mainAuth.isDev()) && !_msgObject.author.bot) {
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
        await _msgObject.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] }).then((msg) => {
            setTimeout(() => {
                msg.delete();
                _msgObject.delete();
            }, 5000);
        });
        return false;
    }
    else {
        return true;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZWxldmF0ZWRjb21tYW5kcy91dGlsaXR5L3NldHVwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLDJDQUErRjtBQUMvRixtQ0FBZ0M7QUFFaEMseUNBQTJDO0FBQzNDLHFDQUEyRDtBQUMzRCxtRUFBcUQ7QUFDckQsK0RBQW1EO0FBRW5ELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxLQUFLO0lBQVg7UUFDSSxhQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ25CLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFDZCxpQkFBWSxHQUFHLG9DQUFvQyxDQUFDO1FBQ3BELFlBQU8sR0FBRyxFQUFFLENBQUM7UUFDYixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILE9BQU8sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQy9DLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUEsQ0FBQyxDQUFDO1lBQ3ZDLFdBQVcsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUEsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzdDLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFZLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxDQUFDO1lBQzlDLElBQUksRUFBRSxHQUFnQixFQUFFLEdBQUcs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