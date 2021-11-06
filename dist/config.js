"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableDefaults = exports.commandOverrides = exports.EventType = exports.CommandType = exports.config = void 0;
exports.config = {
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
};
var CommandType;
(function (CommandType) {
    CommandType["GENERAL"] = "GENERAL";
    CommandType["UTILITY"] = "UTILITY";
    CommandType["DEVELOPER"] = "DEVELOPER";
})(CommandType = exports.CommandType || (exports.CommandType = {}));
var EventType;
(function (EventType) {
    EventType["CORE"] = "CORE";
    EventType["GENERAL"] = "GENERAL";
})(EventType = exports.EventType || (exports.EventType = {}));
exports.commandOverrides = [
    "keep",
    "override"
];
exports.tableDefaults = {
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHYSxRQUFBLE1BQU0sR0FBRztJQUNsQix1QkFBdUI7SUFDdkIsTUFBTSxFQUFFLFdBQVc7SUFDbkIsVUFBVSxFQUFFLFNBQVM7SUFDckIsTUFBTSxFQUFFLEtBQUs7SUFFYixZQUFZO0lBQ1osVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUztJQUVqQyx3QkFBd0I7SUFDeEIsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVztJQUNyQyxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO0lBQ3JDLGNBQWMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWE7SUFFekMsNkJBQTZCO0lBQzdCLDBCQUEwQixFQUFFO1FBQ3hCLFNBQVM7UUFDVCxRQUFRO1FBQ1IsU0FBUztRQUNULFdBQVc7UUFFWCxZQUFZO1FBQ1osVUFBVTtRQUVWLGdCQUFnQjtRQUNoQixrQkFBa0I7UUFDbEIsY0FBYztRQUNkLGFBQWE7UUFDYixXQUFXO1FBQ1gsVUFBVTtRQUVWLHVCQUF1QjtRQUN2Qix3QkFBd0I7UUFDeEIsa0JBQWtCO1FBQ2xCLGVBQWU7UUFDZixZQUFZO1FBQ1osYUFBYTtLQUNoQjtJQUVELDhCQUE4QjtJQUM5QiwyQkFBMkIsRUFBRTtRQUN6QixTQUFTO1FBQ1QsUUFBUTtRQUNSLFFBQVE7UUFDUixNQUFNO1FBQ04sV0FBVztRQUNYLGVBQWU7UUFDZixrQkFBa0I7UUFDbEIsZUFBZTtRQUNmLGNBQWM7UUFDZCxXQUFXO0tBQ2Q7Q0FDSixDQUFBO0FBRUQsSUFBWSxXQUlYO0FBSkQsV0FBWSxXQUFXO0lBQ25CLGtDQUFtQixDQUFBO0lBQ25CLGtDQUFtQixDQUFBO0lBQ25CLHNDQUF1QixDQUFBO0FBQzNCLENBQUMsRUFKVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUl0QjtBQUVELElBQVksU0FHWDtBQUhELFdBQVksU0FBUztJQUNqQiwwQkFBYSxDQUFBO0lBQ2IsZ0NBQW1CLENBQUE7QUFDdkIsQ0FBQyxFQUhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBR3BCO0FBRVksUUFBQSxnQkFBZ0IsR0FBRztJQUM1QixNQUFNO0lBQ04sVUFBVTtDQUNiLENBQUM7QUFFVyxRQUFBLGFBQWEsR0FBdUI7SUFDN0MsY0FBYyxFQUFFO1FBQ1osQ0FBQztnQkFDRyxTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsR0FBRztnQkFDYixTQUFTLEVBQUUsVUFBVTtnQkFFckIsdUJBQXVCO2dCQUN2QixtQkFBbUI7Z0JBRW5CLDJCQUEyQjtnQkFDM0IsMEJBQTBCO2dCQUMxQix5QkFBeUI7Z0JBQ3pCLHFCQUFxQjtnQkFDckIsc0JBQXNCO2dCQUN0QixrQkFBa0I7Z0JBRWxCLCtCQUErQjtnQkFDL0IsNEJBQTRCO2dCQUM1QiwwQkFBMEI7Z0JBRTFCLDBCQUEwQjtnQkFDMUIsb0JBQW9CO2dCQUNwQixxQkFBcUI7Z0JBQ3JCLGNBQWM7YUFDakIsQ0FBQztRQUNGLDRCQUE0QjtLQUMvQjtJQUNELGFBQWEsRUFBRTtRQUNYO1lBQ0ksU0FBUyxFQUFFLElBQUk7WUFDZixRQUFRLEVBQUUsR0FBRztZQUNiLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxDQUFDLGtCQUFrQixDQUFDO1lBQzlCLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDO1lBQzVCLGVBQWUsRUFBRSxLQUFLO1NBQ3pCO0tBQ0o7Q0FDSixDQUFBIn0=