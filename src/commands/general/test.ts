// Last modified: 2021/11/21 20:08:49
import { Message, Client, Role, ColorResolvable, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../IBotAPIs";
import { CommandType } from "../../config";
import { miscFunctions } from "../../util";
import { main, guild } from "modulardiscordbot-auth";
import { db, schemas } from "modulardiscordbot-db";

module.exports = class test implements IBotCommand {
    private readonly _command = "test";
    private readonly _aliases = [];
    private readonly _description = "Cool test command, yes?";
    private readonly _syntax = "<command>";
    private readonly _arguments = ["list"];
    private readonly _isTest = false;
    private readonly _Type = CommandType.GENERAL;

    info = {
        command: (): string => { return this._command },
        aliases: () => { return this._aliases },
        description: (): string => { return this._description },
        syntax: (): string => { return this._syntax },
        arguments: () => { return this._arguments },
        isTest: (): boolean => { return this._isTest },
        Type: (): CommandType => { return this._Type }
    }

    runCommand = async (args: string[], msgObject: Message, client: Client): Promise<void> => {
        // TODO:
        if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !msgObject.guild?.available) return;
        if (!_authenticate(msgObject, client)) return;
        
        let localAuth = new guild.auth(msgObject.guild, msgObject.author);
        let mainAuth = new main.auth(msgObject.author);
        let role = (msgObject.guild.roles.cache.find((r) => { return r.id === "909579278159601675" }) as Role)

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
    }
}

let _authenticate = async (msgObject: Message, _client: Client): Promise<boolean> => {
    if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !msgObject.guild?.available) return false;
    let localAuth = new guild.auth(msgObject.guild, msgObject.author);
    let mainAuth = new main.auth(msgObject.author);

    if (!(await mainAuth.isOwner() || await mainAuth.isDev()) && !msgObject.author.bot) {
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