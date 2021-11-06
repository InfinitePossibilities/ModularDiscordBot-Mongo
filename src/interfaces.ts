import * as Discord from "discord.js";
import { Schema, model } from 'mongoose';

export {
    questionTemplate,
    tableQueryTemplate,
    messageEggTemplate,

    guildSettingsSchema,
    mainSettingsSchema
};

interface questionTemplate {
    type: string;
    question: string; 
    skippable: boolean; 
    answer: string;
}

interface messageEggTemplate {
    triggerMessage: string;
    responses: string[];
    timeToDelete: number;
}

interface tableQueryTemplate {
    guild_settings: (any | {}[])[]
    main_settings: any | {}[]
}

interface guildSettingsSchema {
    running: boolean, 
    prefix: string, 
    botname: string, 
    maincolor: number[], 
    ownerroles: number[] 
    owners: number[], 
    adminroles: number[], 
    admins: number[], 
    modroles: number[], 
    mods: number[], 
    // pointmodroles: number[], 
    // pointmods: number[],
    
    // doAutoAnnounce: boolean,
    // announceChannels: number[],
    // doChannelLog: boolean,
    // logChannels: number[],
    // doRoleOpt: boolean,
    // optRoles: number[],
    
    // roleAnnounceBlacklist: number[],
    // requestBlacklisted: number[],
    // usersBlacklisted: number[],
    
    // robloxEnabled: boolean,
    // protectees: number[],
    // robloxGroup: number[],
    // opted: number[]
}

interface mainSettingsSchema {
    running: boolean, 
    prefix: string, 
    devs: number[],
    admins: number[],
    mods: number[],
    maincolor: number[],
    botname: string,
    disabledCommands: string[],

    // discordGuilds: number[],
    // robloxGroups: number[],
    // robloxEnabled: boolean,
    // usersblacklisted: number[]
}