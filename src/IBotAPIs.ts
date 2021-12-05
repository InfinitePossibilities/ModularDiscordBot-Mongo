// Last modified: 2021/11/24 01:33:38
import { Client, Message, Guild, ClientEvents } from "discord.js";
import { EventType, CommandType } from "./config";

export interface IBotEvent {
    info: {
        getEvent(): ClientEvents;
        getHelp(): string;
        isTest(): boolean;
        getType(): EventType;
    }
    runEvent(bot: Client, extra: any): Promise<void>;
}

export interface IBotCommand {
    info: {
        getCommand: () => string;
        getAliases: () => string[] | [];
        getDescription: () => string;
        getSyntax: () => string;
        getArguments: () => {
            arg: string,
            aliases: string[] | [],
            description: string,
            syntax: string
        }[] | [] | undefined;
        getSubcategory?: () => string;
        isTest: () => boolean;
        getType: () => CommandType;
    }
    runCommand(args: string[], msgObject: Message, bot: Client): Promise<void>;
}

export interface IBotDB {
    info: {
        _id(): string;
        isGuildDB(): boolean;
        isManual(): boolean;
    };
    queryDB(guild?: Guild): Promise<void>;
}