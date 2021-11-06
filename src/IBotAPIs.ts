import * as Discord from "discord.js";
import { EventType, CommandType } from "./config";

export interface IBotEvent {
    info: {
        event(): string;
        help(): string;
        isTest(): boolean;
        Type(): EventType;
    }
    runEvent(bot: Discord.Client, extra: any): Promise<void>;
}

export interface IBotCommand {
    info: {
        command: () => string;
        description: () => string;
        syntax: () => string;
        arguments: () => string[] | [] | undefined;
        subcategory?: () => string;
        isTest: () => boolean;
        Type: () => CommandType;
    }
    runCommand(args: string[], msgObject: Discord.Message, bot: Discord.Client): Promise<void>;
}