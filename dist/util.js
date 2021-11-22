"use strict";
// Last modified: 2021/11/21 20:09:13
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.robloxGroup = exports.robloxUser = exports.discordUser = exports.indexFunctions = exports.miscFunctions = void 0;
const app_1 = require("./app");
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
const mongoose_1 = require("mongoose");
const axios_1 = __importDefault(require("axios"));
const modulardiscordbot_auth_1 = require("modulardiscordbot-auth");
// Config
const ConfigFile = __importStar(require("./config"));
var miscFunctions;
(function (miscFunctions) {
    let functions;
    (function (functions) {
        /**
             * Replace and return all string within a string
             * @param str Original string to change
             * @param search String to search for
             * @param replace String to replace search with
             * @returns Replaced string
             */
        function replaceAll(str, search, replace) {
            return str.replace(new RegExp(search, 'g'), replace);
        }
        functions.replaceAll = replaceAll;
        /**
         * Wait for x amount of time
         * @param time Time in seconds to wait.
         * @returns setTimeout Promise
         */
        function Wait(time) {
            var convertMilliToSecond = time * 1000;
            return new Promise(r => setTimeout(r, convertMilliToSecond));
        }
        functions.Wait = Wait;
        /**
         * Set color of Embed based on RGB inpui
         * @param embed Embed to target.
         * @param color Color converted to R,G,B
         * @returns void
         */
        async function setEmbedColor(embed, color) {
            if (String(color).includes(`,`)) {
                var c = replaceAll(String(color).replace('[', '').replace(']', ''), ' ', '').split(`,`);
                embed.setColor([parseInt(c[0]), parseInt(c[1]), parseInt(c[2])]);
            }
        }
        functions.setEmbedColor = setEmbedColor;
        /**
         * Set color of Embed based on Main config
         * @param table Table in database to use
         * @param embed Embed to focus
         * @returns void
         */
        async function setMainEmbedColor(embed, guild) {
            let _model = guild ? modulardiscordbot_db_1.schemas.guild.coreGuildModel(guild) : modulardiscordbot_db_1.schemas.main.coreMainModel();
            let _Settings = new modulardiscordbot_db_1.db(_model);
            if ((await _Settings.readRecords(undefined, 'maincolor'))[0].maincolor) {
                let colorArray = ((await _Settings.readRecords(undefined, 'maincolor'))[0].maincolor);
                embed.setColor(colorArray);
            }
        }
        functions.setMainEmbedColor = setMainEmbedColor;
    })(functions = miscFunctions.functions || (miscFunctions.functions = {}));
    let dbFunctions;
    (function (dbFunctions) {
        /**
         * Returns a boolean based on whether or not a collection exists.
         * @param collection Collection in database to search for
         * @returns Promise<boolean>
         */
        async function collectionExists(_collection, _guild) {
            if (_collection) {
                return new Promise(async (resolve) => {
                    mongoose_1.connection.db.listCollections({ name: _collection }).next(function (err, collinfo) {
                        if (collinfo) {
                            resolve(true);
                            return;
                        }
                        resolve(false);
                    });
                });
            }
            if (_guild) {
                return new Promise(async (resolve) => {
                    mongoose_1.connection.db.listCollections({ name: _guild.id + '_CoreSettings' }).next(function (err, collinfo) {
                        if (collinfo) {
                            resolve(true);
                            return;
                        }
                        resolve(false);
                    });
                });
            }
        }
        dbFunctions.collectionExists = collectionExists;
        /**
         * Returns a boolean based on whether or not a settings record has an existant setting key.
         * @param key Record key to check for
         * @param value Setting value to check for
         * @param guild Optional parameter to define which model to use.
         * @returns Promise<boolean>
         */
        async function settings_RecordExists(setting, value, guild) {
            let _model = guild ? modulardiscordbot_db_1.schemas.guild.coreGuildModel(guild, true) : modulardiscordbot_db_1.schemas.main.coreMainModel(true);
            return new Promise(async (resolve) => {
                var _obj = {};
                _obj[setting] = value;
                _model.countDocuments(_obj, (err, count) => {
                    if (count > 0) {
                        resolve(true);
                        return;
                    }
                    resolve(false);
                });
            });
        }
        dbFunctions.settings_RecordExists = settings_RecordExists;
        /**
         * Checks a specific setting and returns true if not equal to null
         * @param table Table in database to use.
         * @param setting Setting to check for.
         * @returns boolean
         */
        async function settings_KeyIsSet(setting, guild) {
            var _record = (await new modulardiscordbot_db_1.db(guild ? modulardiscordbot_db_1.schemas.guild.coreGuildModel(guild, true) : modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, setting))[0][setting];
            return !(_record == '' || _record == undefined || _record == null);
        }
        dbFunctions.settings_KeyIsSet = settings_KeyIsSet;
        function clearModels() {
            for (let model in mongoose_1.models)
                delete mongoose_1.models[model];
        }
        dbFunctions.clearModels = clearModels;
    })(dbFunctions = miscFunctions.dbFunctions || (miscFunctions.dbFunctions = {}));
    /**
     * Parse JSON and return value
     * @param json JSON to parse
     * @param key Key value to return
     * @returns any
     */
    function parseJSON(json, key) {
        return JSON.parse(json)[key];
    }
    miscFunctions.parseJSON = parseJSON;
    /**
     * Sends an HTTPRequest and returns response text.
     * @returns JSON
     */
    function userPresence() {
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
        var theUrl = "http://api.roblox.com/users/7715715/onlinestatus";
        xmlhttp.open("GET", theUrl);
        xmlhttp.send();
        xmlhttp.onreadystatechange = async () => {
            if (await xmlhttp.readyState == 4 && await xmlhttp.status == 200) {
                return (xmlhttp.responseText);
            }
        };
        // return resolvedPromise;
        // var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        // var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
        // var theUrl = "https://presence.roblox.com/v1/presence/users";
        // xmlhttp.open("POST", theUrl);
        // xmlhttp.setRequestHeader("Content-Type", "text/json");
        // xmlhttp.setRequestHeader("Accept", "text/json");
        // xmlhttp.send(JSON.stringify({"userIds": [ 7715715 ]}));
        // xmlhttp.onreadystatechange = async () => {
        //     // if (await xmlhttp.readyState == 4 && await xmlhttp.status == 200) {
        //         console.log(xmlhttp.responseText);
        //     // }
        // };
    }
    miscFunctions.userPresence = userPresence;
})(miscFunctions = exports.miscFunctions || (exports.miscFunctions = {}));
var indexFunctions;
(function (indexFunctions) {
    let commands;
    (function (commands) {
        /**
         * Handle nonElevated Command by parsing command from _msg and running associated command from _commands.
         * @param _bot Discord bot instance.
         * @param _commands Array list of loaded commands.
         * @param _msg Discord message object.
         * @returns void
         */
        async function handleCommand(_bot, _commands, _msg) {
            if (!_msg.guild?.available)
                return;
            //Split the string into the command and all of the args
            let _guildPrefix = _msg.content.substring(0, 1);
            //Regexpression
            const _mentionedRegex = new RegExp(`^(<@!?${_bot.user?.id}>)\\s*`);
            const _prefixMatch = _msg.content.match(_mentionedRegex) || [];
            //Setup variables
            let _args = _mentionedRegex.test(_msg.content)
                ? _msg.content.slice(_prefixMatch[0].toString().length).trim().split(" ").slice(1)
                : _msg.content.split(" ").slice(1);
            let _command = _mentionedRegex.test(_msg.content)
                ? _msg.content.slice(_prefixMatch[0].toString().length).trim().split(" ")[0].toLowerCase()
                : await _msg.content.split(" ")[0].replace(String(await _guildPrefix), "").toLowerCase();
            let _localRunning = (await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(_msg.guild, true)).readRecords(undefined, 'running'))[0].running;
            let _globalRunning = (await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'running'))[0].running;
            if ((await _globalRunning && await _localRunning) || _command == 'toggle') {
                //Loop through all of our loaded commands
                for (const _commandClass of _commands) {
                    let _aliasExists = false;
                    for (const _commandAlias of _commandClass.info.aliases()) {
                        //Attempt to execute code but keep running incase of error
                        try {
                            // Check if issues command matches defined aliases in commandClass
                            if (!(_commandAlias === _command))
                                continue;
                            await _commandClass.runCommand(_args, _msg, _bot).catch((e) => { console.log(e); _msg.channel.send("There was an error running that command! Please notify your local developer!"); });
                            _aliasExists = true;
                            break;
                        }
                        catch (exception) {
                            //If there is an error, log error exception for debug
                            console.log(exception);
                        }
                    }
                    if (_aliasExists)
                        break;
                    //Attempt to execute code but keep running incase of error
                    try {
                        // Check if command class is correct command
                        if (!(_commandClass.info.command() === _command))
                            continue;
                        await _commandClass.runCommand(_args, _msg, _bot).catch((e) => { console.log(e); _msg.channel.send("There was an error running that command! Please notify your local developer!"); });
                        break;
                    }
                    catch (exception) {
                        //If there is an error, log error exception for debug
                        console.log(exception);
                    }
                }
            }
        }
        commands.handleCommand = handleCommand;
        /**
         * Push commands into Arraylist from path.
         * @param _commandsPath Path to folder containing commands.
         * @param _commands Array list of commands.
         * @returns void
         */
        function loadCommands(_commandsPath, _commands) {
            //Loop through all of the commands in the config file
            const fs = require('fs');
            const commandsFolder = _commandsPath;
            // Get a list of all commands inside commandsFolder
            fs.readdir(commandsFolder, (err, files) => {
                // For each file in commandsFolder, add to commands variable
                if (!files)
                    return;
                files.forEach((fileName) => {
                    const filePath = `${_commandsPath}/${fileName}`;
                    if (fs.lstatSync(filePath).isDirectory()) {
                        indexFunctions.commands.loadCommands(filePath, _commands);
                        return;
                    }
                    const commandsClass = require(`${_commandsPath}/${miscFunctions.functions.replaceAll(fileName, ".js", "")}`);
                    const command = new commandsClass();
                    _commands.push(command);
                });
            });
        }
        commands.loadCommands = loadCommands;
        /**
         * Handle Elevated Command by parsing command from _msg and running associated command from _elevated_commands.
         * @param _bot Discord bot instance.
         * @param _elevated_commands Array list of loaded commands.
         * @param _msg Message object.
         * @returns void
         */
        async function handleElevatedCommand(_bot, _elevated_commands, _msg) {
            if (!await (new modulardiscordbot_auth_1.main.auth(_msg.author)).isEmpowered())
                return;
            //Split the string into the command and all of the args
            let _globalPrefix = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix).repeat(2);
            //Regexpression
            const _mentionedRegex = new RegExp(`^(<@!?${_bot.user?.id}>)\\s*`);
            const _prefixMatch = _msg.content.match(_mentionedRegex) || []; // matchedPrefix
            //Setup variables
            let _args = _mentionedRegex.test(_msg.content)
                ? _msg.content.slice(_prefixMatch[0].toString().length).trim().split(" ").slice(1).slice(1)
                : _msg.content.split(" ").slice(1);
            let _command = _mentionedRegex.test(_msg.content)
                ? _msg.content.slice(_prefixMatch[0].toString().length).slice(_prefixMatch[0].toString().length).trim().split(" ")[0].toLowerCase()
                : _msg.content.split(" ")[0].replace(String((_globalPrefix)), "").toLowerCase();
            let _globalRunning = (await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'running'))[0].running;
            if ((await _globalRunning) || _command == 'toggle' || _command == 'setup') {
                //Loop through all of our loaded commands
                for (const commandClass of _elevated_commands) {
                    //Attempt to execute code but keep running incase of error
                    try {
                        // Check if command class is correct command
                        if (!(commandClass.info.command() === _command))
                            continue;
                        await commandClass.runCommand(_args, _msg, _bot).catch((e) => { console.log(e); _msg.channel.send("There was an error running that command! Please notify your local developer!"); });
                    }
                    catch (exception) {
                        //If there is an error, log error exception for debug
                        console.log(exception);
                    }
                }
            }
        }
        commands.handleElevatedCommand = handleElevatedCommand;
        /**
         * Push ALL commands into respective ArrayList from path.
         * @param _commands Array list of commands.
         * @param _elevated_commands Array list of elevated commands.
         * @param _directory Directory of commands folders.
         * @returns void
         */
        function loadAllCommands(_commands, _elevated_commands, _directory) {
            Object.keys(ConfigFile.CommandType).forEach((commandType) => {
                indexFunctions.commands.loadCommands(`${_directory}/commands/${commandType.toString().toLowerCase()}`, _commands);
                indexFunctions.commands.loadCommands(`${_directory}/elevatedcommands/${commandType.toString().toLowerCase()}`, _elevated_commands);
            });
        }
        commands.loadAllCommands = loadAllCommands;
    })(commands = indexFunctions.commands || (indexFunctions.commands = {}));
    let events;
    (function (events_1) {
        /**
         * Run Events passed by the application.
         * @param event Name of event to run.
         * @param extra Extra variables to pass into event scope.
         * @returns void
         */
        async function handleEvent(bot, event, events, extra) {
            // Loop through all events
            for (const eventClass of events) {
                try {
                    // Check if event class is correct event
                    if (!(eventClass.info.event() === event))
                        continue;
                    await eventClass.runEvent(bot, extra).catch((e) => { console.log(e); });
                }
                catch (exception) {
                    // If there is an error, log exception
                    console.log(exception);
                }
            }
        }
        events_1.handleEvent = handleEvent;
        /**
         * Load Events into Memory
         * @param eventsPath Path to folder containing events.
         * @returns void
         */
        function loadEvents(eventsPath, events) {
            const fs = require('fs');
            // Get a list of all events inside eventsFolder
            fs.readdir(eventsPath, (err, files) => {
                // For each file in eventsFolder, add to events variable
                files.forEach((eventName) => {
                    const eventsClass = require(`${eventsPath}/${miscFunctions.functions.replaceAll(eventName, ".js", "")}`);
                    const event = new eventsClass();
                    events.push(event);
                });
            });
        }
        events_1.loadEvents = loadEvents;
    })(events = indexFunctions.events || (indexFunctions.events = {}));
    let dbs;
    (function (dbs) {
        /**
         * Push DBs into Arraylist from path.
         * @param _dbsPath Path to folder containing DBs.
         * @param _dbs Array list of DBs.
         * @returns void
         */
        function loadDBs(_dbsPath, _dbs) {
            //Loop through all of the commands in the config file
            const fs = require('fs');
            const dbsFolder = _dbsPath;
            // Get a list of all commands inside commandsFolder
            fs.readdir(dbsFolder, (err, files) => {
                // For each file in commandsFolder, add to commands variable
                if (!files)
                    return;
                files.forEach((fileName) => {
                    const filePath = `${_dbsPath}/${fileName}`;
                    if (fs.lstatSync(filePath).isDirectory()) {
                        indexFunctions.dbs.loadDBs(filePath, _dbs);
                        return;
                    }
                    const dbsClass = require(`${_dbsPath}/${miscFunctions.functions.replaceAll(fileName, ".js", "")}`);
                    const command = new dbsClass();
                    _dbs.push(command);
                });
            });
        }
        dbs.loadDBs = loadDBs;
        /**
         * Run all DB queries.
         * @param _commands Array list of loaded dbs.
         * @returns void
         */
        async function queryAllDBs(_dbs, _guild) {
            //Loop through all of our loaded dbs
            for (const _dbClass of _dbs) {
                //Attempt to execute code but keep running incase of error
                try {
                    // Check if command class is correct command
                    if (_dbClass.isGuildDB() && _guild) {
                        await _dbClass.queryDB(_guild).catch((e) => { console.log(e); });
                        continue;
                    }
                    if (_dbClass.isManual() || _dbClass.isGuildDB())
                        continue;
                    await _dbClass.queryDB().catch((e) => { console.log(e); });
                    continue;
                }
                catch (exception) {
                    //If there is an error, log error exception for debug
                    console.log(exception);
                }
            }
        }
        dbs.queryAllDBs = queryAllDBs;
        /**
         * Run one DB query
         * @param _dbs Array list of loaded dbs.
         * @param _dbName Unique name of db to query.
         * @returns void
         */
        async function queryOneDB(_dbs, _dbName, _guild) {
            //Loop through all of our loaded dbs
            for (const _dbClass of _dbs) {
                //Attempt to execute code but keep running incase of error
                try {
                    // Check if command class is correct command
                    if (_guild) {
                        await _dbClass.queryDB(_guild).catch((e) => { console.log(e); });
                        break;
                    }
                    await _dbClass.queryDB().catch((e) => { console.log(e); });
                    break;
                }
                catch (exception) {
                    //If there is an error, log error exception for debug
                    console.log(exception);
                }
            }
        }
        dbs.queryOneDB = queryOneDB;
    })(dbs = indexFunctions.dbs || (indexFunctions.dbs = {}));
})(indexFunctions = exports.indexFunctions || (exports.indexFunctions = {}));
// namespace indexFunctions {
//     /**
//      * Handle Setup Command regardless of Database presence.
//      * @param msg Message object.
//      * @returns void
//      */
//     export async function handleSetup(msg: Discord.Message, bot: Discord.Client, elevated_commands: IBotCommand[]) {
//         //Split the string into the command and all of the args
//         let command = msg.content.split(" ")[0].substring(2).toLowerCase();
//         let args = msg.content.split(" ").slice(1);
//         //Loop through all of our loaded commands
//         for (const commandClass of elevated_commands) {
//             //Attempt to execute code but keep running incase of error
//             try {
//                 // Check if command class is correct command
//                 if (!(commandClass.info.command() === command)) continue;
//                 await commandClass.runCommand(args, msg, bot, elevated_commands).catch((e) => { console.log(e) });
//             }
//             catch (exception) {
//                 //If there is an error, log error exception for debug
//                 console.log(exception);
//             }
//         }
//     }
//     /**
//      * Load ALL Commands into Memory
//      * @returns void
//      */
//     export function loadAllCommands(commands: IBotCommand[], elevated_commands: IBotCommand[], directory: string) {
//         Object.keys(ConfigFile.CommandType).forEach((commandType) => {
//             this.loadCommands(`${directory}/commands/${commandType.toString().toLowerCase()}`, commands);
//             this.loadElevatedCommands(`${directory}/elevatedcommands/${commandType.toString().toLowerCase()}`, elevated_commands);
//         });
//     }
// }
class discordUser {
    constructor(userID) {
        this.userID = userID;
    }
    getRobloxID() {
        axios_1.default.get(`https://verify.eryn.io/api/user/${this.userID}`).then((response) => {
            return response.data.robloxId;
        });
    }
}
exports.discordUser = discordUser;
class robloxUser {
    constructor(userID) {
        this.userID = userID;
    }
}
exports.robloxUser = robloxUser;
class robloxGroup {
    constructor(groupID) {
        this.groupID = groupID;
    }
    getRolePermissions() {
    }
    async getGroupRoles() {
        return await app_1.bloxyClient.apis.groups.getGroupRoles(this.groupID);
    }
}
exports.robloxGroup = robloxGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQ0FBcUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHckMsK0JBQW9DO0FBQ3BDLCtEQUFtRDtBQUNuRCx1Q0FBcUQ7QUFDckQsa0RBQTBCO0FBQzFCLG1FQUE4QztBQUs5QyxTQUFTO0FBQ1QscURBQXVDO0FBRXZDLElBQWlCLGFBQWEsQ0F1SzdCO0FBdktELFdBQWlCLGFBQWE7SUFDMUIsSUFBaUIsU0FBUyxDQW1EekI7SUFuREQsV0FBaUIsU0FBUztRQUN0Qjs7Ozs7O2VBTU87UUFDUCxTQUFnQixVQUFVLENBQUMsR0FBVyxFQUFFLE1BQWMsRUFBRSxPQUFlO1lBQ25FLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUZlLG9CQUFVLGFBRXpCLENBQUE7UUFFRDs7OztXQUlHO1FBQ0gsU0FBZ0IsSUFBSSxDQUFDLElBQVk7WUFDN0IsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLEdBQUMsSUFBSSxDQUFDO1lBQ3JDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQTtRQUNoRSxDQUFDO1FBSGUsY0FBSSxPQUduQixDQUFBO1FBRUQ7Ozs7O1dBS0c7UUFDSSxLQUFLLFVBQVUsYUFBYSxDQUFDLEtBQTJCLEVBQUUsS0FBYTtZQUMxRSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsQ0FBQyxPQUFP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