"use strict";
// Last modified: 2021/11/21 19:29:08
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directory = exports.events = exports.dbs = exports.elevated_commands = exports.commands = exports.bloxyClient = void 0;
// APIs
const discord_js_1 = require("discord.js");
const Bloxy = require("devbloxy");
//Config
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
require('dotenv').config();
const config_1 = require("./config");
// Comand Handlers
const mongoose_1 = require("mongoose");
const util_1 = require("./util");
const mongoose_2 = __importDefault(require("mongoose"));
const mongoose_long_1 = __importDefault(require("mongoose-long"));
mongoose_long_1.default(mongoose_2.default);
// Declare Bot
const bot = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
    partials: [
        'CHANNEL',
    ]
});
exports.bloxyClient = new Bloxy.Client();
// Declare, export, and load commands/events into memory
exports.commands = [], exports.elevated_commands = [], exports.dbs = [], exports.events = [], exports.directory = __dirname;
util_1.indexFunctions.commands.loadAllCommands(exports.commands, exports.elevated_commands, __dirname);
util_1.indexFunctions.dbs.loadDBs(`${exports.directory}/dbs`, exports.dbs);
bot.on("ready", async () => {
    await mongoose_1.connect(`mongodb://${config_1.config.host}:${config_1.config.port}/${config_1.config.database}`, { useNewUrlParser: true, useUnifiedTopology: true });
    await util_1.indexFunctions.dbs.queryAllDBs(exports.dbs);
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
    if (msg.author.bot)
        return;
    // Pass message to MessageEvent handler
    // TODO: Message Event
    // Define Bot Mention RegExp.
    const mentionRegExp = new RegExp(`^(<@!?${bot.user?.id}>)\\s*`);
    let prefix = (await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel()).readRecords(undefined, 'prefix'))[0].prefix;
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
        description: ``,
        timestamp: new Date(),
        footer: {
            text: bot.user?.username,
            icon_url: bot.user?.displayAvatarURL(),
        },
    };
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
        let msgArgs = msg.content.split(" ");
        let globalPrefix = (await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix;
        let globalTest = (msg.content.startsWith(globalPrefix + globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));
        if (globalTest) {
            await util_1.indexFunctions.commands.handleElevatedCommand(bot, exports.elevated_commands, msg);
        }
        // if (msg.content.substring(2,7) == ('setup')) { return; } // TODO: Setup Handle
        // Return if guild settings collection does not exist in the database.
        // console.log(await miscFunctions.dbFunctions.collectionExists(undefined, msg.guild));
        if (!await util_1.miscFunctions.dbFunctions.collectionExists(undefined, msg.guild))
            return;
        let localPrefix = (await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(msg.guild, true)).readRecords(undefined, 'prefix'))[0].prefix;
        let localTest = (msg.content.startsWith(localPrefix) || mentionRegExp.test(msgArgs[0])) && !(msg.content.startsWith(globalPrefix + globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));
        // Test and handle local and global commands
        if (localTest) {
            await util_1.indexFunctions.commands.handleCommand(bot, exports.commands, msg);
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
        let globalPrefix = (await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix;
        let globalTest = (msg.content.startsWith(globalPrefix + globalPrefix) || (mentionRegExp.test(msgArgs[0]) && mentionRegExp.test(msgArgs[1])));
        errorEmbed.description = `Sorry! Commands are currently not supported through direct messaging! \n\nPlease report any urgent errors below.`;
        (globalTest)
            ? await util_1.indexFunctions.commands.handleElevatedCommand(bot, exports.elevated_commands, msg)
            : msg.channel.send({ embeds: [errorEmbed], components: [errorButtonRow] });
    };
    (msg.channel.type != "DM" && msg.guild?.available)
        ? await handleGuildMessage()
        : await handleDirectMessage();
    return;
});
bot.login(config_1.config.bottoken);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDOzs7Ozs7QUFFckMsT0FBTztBQUNQLDJDQUErRjtBQUMvRixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFbEMsUUFBUTtBQUNSLCtEQUFtRDtBQUNuRCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDMUIscUNBQWtDO0FBS2xDLGtCQUFrQjtBQUNsQix1Q0FBbUM7QUFDbkMsaUNBQXVEO0FBRXZELHdEQUFnQztBQUNoQyxrRUFBeUM7QUFFekMsdUJBQVksQ0FBQyxrQkFBUSxDQUFDLENBQUM7QUFFdkIsY0FBYztBQUNkLE1BQU0sR0FBRyxHQUFXLElBQUksbUJBQU0sQ0FBQztJQUMzQixPQUFPLEVBQUU7UUFDTCxvQkFBTyxDQUFDLEtBQUssQ0FBQyxNQUFNO1FBQ3BCLG9CQUFPLENBQUMsS0FBSyxDQUFDLGNBQWM7UUFDNUIsb0JBQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCO1FBQ3JDLG9CQUFPLENBQUMsS0FBSyxDQUFDLGFBQWE7UUFDM0Isb0JBQU8sQ0FBQyxLQUFLLENBQUMsZUFBZTtRQUM3QixvQkFBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7UUFDaEMsb0JBQU8sQ0FBQyxLQUFLLENBQUMsZUFBZTtRQUM3QixvQkFBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0I7S0FDekM7SUFDRCxRQUFRLEVBQUU7UUFDTixTQUFTO0tBQ1o7Q0FDSixDQUFDLENBQUM7QUFFUSxRQUFBLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUU1Qyx3REFBd0Q7QUFDN0MsUUFBQSxRQUFRLEdBQWtCLEVBQUUsRUFDbkMsUUFBQSxpQkFBaUIsR0FBa0IsRUFBRSxFQUNyQyxRQUFBLEdBQUcsR0FBYSxFQUFFLEVBQ2xCLFFBQUEsTUFBTSxH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