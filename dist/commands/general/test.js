"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
// import { setMainEmbedColor } from '../../util';
module.exports = class test {
    constructor() {
        this._command = "test";
        this._aliases = [];
        this._description = "Cool test command, yes?";
        this._syntax = "<command>";
        this._arguments = ["list"];
        this._isTest = false;
        this._Type = config_1.CommandType.GENERAL;
        this.info = {
            command: () => { return this._command; },
            aliases: () => { return this._aliases; },
            description: () => { return this._description; },
            syntax: () => { return this._syntax; },
            arguments: () => { return this._arguments; },
            isTest: () => { return this._isTest; },
            Type: () => { return this._Type; }
        };
        this.runCommand = async (args, msgObject, client) => {
            // TODO:
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5Q0FBMkM7QUFLM0Msa0RBQWtEO0FBRWxELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJO0lBQVY7UUFDSSxhQUFRLEdBQUcsTUFBTSxDQUFDO1FBQ2xCLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFDZCxpQkFBWSxHQUFHLHlCQUF5QixDQUFDO1FBQ3pDLFlBQU8sR0FBRyxXQUFXLENBQUM7UUFDdEIsZUFBVSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUNoQixVQUFLLEdBQUcsb0JBQVcsQ0FBQyxPQUFPLENBQUM7UUFFN0MsU0FBSSxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7WUFDL0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFDLENBQUM7WUFDdkMsV0FBVyxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQSxDQUFDLENBQUM7WUFDdkQsTUFBTSxFQUFFLEdBQVcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDN0MsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQSxDQUFDLENBQUM7WUFDM0MsTUFBTSxFQUFFLEdBQVksRUFBRSxHQUFHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7WUFDOUMsSUFBSSxFQUFFLEdBQWdCLEVBQUUsR0FBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUEsQ0FBQyxDQUFDO1NBQ2pELENBQUE7UUFFRCxlQUFVLEdBQUcsS0FBSyxFQUFFLElBQWMsRUFBRSxTQUEwQixFQUFFLE1BQXNCLEVBQWlCLEVBQUU7WUFDckcsUUFBUTtRQUNaLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FBQSxDQUFBIn0=