// Last modified: 2021/11/25 02:23:40

// APIs
import { Client, Intents, MessageActionRow, MessageButton, ColorResolvable, ClientEvents, TextChannel } from "discord.js";
const Bloxy = require("devbloxy");

//Config
import { db, schemas } from "modulardiscordbot-db";
require('dotenv').config()
import { config } from "./config";

// Internal Bot APIs
import { IBotCommand, IBotDB, IBotEvent } from "./IBotAPIs";

// Comand Handlers
import { connect } from 'mongoose';
import { miscFunctions, indexFunctions } from "./util";

import mongoose from "mongoose";
import mongooseLong from "mongoose-long";

mongooseLong(mongoose);

// Declare Bot
const bot: Client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
    partials: [
        'CHANNEL',
        'MESSAGE',
        'GUILD_MEMBER',
    ]
});

export var bloxyClient = new Bloxy.Client();

// Declare, export, and load commands/events into memory
export var commands: IBotCommand[] = [],
    elevated_commands: IBotCommand[] = [],
    dbs: IBotDB[] = [],
    events: IBotEvent[] = [],
    directory = __dirname;

indexFunctions.commands.loadAllCommands(commands, elevated_commands, __dirname);
indexFunctions.dbs.loadDBs(`${directory}/dbs`, dbs);
indexFunctions.runAllChecks(commands, elevated_commands, events, dbs);


let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g);
    (bot.guilds.cache.find(guild => { return guild.id === "451576179837763597" })?.channels.cache.find(channel => { return channel.id === "583547933547429898"}) as TextChannel).send(res.toString());
})

bot.on("ready", async() => {
    await connect(`mongodb://${config.host}:${config.port}/${config.database}`, {useNewUrlParser: true, useUnifiedTopology: true});
    await indexFunctions.dbs.queryAllDBs(dbs);
    console.log("Ready!")
    // if (!await miscFunctions.dbFunctions.collectionExists("Main_CoreSettings")) {
    //     await new db(schemas.main.coreMainModel(true)).createRecords([
    //         tableDefaults.main_settings[0]
    //     ]);
    // }
    // indexFunctions.handleEvent(bot, "readyevent", events);
    return;
    // util.handleEvent(bot, "robloxevent", events, bloxyClient);
    // util.handleEvent(bot, "adminevent", events);
});

// On Message Event
bot.on("messageCreate", async (msg) => {
    // Disregard message if sent by bot user
    if (msg.content == "Status Report") msg.channel.send("Available");
    if (msg.author.bot) return;
    // Pass message to MessageEvent handler
    // TODO: Message Event
    // Define Bot Mention RegExp.
    const mentionRegExp = new RegExp(`^(<@!?${bot.user?.id}>)\\s*`);

    let prefix = (await new db(schemas.main.coreMainModel()).readRecords(undefined, 'prefix'))[0].prefix

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
        description: ``,
        timestamp: new Date(),
        footer: {
            text: bot.user?.username,
            icon_url: bot.user?.displayAvatarURL(),
        },
    };

    let handleGuildMessage = async () => {
        // return if guild is undefined
        if (!msg.guild?.available) return;
        // Respond "Pong!" to any "ping" message
        if (msg.content.toLowerCase() == "ping") { msg.channel.send("Pong!"); return; };
        
        let msgArgs = msg.content.split(" ");
        
        let globalPrefix = (await new db(schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix;
        let globalTest = (msg.content.startsWith(globalPrefix+globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));

        if (globalTest) {
            await indexFunctions.commands.handleElevatedCommand(bot, elevated_commands, msg);
        }
        // if (msg.content.substring(2,7) == ('setup')) { return; } // TODO: Setup Handle
        // Return if guild settings collection does not exist in the database.
        // console.log(await miscFunctions.dbFunctions.collectionExists(undefined, msg.guild));
        if (!await miscFunctions.dbFunctions.collectionExists(undefined, msg.guild)) return;

        let localPrefix = (await new db(schemas.guild.coreGuildModel(msg.guild, true)).readRecords(undefined, 'prefix'))[0].prefix;
        let localTest = (msg.content.startsWith(localPrefix) || mentionRegExp.test(msgArgs[0])) && !(msg.content.startsWith(globalPrefix+globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));

        // Test and handle local and global commands
        if (localTest) {
            await indexFunctions.commands.handleCommand(bot, commands, msg);
        }

        return;
    }

    let handleDirectMessage = async () => {
        // Respond "Pong!" to "Ping" message.
        if (msg.content.toLowerCase() == "ping") { msg.channel.send("Pong!"); return; };
        let msgArgs = msg.content.split(" ");
        let globalPrefix = (await new db(schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix
        let globalTest = (msg.content.startsWith(globalPrefix+globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));

        errorEmbed.description = `Sorry! Commands are currently not supported through direct messaging! \n\nPlease report any urgent errors below.`;
        (globalTest)
            ? await indexFunctions.commands.handleElevatedCommand(bot, elevated_commands, msg)
            : msg.channel.send({ embeds: [errorEmbed], components: [errorButtonRow]});
    }

    (msg.channel.type != "DM" && msg.guild?.available)
        ? await handleGuildMessage()
        : await handleDirectMessage();
    return;
});

bot.login(config.bottoken);