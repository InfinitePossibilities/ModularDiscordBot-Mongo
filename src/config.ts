// Last modified: 2021/11/20 21:56:41
import { tableQueryTemplate } from "./interfaces";

export const config = {
    // Database Information
    "host": "127.0.0.1",
    "database": "DHS_Bot",
    "port": 27017,
    
    // Bot Token
    "bottoken": process.env.BOT_TOKEN,

    // Roblox Account Cookie
    "robloxuser": process.env.ROBLOX_USER,
    "robloxpass": process.env.ROBLOX_PASS,
    "robloxcookie": process.env.ROBLOX_COOKIE,

    // Local whitelisted settings
    "localwhitelistedsettings": [
        "running",
        "prefix",
        "botname",
        "maincolor",

        "adminroles",
        "modroles",

        "doautoannounce",
        "announcechannels",
        "dochannellog",
        "logchannels",
        "doroleopt",
        "optroles",

        "roleannounceblacklist",
        // "requestblacklisted",
        "usersblacklisted",
        "robloxenabled",
        "protectees",
        "robloxgroup"
    ],
    
    // Global whitelisted settings
    "globalwhitelistedsettings": [
        "running",
        "prefix",
        "admins",
        "mods",
        "maincolor",
        "robloxenabled",
        "usersblacklisted",
        "discordGuilds",
        "robloxGroups",
        "mainguild"
    ]
}

export enum CommandType {
    GENERAL = "GENERAL",
    UTILITY = "UTILITY",
    DEVELOPER = "DEVELOPER"
}

export enum EventType {
    CORE = "CORE",
    GENERAL = "GENERAL"
}

export const commandOverrides = [
    "keep",
    "override"
];

export const tableDefaults: tableQueryTemplate = {
    guild_settings: [
        [{
            "running": true,
            "prefix": "-",
            "botname": "Test Bot",

            // "pointmodroles": [],
            // "pointmods": [],

            // "doAutoAnnounce": false,
            // "announceChannels": [],
            // "doChannelLog": false,
            // "logChannels": [],
            // "doRoleOpt": false,
            // "optRoles": [],

            // "roleAnnounceBlacklist": [],
            // "requestBlacklisted": [],
            // "usersBlacklisted": [],
            
            // "robloxEnabled": false,
            // "protectees": [],
            // "robloxGroup": [],
            // "opted": []
        }], 
        'Creating guild table . . .'
    ],
    main_settings: [
        {
            "running": true,
            "prefix": "-",
            "botname": "Test Bot",
            "maincolor": [0, 0, 0],
            "owners": [175390734608891905],
            "devs": [175390734608891905],
            "robloxEnabled": false,
        }
    ],
}