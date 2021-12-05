"use strict";
// Last modified: 2021/11/23 17:00:49
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
         * Returns a boolean based on whether or not a record has an existant setting key.
         * @param _key Record key to check for
         * @param _value Setting value to check for
         * @param _model Optional parameter to define which model to use.
         * @returns Promise<boolean>
         */
        async function template_RecordExists(_key, _value, _model) {
            return new Promise(async (resolve) => {
                var _obj = {};
                _obj[_key] = _value;
                _model.countDocuments(_obj, (err, count) => {
                    if (count > 0) {
                        resolve(true);
                        return;
                    }
                    resolve(false);
                });
            });
        }
        dbFunctions.template_RecordExists = template_RecordExists;
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
                    for (const _commandAlias of _commandClass.info.getAliases()) {
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
                        if (!(_commandClass.info.getCommand() === _command))
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
            fs.readdirSync(commandsFolder).forEach((fileName) => {
                const filePath = `${_commandsPath}/${fileName}`;
                if (fs.lstatSync(filePath).isDirectory()) {
                    indexFunctions.commands.loadCommands(filePath, _commands);
                    return;
                }
                const commandsClass = require(`${_commandsPath}/${miscFunctions.functions.replaceAll(fileName, ".js", "")}`);
                const command = new commandsClass();
                _commands.push(command);
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
                for (const _commandClass of _elevated_commands) {
                    let _aliasExists = false;
                    for (const _commandAlias of _commandClass.info.getAliases()) {
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
                        if (!(_commandClass.info.getCommand() === _command))
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
                if (require("fs").existsSync(`${_directory}/commands/${commandType.toString().toLowerCase()}`)) {
                    indexFunctions.commands.loadCommands(`${_directory}/commands/${commandType.toString().toLowerCase()}`, _commands);
                }
                if (require("fs").existsSync(`${_directory}/elevatedcommands/${commandType.toString().toLowerCase()}`)) {
                    indexFunctions.commands.loadCommands(`${_directory}/elevatedcommands/${commandType.toString().toLowerCase()}`, _elevated_commands);
                }
            });
        }
        commands.loadAllCommands = loadAllCommands;
        function duplicateCheck(_commands, _elevated_commands) {
            let _commandStats = {
                _commands: [],
                _commandDuplicates: [],
                _aliases: [],
                _aliasDuplicates: []
            };
            let _elevated_commandStats = {
                _commands: [],
                _commandDuplicates: [],
                _aliases: [],
                _aliasDuplicates: []
            };
            for (const _command of _commands) {
                if (_commandStats._commands.indexOf(_command.info.getCommand()) > -1) {
                    _commandStats._commandDuplicates.push(_command.info.getCommand());
                }
                _commandStats._commands.push(_command.info.getCommand());
                for (const _alias of _command.info.getAliases()) {
                    if (_commandStats._aliases.indexOf(_alias) > -1) {
                        _commandStats._aliasDuplicates.push(_alias);
                    }
                    _commandStats._aliases.push(_alias);
                }
            }
            for (const _elevated_command of _elevated_commands) {
                if (_elevated_commandStats._commands.indexOf(_elevated_command.info.getCommand()) > -1) {
                    _elevated_commandStats._commandDuplicates.push(_elevated_command.info.getCommand());
                }
                _elevated_commandStats._commands.push(_elevated_command.info.getCommand());
                for (const _alias of _elevated_command.info.getAliases()) {
                    if (_elevated_commandStats._aliases.indexOf(_alias) > -1) {
                        _elevated_commandStats._aliasDuplicates.push(_alias);
                    }
                    _elevated_commandStats._aliases.push(_alias);
                }
            }
            let _checkOutcome = true;
            if (_commandStats._commandDuplicates.length > 0) {
                console.log("Duplicate commands found!", _commandStats._commandDuplicates);
                _checkOutcome = false;
            }
            if (_commandStats._aliasDuplicates.length > 0) {
                console.log("Duplicate command aliases found!", _commandStats._aliasDuplicates);
                _checkOutcome = false;
            }
            if (_elevated_commandStats._commandDuplicates.length > 0) {
                console.log("Duplicate elevated commands found!", _elevated_commandStats._commandDuplicates);
                _checkOutcome = false;
            }
            if (_elevated_commandStats._aliasDuplicates.length > 0) {
                console.log("Duplicate elevated command aliases found!", _elevated_commandStats._aliasDuplicates);
                _checkOutcome = false;
            }
            return !_checkOutcome;
        }
        commands.duplicateCheck = duplicateCheck;
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
                    if (!(eventClass.info.getEvent() === event))
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
            fs.readdirSync(eventsPath).forEach((eventName) => {
                const eventsClass = require(`${eventsPath}/${miscFunctions.functions.replaceAll(eventName, ".js", "")}`);
                const event = new eventsClass();
                events.push(event);
            });
        }
        events_1.loadEvents = loadEvents;
        function duplicateCheck(_events) {
            let events = [];
            let _duplicates = [];
            for (let _event of _events) {
                if (events.indexOf(_event.info.getEvent()) > -1) {
                    _duplicates.push(_event.info.getEvent());
                }
                events.push(_event.info.getEvent());
            }
            let _checkOutcome = true;
            if (_duplicates.length > 0) {
                console.log("Duplicate event types found!", _duplicates);
                _checkOutcome = false;
            }
            return !_checkOutcome;
        }
        events_1.duplicateCheck = duplicateCheck;
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
            fs.readdirSync(dbsFolder).forEach((fileName) => {
                const filePath = `${_dbsPath}/${fileName}`;
                if (fs.lstatSync(filePath).isDirectory()) {
                    indexFunctions.dbs.loadDBs(filePath, _dbs);
                    return;
                }
                const dbsClass = require(`${_dbsPath}/${miscFunctions.functions.replaceAll(fileName, ".js", "")}`);
                const command = new dbsClass();
                _dbs.push(command);
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
                    if (_dbClass.info.isGuildDB() && _guild) {
                        await _dbClass.queryDB(_guild).catch((e) => { console.log(e); });
                        continue;
                    }
                    if (_dbClass.info.isManual() || _dbClass.info.isGuildDB())
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
        function duplicateCheck(_dbs) {
            let _ids = [];
            let _duplicates = [];
            for (let _db of _dbs) {
                if (_ids.indexOf(_db.info._id()) > -1) {
                    _duplicates.push(_db.info._id());
                }
                _ids.push(_db.info._id());
            }
            let _checkOutcome = true;
            if (_duplicates.length > 0) {
                console.log("Duplicate DB IDs found!", _duplicates);
                _checkOutcome = false;
            }
            return !_checkOutcome;
        }
        dbs.duplicateCheck = duplicateCheck;
    })(dbs = indexFunctions.dbs || (indexFunctions.dbs = {}));
    function runAllChecks(_commands, _elevated_commands, _events, _dbs) {
        if (commands.duplicateCheck(_commands, _elevated_commands) || events.duplicateCheck(_events) || dbs.duplicateCheck(_dbs)) {
            throw new Error("Checks failed!");
        }
    }
    indexFunctions.runAllChecks = runAllChecks;
})(indexFunctions = exports.indexFunctions || (exports.indexFunctions = {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQ0FBcUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHckMsK0JBQThFO0FBQzlFLCtEQUFtRDtBQUNuRCx1Q0FBcUQ7QUFDckQsa0RBQTBCO0FBQzFCLG1FQUE4QztBQUs5QyxTQUFTO0FBQ1QscURBQXVDO0FBR3ZDLElBQWlCLGFBQWEsQ0E2TDdCO0FBN0xELFdBQWlCLGFBQWE7SUFDMUIsSUFBaUIsU0FBUyxDQW1EekI7SUFuREQsV0FBaUIsU0FBUztRQUN0Qjs7Ozs7O2VBTU87UUFDUCxTQUFnQixVQUFVLENBQUMsR0FBVyxFQUFFLE1BQWMsRUFBRSxPQUFlO1lBQ25FLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUZlLG9CQUFVLGFBRXpCLENBQUE7UUFFRDs7OztXQUlHO1FBQ0gsU0FBZ0IsSUFBSSxDQUFDLElBQVk7WUFDN0IsSUFBSSxvQkFBb0IsR0FBRyxJQUFJLEdBQUMsSUFBSSxDQUFDO1lBQ3JDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQTtRQUNoRSxDQUFDO1FBSGUsY0FBSSxPQUduQixDQUFBO1FBRUQ7Ozs7O1dBS0c7UUFDSSxLQUFLLFVBQVUsYUFBYSxDQUFDLEtBQW1CLEVBQUUsS0FBYTtZQUNsRSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsQ0FBQyxPQUFP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