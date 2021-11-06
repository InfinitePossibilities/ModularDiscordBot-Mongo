"use strict";
// Last modified: 2021/11/02 01:36:20
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directory = exports.events = exports.elevated_commands = exports.commands = exports.bloxyClient = void 0;
// APIs
const Discord = __importStar(require("discord.js"));
const Bloxy = require("devbloxy");
//Config
const database_1 = require("./database");
require('dotenv').config();
const config_1 = require("./config");
const config_2 = require("./config");
// Comand Handlers
const mongoose_1 = require("mongoose");
const util_1 = require("./util");
// Declare Bot
const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_PRESENCES
    ]
});
exports.bloxyClient = new Bloxy.Client();
// Declare, export, and load commands/events into memory
exports.commands = [], exports.elevated_commands = [], exports.events = [], exports.directory = __dirname;
// listCommands(`${__dirname}/commands`);
util_1.indexFunctions.commands.loadAllCommands(exports.commands, exports.elevated_commands, __dirname);
// util.loadEvents(`${__dirname}/events`, events);
bot.on("ready", async () => {
    await mongoose_1.connect(`mongodb://${config_1.config.host}:${config_1.config.port}/${config_1.config.database}`, { useNewUrlParser: true, useUnifiedTopology: true });
    if (!await util_1.miscFunctions.dbFunctions.collectionExists("Main_CoreSettings")) {
        await new database_1.db(database_1.schemas.main.coreMainModel(true)).createRecords([
            config_2.tableDefaults.main_settings[0]
        ]);
    }
    // console.log(await miscFunctions.dbFunctions.settings_KeyIsSet("botname"));
    // console.log((await new db(schemas.main.coreMainModel()).readRecords(undefined, 'maincolor')));
    return;
    // util.handleEvent(bot, "readyevent", events);
    // util.handleEvent(bot, "robloxevent", events, bloxyClient);
    // util.handleEvent(bot, "adminevent", events);
});
// On Message Event
bot.on("messageCreate", async (msg) => {
    // if (msg.content == "test" && msg.guild?.available) {
    // await new db(testModel).createRecords([
    //     {
    //         name: 'Bill',
    //         email: 'bill@initech.com',
    //         avatar: 'https://i.imgur.com/dM7Thhn.png',
    //     },
    //     {
    //         name: 'Scott',
    //         email: 'scott@initech.com',
    //         avatar: 'https://i.imgur.com/dM7Thhn.png'
    //     }
    // ]);
    // console.log((await new db(LocalSettings.coreGuildModel(msg.guild)).readRecords(undefined, 'maincolor'))[0].maincolor)
    // await new db(LocalSettings.coreGuildModel(msg.guild)).createRecords([
    //     tableQuerys.guild_settings[0][0]
    // ]);
    // // console.log(tableQuerys.guild_settings[0][0]);
    // console.log(await collectionExists(msg.guild.id+"_CoreSettings"));
    // console.log(await recordExists("botname", "Test Bot", msg.guild));
    // console.log(models);
    // console.log(await isSet("botname", msg.guild));
    // console.log(models);
    // }
    // Disregard message if sent by bot user
    if (msg.author.bot)
        return;
    // Pass message to MessageEvent handler
    // TODO: Message Event
    // Define Bot Mention RegExp.
    const mentionRegExp = new RegExp(`^(<@!?${bot.user?.id}>)\\s*`);
    let prefix = (await new database_1.db(database_1.schemas.main.coreMainModel()).readRecords(undefined, 'prefix'))[0].prefix;
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
        if (!msg.guild?.available)
            return;
        // Respond "Pong!" to any "ping" message
        if (msg.content.toLowerCase() == "ping") {
            msg.channel.send("Pong!");
            return;
        }
        ;
        // Respond to "setup" command
        if (msg.content.substring(2, 7) == ('setup')) {
            return;
        } // TODO: Setup Handle
        // Return if guild settings collection does not exist in the database.
        // console.log(await miscFunctions.dbFunctions.collectionExists(undefined, msg.guild));
        if (!await util_1.miscFunctions.dbFunctions.collectionExists(undefined, msg.guild))
            return;
        let msgArgs = msg.content.split(" ");
        let localPrefix = (await new database_1.db(database_1.schemas.guild.coreGuildModel(msg.guild, true)).readRecords(undefined, 'prefix'))[0].prefix;
        let globalPrefix = (await new database_1.db(database_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix;
        let localTest = (msg.content.startsWith(localPrefix) || mentionRegExp.test(msgArgs[0])) && !(msg.content.startsWith(globalPrefix + globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));
        let globalTest = (msg.content.startsWith(globalPrefix + globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));
        // Test and handle local and global commands
        if (localTest) {
            await util_1.indexFunctions.commands.handleCommand(bot, exports.commands, msg);
        }
        if (globalTest) {
            // util.handleElevatedCommand(bot, elevated_commands, msg); TODO:
        }
        return;
    };
    let handleDirectMessage = async () => {
        // Respond "Pong!" to "Ping" message.
        if (msg.content.toLowerCase() == "ping") {
            msg.channel.send("Pong!");
            return;
        }
        ;
        let msgArgs = msg.content.split(" ");
        let globalPrefix = (await new database_1.db(database_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix;
        let globalTest = (msg.content.startsWith(globalPrefix + globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));
        (globalTest)
            ? () => { } //util.handleElevatedCommand(bot, elevated_commands, msg) TODO:
            : () => { }; // sendErrorMessage(); TODO:
    };
    // msg.channel.send({ embeds: [await errorEmbed], components: [errorButtonRow] });
    (msg.channel.type != "DM" && msg.guild?.available)
        ? await handleGuildMessage()
        : await handleDirectMessage();
    return;
});
bot.login(config_1.config.bottoken);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRXJDLE9BQU87QUFDUCxvREFBc0M7QUFDdEMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWxDLFFBQVE7QUFDUix5Q0FBeUM7QUFDekMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQzFCLHFDQUFrQztBQUVsQyxxQ0FBeUM7QUFNekMsa0JBQWtCO0FBQ2xCLHVDQUE2RTtBQUM3RSxpQ0FBdUQ7QUFFdkQsY0FBYztBQUNkLE1BQU0sR0FBRyxHQUFtQixJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDM0MsT0FBTyxFQUFFO1FBQ0wsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTTtRQUM1QixPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjO1FBQ3BDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QjtRQUM3QyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhO1FBQ25DLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWU7S0FDeEM7Q0FBQyxDQUFDLENBQUM7QUFFRyxRQUFBLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUU1Qyx3REFBd0Q7QUFDN0MsUUFBQSxRQUFRLEdBQWtCLEVBQUUsRUFDbkMsUUFBQSxpQkFBaUIsR0FBa0IsRUFBRSxFQUNyQyxRQUFBLE1BQU0sR0FBZ0IsRUFBRSxFQUN4QixRQUFBLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFFMUIseUNBQXlDO0FBQ3pDLHFCQUFjLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxnQkFBUSxFQUFFLHlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FB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