import * as Discord from "discord.js";
import { guildSettingsSchema } from "./interfaces";
import { db, schemas } from "./database";
import { Schema, Model, model, models, connect, connection } from 'mongoose';

// Event APIs
import { IBotCommand, IBotEvent, IBotDB } from "./IBotAPIs";
import axios from "axios";
import { bloxyClient } from "./app";
//
// Config
import * as ConfigFile from "./config";
var config = ConfigFile.config;

export namespace miscFunctions {
    export namespace functions {
        /**
             * Replace and return all string within a string
             * @param str Original string to change
             * @param search String to search for
             * @param replace String to replace search with
             * @returns Replaced string
             */
        export function replaceAll(str: string, search: string, replace: string) {
            return str.replace(new RegExp(search, 'g'), replace);
        }

        /**
         * Wait for x amount of time
         * @param time Time in seconds to wait.
         * @returns setTimeout Promise
         */
        export function Wait(time: number) {
            var convertMilliToSecond = time*1000;
            return new Promise(r => setTimeout(r, convertMilliToSecond))
        }

        /**
         * Set color of Embed based on RGB inpui
         * @param embed Embed to target.
         * @param color Color converted to R,G,B
         * @returns void
         */
        export async function setEmbedColor(embed: Discord.MessageEmbed, color: string) {
            if (String(color).includes(`,`)) {
                var c = replaceAll(String(color).replace('[','').replace(']',''), ' ', '').split(`,`);
                embed.setColor([parseInt(c[0]),parseInt(c[1]),parseInt(c[2])]);
            }
        }

        /**
         * Set color of Embed based on Main config
         * @param table Table in database to use
         * @param embed Embed to focus
         * @returns void
         */
        export async function setMainEmbedColor(embed: Discord.MessageEmbed, guild?: Discord.Guild) {
            let _model = guild ? schemas.guild.coreGuildModel(guild) : schemas.main.coreMainModel();

            let _Settings = new db(_model);

            if ((await _Settings.readRecords(undefined, 'maincolor'))[0].maincolor) {
                let colorArray = ((await _Settings.readRecords(undefined, 'maincolor'))[0].maincolor) as [number, number, number]
                embed.setColor(colorArray);
            }
        }
    }

