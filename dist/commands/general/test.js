"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Last modified: 2021/11/24 01:38:32
const discord_js_1 = require("discord.js");
const config_1 = require("../../config");
const util_1 = require("../../util");
const modulardiscordbot_auth_1 = require("modulardiscordbot-auth");
module.exports = class test {
    constructor() {
        this._info = {
            command: "test",
            aliases: [],
            description: "Cool test command, yes?",
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
            // TODO:
            if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !msgObject.guild?.available)
                return;
            if (!_authenticate(msgObject, client))
                return;
            let localAuth = new modulardiscordbot_auth_1.guild.auth(msgObject.guild, msgObject.author);
            let mainAuth = new modulardiscordbot_auth_1.main.auth(msgObject.author);
            let role = msgObject.guild.roles.cache.find((r) => { return r.id === "909579278159601675"; });
            console.log("isOwner", await mainAuth.isOwner());
            console.log("isDev", await mainAuth.isDev());
            console.log("isAdmin", await mainAuth.isAdmin());
            console.log("isMod", await mainAuth.isMod());
            console.log("isEmpowered", await mainAuth.isEmpowered());
            console.log("");
            console.log("isDev", await localAuth.isDev());
            console.log("isGuildOwner", await localAuth.isGuildOwner());
            console.log("isOwner", await localAuth.isOwner());
            console.log("isAdmin", await localAuth.isAdmin());
            console.log("isMod", await localAuth.isMod());
            console.log("isEmpowered", await localAuth.isEmpowered());
            console.log("hasRole", await localAuth.hasRole(role));
        };
    }
};
let _authenticate = async (msgObject, _client) => {
    if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !msgObject.guild?.available)
        return false;
    let localAuth = new modulardiscordbot_auth_1.guild.auth(msgObject.guild, msgObject.author);
    let mainAuth = new modulardiscordbot_auth_1.main.auth(msgObject.author);
    if (!(await mainAuth.isOwner() || await mainAuth.isDev()) && !msgObject.author.bot) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsMkNBQW1IO0FBRW5ILHlDQUEyQztBQUMzQyxxQ0FBMkM7QUFDM0MsbUVBQXFEO0FBR3JELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJO0lBQVY7UUFDSSxVQUFLLEdBQUc7WUFDckIsT0FBTyxFQUFFLE1BQU07WUFDZixPQUFPLEVBQUUsRUFBRTtZQUNYLFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsTUFBTSxFQUFFLFdBQVc7WUFDbkIsU0FBUyxFQUFFO2dCQUNQO29CQUNJLEdBQUcsRUFBRSxNQUFNO29CQUNYLE9BQU8sRUFBRSxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFFO29CQUNmLE1BQU0sRUFBRSxFQUFFO2lCQUNiO2FBQ0o7U0FDSixDQUFBO1FBQ2dCLFlBQU8sR0FBRyxLQUFLLENBQUM7UUFDaEIsVUFBSyxHQUFHLG9CQUFXLENBQUMsT0FBTyxDQUFDO1FBRTdDLFNBQUksR0FBRztZQUNILFVBQVUsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQztZQUN2RCxVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDL0MsY0FBYyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUEsQ0FBQyxDQUFDO1lBQy9ELFNBQVMsRUFBRSxHQUFXLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQztZQUNyRCxZQUFZLEVBQUUsR0FBRyxFQUFFLEdBQUcsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FB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