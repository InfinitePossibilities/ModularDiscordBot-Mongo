"use strict";
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
const database_1 = require("./database");
const mongoose_1 = require("mongoose");
const axios_1 = __importDefault(require("axios"));
const app_1 = require("./app");
//
// Config
const ConfigFile = __importStar(require("./config"));
var config = ConfigFile.config;
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
            let _model = guild ? database_1.schemas.guild.coreGuildModel(guild) : database_1.schemas.main.coreMainModel();
            let _Settings = new database_1.db(_model);
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
            let _model = guild ? database_1.schemas.guild.coreGuildModel(guild, true) : database_1.schemas.main.coreMainModel(true);
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
            var _record = (await new database_1.db(guild ? database_1.schemas.guild.coreGuildModel(guild, true) : database_1.schemas.main.coreMainModel(true)).readRecords(undefined, setting))[0][setting];
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
            let _localRunning = (await new database_1.db(database_1.schemas.guild.coreGuildModel(_msg.guild, true)).readRecords(undefined, 'running'))[0].running;
            let _globalRunning = (await new database_1.db(database_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'running'))[0].running;
            if ((await _globalRunning && await _localRunning) || _command == 'toggle') {
                //Loop through all of our loaded commands
                for (const _commandClass of _commands) {
                    //Attempt to execute code but keep running incase of error
                    try {
                        // Check if command class is correct command
                        if (!(_commandClass.info.command() === _command))
                            continue;
                        await _commandClass.runCommand(_args, _msg, _bot).catch((e) => { console.log(e); _msg.channel.send("There was an error running that command! Please notify your local developer!"); });
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
            //Split the string into the command and all of the args
            let _globalPrefix = String((await new database_1.db(database_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'prefix'))[0].prefix);
            //Regexpression
            const _mentionedRegex = new RegExp(`^(<@!?${_bot.user?.id}>)\\s*`);
            const _prefixMatch = _msg.content.match(_mentionedRegex) || []; // matchedPrefix
            //Setup variables
            let _args = _mentionedRegex.test(_msg.content)
                ? _msg.content.slice(_prefixMatch[0].toString().length).trim().split(" ").slice(1).slice(1)
                : _msg.content.split(" ").slice(1);
            let _command = _mentionedRegex.test(_msg.content)
                ? _msg.content.slice(_prefixMatch[0].toString().length).slice(_prefixMatch[0].toString().length).trim().split(" ")[0].toLowerCase()
                : _msg.content.split(" ")[0].replace(String((_globalPrefix + _globalPrefix)), "").toLowerCase();
            let _globalRunning = (await new database_1.db(database_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'running'))[0].running;
            if ((await _globalRunning == 'true') || _command == 'toggle') {
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
//      * Handle Elevated Command.
//      * @param msg Message object.
//      * @returns void
//      */
//     export async function handleElevatedCommand(bot: Discord.Client, elevated_commands: IBotCommand[], msg: Discord.Message) {
//         //Split the string into the command and all of the args
//         let prefix = String(await new GlobalSettings().readSetting('prefix'));
//         //Regexpression
//         const prefixRegex = new RegExp(`^(<@!?${bot.user?.id}>)\\s*`);
//         const matchedPrefix = msg.content.match(prefixRegex) || [];
//         //Setup variables
//         let args = prefixRegex.test(msg.content) 
//             ? msg.content.slice(matchedPrefix[0].toString().length).trim().split(" ").slice(1).slice(1)
//             : msg.content.split(" ").slice(1);
//         let command = prefixRegex.test(msg.content) 
//             ? msg.content.slice(matchedPrefix[0].toString().length).slice(matchedPrefix[0].toString().length).trim().split(" ")[0].toLowerCase()
//             : msg.content.split(" ")[0].replace(String((prefix+prefix)), "").toLowerCase();
//         if (await new GlobalSettings().readSetting('running') == 'true' || command == 'toggle') {
//             //Loop through all of our loaded commands
//             for (const commandClass of elevated_commands) {
//                 //Attempt to execute code but keep running incase of error
//                 try {
//                     // Check if command class is correct command
//                     if (!(commandClass.info.command() === command)) continue;
//                     await commandClass.runCommand(args, msg, bot, elevated_commands).catch((e) => { console.log(e); msg.channel.send("There was an error running that command! Please notify your local developer!"); });
//                 }
//                 catch (exception) {
//                     //If there is an error, log error exception for debug
//                     console.log(exception);
//                 }
//             }
//         }
//     }
//     /**
//      * Load Elevated Commands into Memory from path.
//      * @param commandsPath Path to folder containing elevated commands.
//      * @returns void
//      */
//     export function loadElevatedCommands(commandsPath: string, elevated_commands: IBotCommand[]) {
//         //Loop through all of the commands in the config file
//         const fs = require('fs');
//         const commandsFolder = commandsPath;
//         // Get a list of all commands inside commandsFolder
//         fs.readdir(commandsFolder, (err: any, files: any) => {
//             // For each file in commandsFolder, add to commands variable
//             files.forEach((fileName: any) => {
//                 // console.log(file);
//                 const commandsClass = require(`${commandsPath}/${replaceAll(fileName, ".js", "")}`)
//                 const command = new commandsClass() as IBotCommand;
//                 elevated_commands.push(command);
//             });
//         })
//         // for (const commandName of config.commands as String[])
//     }
//     /**
//      * Handle nonElevated Command.
//      * @param msg Message object
//      * @returns void
//      */
//     export async function handleCommand(bot: Discord.Client, commands: IBotCommand[], msg: Discord.Message) {
//         if (!msg.guild?.available) return;
//         //Split the string into the command and all of the args
//         let prefix = await new LocalSettings(msg.guild).readSetting('prefix');
//         //Regexpression
//         const prefixRegex = new RegExp(`^(<@!?${bot.user?.id}>)\\s*`);
//         const matchedPrefix = msg.content.match(prefixRegex) || [];
//         //Setup variables
//         let args = prefixRegex.test(msg.content) 
//             ? msg.content.slice(matchedPrefix[0].toString().length).trim().split(" ").slice(1)
//             : msg.content.split(" ").slice(1);
//         let command = prefixRegex.test(msg.content) 
//             ? msg.content.slice(matchedPrefix[0].toString().length).trim().split(" ")[0].toLowerCase()
//             : await msg.content.split(" ")[0].replace(String(await prefix), "").toLowerCase();
//         let localRunning = String(await new LocalSettings(msg.guild).readSetting('running'));
//         let globalRunning = String(await new GlobalSettings().readSetting('running'));
//         if ((globalRunning == 'true' && localRunning == 'true') || command == 'toggle') {
//             //Loop through all of our loaded commands
//             for (const commandClass of commands) {
//                 //Attempt to execute code but keep running incase of error
//                 try {
//                     // Check if command class is correct command
//                     if (!(commandClass.info.command() === command)) continue;
//                     await commandClass.runCommand(args, msg, bot, commands).catch((e) => { console.log(e); msg.channel.send("There was an error running that command! Please notify your local developer!"); });
//                 }
//                 catch (exception) {
//                     //If there is an error, log error exception for debug
//                     console.log(exception);
//                 }
//             }
//         }
//     }
//     /**
//      * Load nonElevated Commands into Memory from path.
//      * @param commandsPath Path to folder containing commands.
//      * @returns void
//      */
//     export function loadCommands(commandsPath: string, commands: IBotCommand[]) {
//         //Loop through all of the commands in the config file
//         const fs = require('fs');
//         const commandsFolder = commandsPath;
//         // Get a list of all commands inside commandsFolder
//         fs.readdir(commandsFolder, (err: any, files: any) => {
//             // For each file in commandsFolder, add to commands variable
//             files.forEach((fileName: any) => {
//                 const filePath = `${commandsPath}/${fileName}`;
//                 if (fs.lstatSync(filePath).isDirectory()) { this.loadCommands(filePath, commands); return; }
//                 const commandsClass = require(`${commandsPath}/${replaceAll(fileName, ".js", "")}`)
//                 const command = new commandsClass() as IBotCommand;
//                 commands.push(command);
//             });
//         })
//         // for (const commandName of config.commands as String[])
//     }
//     /**
//      * Run Events passed by the application.
//      * @param event Name of event to run.
//      * @param extra Extra variables to pass into event scope.
//      * @returns void
//      */
//     export async function handleEvent(bot: Discord.Client, event: string, events: IBotEvent[], extra?: any) {
//         // Loop through all events
//         for (const eventClass of events) {
//             try {
//                 // Check if event class is correct event
//                 if (!(eventClass.info.event() === event)) continue;
//                 await eventClass.runEvent(bot, extra).catch((e) => { console.log(e) });
//             }
//             catch(exception) {
//                 // If there is an error, log exception
//                 console.log(exception);
//             }
//         }
//     }
//     /**
//      * Load Events into Memory
//      * @param eventsPath Path to folder containing events.
//      * @returns void
//      */
//     export function loadEvents(eventsPath: string, events: IBotEvent[]) {
//         const fs = require('fs');
//         // Get a list of all events inside eventsFolder
//         fs.readdir(eventsPath, (err: any, files: any) => {
//             // For each file in eventsFolder, add to events variable
//             files.forEach((eventName: any) => {
//                 const eventsClass = require(`${eventsPath}/${replaceAll(eventName, ".js", "")}`)
//                 const event = new eventsClass() as IBotEvent;
//                 events.push(event);
//             });
//         })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSx5Q0FBeUM7QUFDekMsdUNBQTZFO0FBSTdFLGtEQUEwQjtBQUMxQiwrQkFBb0M7QUFDcEMsRUFBRTtBQUNGLFNBQVM7QUFDVCxxREFBdUM7QUFDdkMsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztBQUUvQixJQUFpQixhQUFhLENBdUs3QjtBQXZLRCxXQUFpQixhQUFhO0lBQzFCLElBQWlCLFNBQVMsQ0FtRHpCO0lBbkRELFdBQWlCLFNBQVM7UUFDdEI7Ozs7OztlQU1PO1FBQ1AsU0FBZ0IsVUFBVSxDQUFDLEdBQVcsRUFBRSxNQUFjLEVBQUUsT0FBZTtZQUNuRSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFGZSxvQkFBVSxhQUV6QixDQUFBO1FBRUQ7Ozs7V0FJRztRQUNILFNBQWdCLElBQUksQ0FBQyxJQUFZO1lBQzdCLElBQUksb0JBQW9CLEdBQUcsSUFBSSxHQUFDLElBQUksQ0FBQztZQUNyQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUE7UUFDaEUsQ0FBQztRQUhlLGNBQUksT0FHbkIsQ0FBQTtRQUVEOzs7OztXQUtHO1FBQ0ksS0FBSyxVQUFVLGFBQWEsQ0FBQyxLQUEyQixFQUFFLEtBQWE7WUFDMUUsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM3QixJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFH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