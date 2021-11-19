"use strict";
// Last modified: 2021/11/18 12:32:58
Object.defineProperty(exports, "__esModule", { value: true });
exports.directory = exports.events = exports.dbs = exports.elevated_commands = exports.commands = exports.bloxyClient = void 0;
// APIs
const discord_js_1 = require("discord.js");
const Bloxy = require("devbloxy");
//Config
const database_1 = require("./database");
require('dotenv').config();
const config_1 = require("./config");
// Comand Handlers
const mongoose_1 = require("mongoose");
const util_1 = require("./util");
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
// listCommands(`${__dirname}/commands`);
util_1.indexFunctions.commands.loadAllCommands(exports.commands, exports.elevated_commands, __dirname);
// util.loadEvents(`${__dirname}/events`, events);
bot.on("ready", async () => {
    await mongoose_1.connect(`mongodb://${config_1.config.host}:${config_1.config.port}/${config_1.config.database}`, { useNewUrlParser: true, useUnifiedTopology: true });
    util_1.indexFunctions.dbs.queryAllDBs(exports.dbs);
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
    let prefix = (await new database_1.db(database_1.schemas.main.coreMainModel()).readRecords(undefined, 'prefix'))[0].prefix;
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
            await util_1.indexFunctions.commands.handleElevatedCommand(bot, exports.elevated_commands, msg);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDOzs7QUFFckMsT0FBTztBQUNQLDJDQUErRjtBQUMvRixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFbEMsUUFBUTtBQUNSLHlDQUF5QztBQUN6QyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDMUIscUNBQWtDO0FBUWxDLGtCQUFrQjtBQUNsQix1Q0FBNkU7QUFDN0UsaUNBQXVEO0FBRXZELGNBQWM7QUFDZCxNQUFNLEdBQUcsR0FBVyxJQUFJLG1CQUFNLENBQUM7SUFDM0IsT0FBTyxFQUFFO1FBQ0wsb0JBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTTtRQUNwQixvQkFBTyxDQUFDLEtBQUssQ0FBQyxjQUFjO1FBQzVCLG9CQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QjtRQUNyQyxvQkFBTyxDQUFDLEtBQUssQ0FBQyxhQUFhO1FBQzNCLG9CQUFPLENBQUMsS0FBSyxDQUFDLGVBQWU7UUFDN0Isb0JBQU8sQ0FBQyxLQUFLLENBQUMsa0JBQWtCO1FBQ2hDLG9CQUFPLENBQUMsS0FBSyxDQUFDLGVBQWU7UUFDN0Isb0JBQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCO0tBQ3pDO0lBQ0QsUUFBUSxFQUFFO1FBQ04sU0FBUztLQUNaO0NBQ0osQ0FBQyxDQUFDO0FBRVEsUUFBQSxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFNUMsd0RBQXdEO0FBQzdDLFFBQUEsUUFBUSxHQUFrQixFQUFFLEVBQ25DLFFBQUEsaUJBQWlCLEdBQWtCLEVBQUUsRUFDckMsUUFBQSxHQUFHLEdBQWEsRUFBRSxFQUNsQixRQUFBLE1BQU0sR0FBZ0IsRUFBRSxFQUN4QixRQUFBLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFFMUIseUNBQXlDO0FBQ3pDLHFC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