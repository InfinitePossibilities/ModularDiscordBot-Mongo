// Last modified: 2021/11/24 02:06:37
import { Message, Client, MessageActionRow, MessageButton, ColorResolvable } from "discord.js";
import { dbs } from "../../app";
import { IBotCommand } from "../../IBotAPIs";
import { CommandType } from "../../config";
import { indexFunctions, miscFunctions } from "../../util";
import { main, guild } from "modulardiscordbot-auth";
import { db, schemas } from "modulardiscordbot-db";

module.exports = class setup implements IBotCommand {
    private readonly _info = {
        command: "setup",
        aliases: [],
        description: "Initialize guild related settings.",
        syntax: "",
        arguments: [],
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
        if (!_msgObject.guild?.available) return;
        if (!_authenticate(_msgObject, _client)) return;

        let _mainSettings = await new db(schemas.main.coreMainModel(true));
        
        const _embed = {
            color: (await _mainSettings.readRecords(undefined, "maincolor"))[0].maincolor as ColorResolvable,
            title: 'Setup',
            description: 'Tuning Ion Thrusters...',
            timestamp: new Date(),
            footer: {
                text: (await _mainSettings.readRecords(undefined, "botname"))[0].botname,
                icon_url: _client.user?.displayAvatarURL(),
            },
        };

        _msgObject.channel.send({ embeds: [_embed] }).then(async (_message) => {
            if (!_msgObject.guild?.available) return;

            await indexFunctions.dbs.queryAllDBs(dbs, _msgObject.guild).then(() => {
                _embed.color = [0, 255, 0] as ColorResolvable;
                _embed.description = "Finished tuning Ion Thrusters.";
                _message.edit({ embeds: [_embed] });
            });
        });
    }
}

let _authenticate = async (_msgObject: Message, _client: Client): Promise<boolean> => {
    if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings") || !_msgObject.guild?.available) return false;
    let mainAuth = new main.auth(_msgObject.author);

    if (!(await mainAuth.isOwner() || await mainAuth.isDev()) && !_msgObject.author.bot) {
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

        await _msgObject.channel.send({embeds: [errorEmbed], components: [errorButtonRow]}).then((msg) => {
            setTimeout(() => {
                (msg as Message).delete();
                _msgObject.delete();
            }, 5000);
        });

        return false;
    }else {
        return true;
    }
}