    export namespace dbFunctions {
        /**
         * Returns a boolean based on whether or not a collection exists.
         * @param collection Collection in database to search for
         * @returns Promise<boolean>
         */
        export async function collectionExists(_collection?: string, _guild?: Discord.Guild) {
            if (_collection) {
                return new Promise(async (resolve) => {
                    connection.db.listCollections({name: _collection}).next(function(err, collinfo) {
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
                    connection.db.listCollections({name: _guild.id+'_CoreSettings'}).next(function(err, collinfo) {
                        if (collinfo) {
                            resolve(true);
                            return;
                        }
                        resolve(false);
                    });
                });
            }
        }

        /**
         * Returns a boolean based on whether or not a settings record has an existant setting key.
         * @param key Record key to check for
         * @param value Setting value to check for
         * @param guild Optional parameter to define which model to use.
         * @returns Promise<boolean>
         */
        export async function settings_RecordExists(setting: string, value: string, guild?: Discord.Guild) {
            let _model: Model<any, {}, {}> = guild ? schemas.guild.coreGuildModel(guild, true) : schemas.main.coreMainModel(true);
    
            return new Promise(async (resolve) => {
                var _obj: any = { }
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

        /**
         * Checks a specific setting and returns true if not equal to null
         * @param table Table in database to use.
         * @param setting Setting to check for.
         * @returns boolean
         */
        export async function settings_KeyIsSet(setting: string, guild?: Discord.Guild) {
            var _record = (await new db(guild ? schemas.guild.coreGuildModel(guild, true) : schemas.main.coreMainModel(true)).readRecords(undefined, setting))[0][setting];
            return !(_record == '' || _record == undefined || _record == null);
        }

        export function clearModels() {
            for (let model in models) delete models[model];
        }
    }

    /**
     * Parse JSON and return value
     * @param json JSON to parse
     * @param key Key value to return
     * @returns any
     */
    export function parseJSON(json: string, key: string) {
        return JSON.parse(json)[key];
    }

    /**
     * Sends an HTTPRequest and returns response text.
     * @returns JSON
     */
    export function userPresence() {
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
        var theUrl = "http://api.roblox.com/users/7715715/onlinestatus";
        xmlhttp.open("GET", theUrl);
        xmlhttp.send();

        xmlhttp.onreadystatechange = async () => {
            if (await xmlhttp.readyState == 4 && await xmlhttp.status == 200) {
                return(xmlhttp.responseText);
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
}

export namespace indexFunctions {
    export namespace commands {
        /**
         * Handle nonElevated Command by parsing command from _msg and running associated command from _commands.
         * @param _bot Discord bot instance.
         * @param _commands Array list of loaded commands.
         * @param _msg Discord message object.
         * @returns void
         */
        export async function handleCommand(_bot: Discord.Client, _commands: IBotCommand[], _msg: Discord.Message) {
            if (!_msg.guild?.available) return;
            //Split the string into the command and all of the args
            let _guildPrefix = _msg.content.substring(0,1);
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

            let _localRunning = (await new db(schemas.guild.coreGuildModel(_msg.guild, true)).readRecords(undefined,'running'))[0].running;
            let _globalRunning = (await new db(schemas.main.coreMainModel(true)).readRecords(undefined,'running'))[0].running;

            if ((await _globalRunning && await _localRunning) || _command == 'toggle') {
                //Loop through all of our loaded commands
                for (const _commandClass of _commands) {
                    let _aliasExists = false;
                    for (const _commandAlias of _commandClass.info.aliases()) {
                        //Attempt to execute code but keep running incase of error
                        try {
                            // Check if issues command matches defined aliases in commandClass
                            if (!(_commandAlias === _command)) continue;

                            await _commandClass.runCommand(_args, _msg, _bot).catch((e) => { console.log(e); _msg.channel.send("There was an error running that command! Please notify your local developer!"); })
                            _aliasExists = true;
                            break;
                        }
                        catch (exception) {
                            //If there is an error, log error exception for debug
                            console.log(exception);
                        }
                    }

                    if (_aliasExists) break;

                    //Attempt to execute code but keep running incase of error
                    try {
                        
                        // Check if command class is correct command
                        if (!(_commandClass.info.command() === _command)) continue;

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

        /**
         * Push commands into Arraylist from path.
         * @param _commandsPath Path to folder containing commands.
         * @param _commands Array list of commands.
         * @returns void
         */
        export function loadCommands(_commandsPath: string, _commands: IBotCommand[]) {
            //Loop through all of the commands in the config file
            const fs = require('fs');
            const commandsFolder = _commandsPath;

            // Get a list of all commands inside commandsFolder
            fs.readdir(commandsFolder, (err: any, files: any) => {
                // For each file in commandsFolder, add to commands variable
                if (!files) return;
                files.forEach((fileName: any) => {
                    const filePath = `${_commandsPath}/${fileName}`;
                    if (fs.lstatSync(filePath).isDirectory()) { indexFunctions.commands.loadCommands(filePath, _commands); return; }
                    
                    const commandsClass = require(`${_commandsPath}/${miscFunctions.functions.replaceAll(fileName, ".js", "")}`)

                    const command = new commandsClass() as IBotCommand;

                    _commands.push(command);
                });
            })
        }

        /**
         * Handle Elevated Command by parsing command from _msg and running associated command from _elevated_commands.
         * @param _bot Discord bot instance.
         * @param _elevated_commands Array list of loaded commands.
         * @param _msg Message object.
         * @returns void
         */
        export async function handleElevatedCommand(_bot: Discord.Client, _elevated_commands: IBotCommand[], _msg: Discord.Message) {
            //Split the string into the command and all of the args
            let _globalPrefix = String((await new db(schemas.main.coreMainModel(true)).readRecords(undefined,'prefix'))[0].prefix);
            //Regexpression
            const _mentionedRegex = new RegExp(`^(<@!?${_bot.user?.id}>)\\s*`);
            const _prefixMatch = _msg.content.match(_mentionedRegex) || []; // matchedPrefix

            //Setup variables
            let _args = _mentionedRegex.test(_msg.content) 
                ? _msg.content.slice(_prefixMatch[0].toString().length).trim().split(" ").slice(1).slice(1)
                : _msg.content.split(" ").slice(1);
            let _command = _mentionedRegex.test(_msg.content) 
                ? _msg.content.slice(_prefixMatch[0].toString().length).slice(_prefixMatch[0].toString().length).trim().split(" ")[0].toLowerCase()
                : _msg.content.split(" ")[0].replace(String((_globalPrefix+_globalPrefix)), "").toLowerCase();

            let _globalRunning = (await new db(schemas.main.coreMainModel(true)).readRecords(undefined,'running'))[0].running;

            if ((await _globalRunning == 'true') || _command == 'toggle') {
                //Loop through all of our loaded commands
                for (const commandClass of _elevated_commands) {

                    //Attempt to execute code but keep running incase of error
                    try {
                        
                        // Check if command class is correct command
                        if (!(commandClass.info.command() === _command)) continue;

                        await commandClass.runCommand(_args, _msg, _bot).catch((e) => { console.log(e); _msg.channel.send("There was an error running that command! Please notify your local developer!"); });

                    }
                    catch (exception) {
                        //If there is an error, log error exception for debug
                        console.log(exception);
                    }
                }
            }
        }

        /**
         * Push ALL commands into respective ArrayList from path.
         * @param _commands Array list of commands.
         * @param _elevated_commands Array list of elevated commands.
         * @param _directory Directory of commands folders.
         * @returns void
         */
        export function loadAllCommands(_commands: IBotCommand[], _elevated_commands: IBotCommand[], _directory: string) {
            Object.keys(ConfigFile.CommandType).forEach((commandType) => {
                indexFunctions.commands.loadCommands(`${_directory}/commands/${commandType.toString().toLowerCase()}`, _commands);
                indexFunctions.commands.loadCommands(`${_directory}/elevatedcommands/${commandType.toString().toLowerCase()}`, _elevated_commands);
            });
        }
    }

    export namespace events {
        /**
         * Run Events passed by the application.
         * @param event Name of event to run.
         * @param extra Extra variables to pass into event scope.
         * @returns void
         */
        export async function handleEvent(bot: Discord.Client, event: string, events: IBotEvent[], extra?: any) {
            // Loop through all events
            for (const eventClass of events) {
                try {
                    // Check if event class is correct event
                    if (!(eventClass.info.event() === event)) continue;

                    await eventClass.runEvent(bot, extra).catch((e) => { console.log(e) });
                }
                catch(exception) {
                    // If there is an error, log exception
                    console.log(exception);
                }
            }
        }

        /**
         * Load Events into Memory
         * @param eventsPath Path to folder containing events.
         * @returns void
         */
        export function loadEvents(eventsPath: string, events: IBotEvent[]) {
            const fs = require('fs');

            // Get a list of all events inside eventsFolder
            fs.readdir(eventsPath, (err: any, files: any) => {
                // For each file in eventsFolder, add to events variable
                files.forEach((eventName: any) => {
                    const eventsClass = require(`${eventsPath}/${miscFunctions.functions.replaceAll(eventName, ".js", "")}`)

                    const event = new eventsClass() as IBotEvent;

                    events.push(event);
                });
            })
        }
    }

    export namespace dbs {
        /**
         * Push DBs into Arraylist from path.
         * @param _dbsPath Path to folder containing DBs.
         * @param _dbs Array list of DBs.
         * @returns void
         */
        export function loadDBs(_dbsPath: string, _dbs: IBotDB[]) {
            //Loop through all of the commands in the config file
            const fs = require('fs');
            const dbsFolder = _dbsPath;

            // Get a list of all commands inside commandsFolder
            fs.readdir(dbsFolder, (err: any, files: any) => {
                // For each file in commandsFolder, add to commands variable
                if (!files) return;
                files.forEach((fileName: any) => {
                    const filePath = `${_dbsPath}/${fileName}`;
                    if (fs.lstatSync(filePath).isDirectory()) { indexFunctions.dbs.loadDBs(filePath, _dbs); return; }
                    
                    const dbsClass = require(`${_dbsPath}/${miscFunctions.functions.replaceAll(fileName, ".js", "")}`)

                    const command = new dbsClass() as IBotDB;

                    _dbs.push(command);
                });
            })
        }

        /**
         * Run all DB queries.
         * @param _commands Array list of loaded dbs.
         * @returns void
         */
        export async function queryAllDBs(_dbs: IBotDB[]) {

            //Loop through all of our loaded dbs
            for (const _dbClass of _dbs) {

                //Attempt to execute code but keep running incase of error
                try {
                    
                    // Check if command class is correct command
                    if (_dbClass.isGuildDB() || _dbClass.isManual()) continue;

                    await _dbClass.queryDB().catch((e) => { console.log(e); });
                    continue;
                }
                catch (exception) {
                    //If there is an error, log error exception for debug
                    console.log(exception);
                }
            }
        }

        /**
         * Run one DB query
         * @param _dbs Array list of loaded dbs.
         * @param _dbName Unique name of db to query.
         * @returns void
         */
        export async function queryOneDB(_dbs: IBotDB[], _dbName: string, _guild?: Discord.Guild) {
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
    }
}

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

export class discordUser {
    userID: string;

    constructor(userID: string) {
        this.userID = userID;
    }

    getRobloxID() {
        axios.get(`https://verify.eryn.io/api/user/${this.userID}`).then((response: any) => {
            return response.data.robloxId;
        });
    }
}

export class robloxUser {
    userID: string;

    constructor(userID: string) {
        this.userID = userID;
    }
}

export class robloxGroup{
    groupID: number;

    constructor(groupID: number) {
        this.groupID = groupID;
    }

    getRolePermissions() {

    }

    async getGroupRoles() {
        return await bloxyClient.apis.groups.getGroupRoles(this.groupID);
    }
}