"use strict";
// Last modified: 2021/12/05 01:40:01
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
        'MESSAGE',
        'GUILD_MEMBER',
    ]
});
exports.bloxyClient = new Bloxy.Client();
// Declare, export, and load commands/events into memory
exports.commands = [], exports.elevated_commands = [], exports.dbs = [], exports.events = [], exports.directory = __dirname;
util_1.indexFunctions.commands.loadAllCommands(exports.commands, exports.elevated_commands, __dirname);
util_1.indexFunctions.dbs.loadDBs(`${exports.directory}/dbs`, exports.dbs);
util_1.indexFunctions.runAllChecks(exports.commands, exports.elevated_commands, exports.events, exports.dbs);
let y = process.openStdin();
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g);
    bot.guilds.cache.find(guild => { return guild.id === "451576179837763597"; })?.channels.cache.find(channel => { return channel.id === "583547933547429898"; }).send(res.toString());
});
bot.on("ready", async () => {
    await mongoose_1.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${config_1.config.host}:${config_1.config.port}/${config_1.config.database}`, { useNewUrlParser: true, useUnifiedTopology: true });
    await util_1.indexFunctions.dbs.queryAllDBs(exports.dbs);
    console.log("Ready!");
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
    if (msg.content == "Status Report")
        msg.channel.send("Available");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDOzs7Ozs7QUFFckMsT0FBTztBQUNQLDJDQUEwSDtBQUMxSCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFbEMsUUFBUTtBQUNSLCtEQUFtRDtBQUNuRCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDMUIscUNBQWtDO0FBS2xDLGtCQUFrQjtBQUNsQix1Q0FBbUM7QUFDbkMsaUNBQXVEO0FBRXZELHdEQUFnQztBQUNoQyxrRUFBeUM7QUFFekMsdUJBQVksQ0FBQyxrQkFBUSxDQUFDLENBQUM7QUFFdkIsY0FBYztBQUNkLE1BQU0sR0FBRyxHQUFXLElBQUksbUJBQU0sQ0FBQztJQUMzQixPQUFPLEVBQUU7UUFDTCxvQkFBTyxDQUFDLEtBQUssQ0FBQyxNQUFNO1FBQ3BCLG9CQUFPLENBQUMsS0FBSyxDQUFDLGNBQWM7UUFDNUIsb0JBQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCO1FBQ3JDLG9CQUFPLENBQUMsS0FBSyxDQUFDLGFBQWE7UUFDM0Isb0JBQU8sQ0FBQyxLQUFLLENBQUMsZUFBZTtRQUM3QixvQkFBTyxDQUFDLEtBQUssQ0FBQyxrQkFBa0I7UUFDaEMsb0JBQU8sQ0FBQyxLQUFLLENBQUMsZUFBZTtRQUM3QixvQkFBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0I7S0FDekM7SUFDRCxRQUFRLEVBQUU7UUFDTixTQUFTO1FBQ1QsU0FBUztRQUNULGNBQWM7S0FDakI7Q0FDSixDQUFDLENBQUM7QUFFUSxRQUFBLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUU1Qyx3REFBd0Q7QUFDN0MsUUFBQSxRQUFRLEdBQWtCLEVBQUUsRUFDbkMsUUFBQSxpQkFBaUIsR0FBa0IsRUFBRSxFQUNyQyxRQUFBLEdBQUcsR0FBYSxF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