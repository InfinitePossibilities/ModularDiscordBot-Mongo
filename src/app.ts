// Last modified: 2021/11/04 23:47:25

// APIs
import * as Discord from "discord.js";
const Bloxy = require("devbloxy");

//Config
import { db, schemas } from "./database";
require('dotenv').config()
import { config } from "./config";
import { guildSettingsSchema } from "./interfaces";
import { tableDefaults } from "./config";
// import { tableExists } from "./util";

// Internal Bot APIs
import { IBotCommand, IBotEvent } from "./IBotAPIs";

// Comand Handlers
import { Schema, Model, model, models, connect, connection } from 'mongoose';
import { miscFunctions, indexFunctions } from "./util";

// Declare Bot
const bot: Discord.Client = new Discord.Client({ 
    intents: [
        Discord.Intents.FLAGS.GUILDS, 
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_PRESENCES
    ]});

export var bloxyClient = new Bloxy.Client();

// Declare, export, and load commands/events into memory
export let commands: IBotCommand[] = [],
    elevated_commands: IBotCommand[] = [],
    events: IBotEvent[] = [],
    directory = __dirname;

// listCommands(`${__dirname}/commands`);
indexFunctions.commands.loadAllCommands(commands, elevated_commands, __dirname);
// util.loadEvents(`${__dirname}/events`, events);

bot.on("ready", async() => {
    await connect(`mongodb://${config.host}:${config.port}/${config.database}`, {useNewUrlParser: true, useUnifiedTopology: true});
    if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings")) {
        await new db(schemas.main.coreMainModel(true)).createRecords([
            tableDefaults.main_settings[0]
        ]);
    }
    indexFunctions.handleEvent(bot, "readyevent", events);
    return;
    // util.handleEvent(bot, "robloxevent", events, bloxyClient);
    // util.handleEvent(bot, "adminevent", events);
});

// On Message Event
bot.on("messageCreate", async (msg) => {
    // Disregard message if sent by bot user
    if (msg.author.bot) return;
    // Pass message to MessageEvent handler
    // TODO: Message Event
    // Define Bot Mention RegExp.
    const mentionRegExp = new RegExp(`^(<@!?${bot.user?.id}>)\\s*`);

    let prefix = (await new db(schemas.main.coreMainModel()).readRecords(undefined, 'prefix'))[0].prefix

    // const errorButtonRow = new Discord.MessageActionRow().addComponents(
    //     new Discord.MessageButton()
    //         .setLabel('Discord')
    //         .setURL('https://discord.gg/VYp9qprv2u')
    //         .setStyle('LINK'),
    //     new Discord.MessageButton()
    //         .setCustomId('error')
    //         .setLabel('Error (WIP)')
    //         .setStyle('DANGER')
    // )
    // const errorEmbed = {
    //     color: [255,0,0] as Discord.ColorResolvable,
    //     title: 'Error',
    //     description: `Tis' an error! \n\nPlease report any unfixable errors below.`,
    //     timestamp: new Date(),
    //     footer: {
    //         text: bot.user?.username,
    //         icon_url: bot.user?.displayAvatarURL(),
    //     },
    // };

    let handleGuildMessage = async () => {
        // return if guild is undefined
        if (!msg.guild?.available) return;
        // Respond "Pong!" to any "ping" message
        if (msg.content.toLowerCase() == "ping") { msg.channel.send("Pong!"); return; };
        // Respond to "setup" command
        if (msg.content.substring(2,7) == ('setup')) { return; } // TODO: Setup Handle
        // Return if guild settings collection does not exist in the database.
        // console.log(await miscFunctions.dbFunctions.collectionExists(undefined, msg.guild));
        if (!await miscFunctions.dbFunctions.collectionExists(undefined, msg.guild)) return;

        let msgArgs = msg.content.split(" ");
        let localPrefix = (await new db(schemas.guild.coreGuildModel(msg.guild, true)).readRecords(undefined, 'prefix'))[0].prefix;
        let globalPrefix = (await new db(schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix;

        let localTest = (msg.content.startsWith(localPrefix) || mentionRegExp.test(msgArgs[0])) && !(msg.content.startsWith(globalPrefix+globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));
        let globalTest = (msg.content.startsWith(globalPrefix+globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));

        // Test and handle local and global commands
        if (localTest) {
            await indexFunctions.commands.handleCommand(bot, commands, msg);
        }
        if (globalTest) {
            // util.handleElevatedCommand(bot, elevated_commands, msg); TODO:
        }

        return;
    }

    let handleDirectMessage = async () => {
        // Respond "Pong!" to "Ping" message.
        if (msg.content.toLowerCase() == "ping") { msg.channel.send("Pong!"); return; };
        let msgArgs = msg.content.split(" ");
        let globalPrefix = (await new db(schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix
        let globalTest = (msg.content.startsWith(globalPrefix+globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));

        (globalTest)
            ? () => {} //util.handleElevatedCommand(bot, elevated_commands, msg) TODO:
            : () => {} // sendErrorMessage(); TODO:
    }

    // msg.channel.send({ embeds: [await errorEmbed], components: [errorButtonRow] });


    (msg.channel.type != "DM" && msg.guild?.available)
        ? await handleGuildMessage()
        : await handleDirectMessage();
    return;
});

bot.login(config.bottoken);
