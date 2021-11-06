"use strict";
// import * as Discord from "discord.js";
// import { GuildSettings, MainSettings } from "./database";
// export class GlobalAuth {
//     private _user: Discord.User;
//     constructor (user: Discord.User) {
//         this._user = user;
//     }
//     /**
//      * Returns true if a players ID matches that of the developer's IDs.
//      * @param table
//      * @param user 
//      */
//     isDev = async () => {
//         var _devIDs = String(await new MainSettings().readSetting(`devs`)).split(`,`);
//         if (await _devIDs.indexOf(this._user.id) > -1) return true;
//         else return false; 
//     }
//     /**
//      * Returns true if a user has an admin role.
//      * @param table
//      * @param user 
//      */
//     isGlobalAdmin = async () => {
//         var _adminIDs = String(await new MainSettings().readSetting('admins')).split(`,`);
//         if (await _adminIDs.indexOf(this._user.id) > -1) return true;
//         else return false;
//     }
//     /**
//      * Returns true if user has a mod role.
//      * @param table
//      * @param user 
//      */
//     isGlobalMod = async () => {
//         var _modIDs = String(await new MainSettings().readSetting('mods')).split(`,`);
//         if (await _modIDs.indexOf(this._user.id) > -1) return true;
//         else return false;
//     }
//     /**
//      * Returns true if user is Dev/SuperAdmin/Admin/Mod
//      * @param table
//      * @param user 
//      */
//     isGlobalEmpowered = async () => {
//         if (await this.isDev() || await this.isGlobalAdmin() || await this.isGlobalMod()) return true;
//         else return false;
//     }
// }
// export class LocalAuth {
//     private _guild: Discord.Guild;
//     private _user: Discord.User;
//     private _role?: Discord.Role;
//     constructor(guild: Discord.Guild, user: Discord.User, role?: Discord.Role) {
//         this._guild = guild;
//         this._user = user;
//         this._role = role;
//     }
//     /**
//      * Returns true if a players ID matches that of the developer's IDs.
//      * @param table
//      * @param user 
//      */
//     isDev = async () => {
//         var _devIDs = String(await new MainSettings().readSetting(`devs`)).split(`,`);
//         if (await _devIDs.indexOf(this._user.id) > -1) return true;
//         else return false; 
//     }
//     /**
//      * Returns true if a user is the Guild Owner
//      * @param guild
//      * @param user
//      */
//     isGuildOwner = () => {
//         var ret = false;
//         if (this._guild.ownerID == this._user.id) { ret = false; };
//         return ret;
//     }
//     /**
//      * Returns true if a user has a local owner role.
//      * @param table
//      * @param user 
//      */
//     isLocalOwner = async () => {
//         var _ownerRoles = String(await new GuildSettings(this._guild).readSetting(`ownerroles`)).split(`,`);
//         var _owners = String(await new GuildSettings(this._guild).readSetting(`owners`)).split(`,`);
//         // check if player's ID is in the list
//         var ret = false;
//         this._guild.member(this._user)?.roles.cache.forEach(r => { if (_ownerRoles.includes(r.id)) ret = true; });
//         if (_owners.includes(this._user.id)) { ret = true; };
//         return ret;
//     }
//     /**
//      * Returns true if a user has a local admin role.
//      * @param table
//      * @param user 
//      */
//     isLocalAdmin = async () => {
//         var _adminRoles = String(await new GuildSettings(this._guild).readSetting(`adminroles`)).split(`,`);
//         var _admins = String(await new GuildSettings(this._guild).readSetting(`admins`)).split(`,`);
//         // check if player's ID is in the list
//         var ret = false;
//         this._guild.member(this._user)?.roles.cache.forEach(r => { if (_adminRoles.includes(r.id)) ret = true; });
//         if (_admins.includes(this._user.id)) { ret = true; };
//         return ret;
//     }
//     /**
//      * Returns true if user has a local mod role.
//      * @param table
//      * @param user 
//      */
//     isLocalMod = async () => {
//         var _modRoles = String(await new GuildSettings(this._guild).readSetting(`modroleroles`)).split(`,`);
//         var _mods = String(await new GuildSettings(this._guild).readSetting(`mods`)).split(`,`);
//         var ret = false;
//         this._guild.member(this._user)?.roles.cache.forEach(r => { if (_modRoles.includes(r.id)) ret = true; });
//         if (_mods.includes(this._user.id)) { ret = true; };
//         return ret;
//     }
//     /**
//      * Returns true if user is Point Mod
//      * @param table
//      * @param user
//      */
//     isPointMod = async () => {
//         var _pointModRoles = String(await new GuildSettings(this._guild).readSetting(`pointmodroles`)).split(`,`);
//         var _pointmods = String(await new GuildSettings(this._guild).readSetting(`pointmods`)).split(`,`);
//         var ret = false;
//         this._guild.member(this._user)?.roles.cache.forEach(r => { if (_pointModRoles.includes(r.id)) ret = true; });
//         if (_pointmods.includes(this._user.id)) { ret = true; };
//         return ret;
//     }
//     /**
//      * Returns true if user is Dev/SuperAdmin/Admin/Mod
//      * @param table
//      * @param user 
//      */
//     isLocalEmpowered = async () => {
//         if (this.isGuildOwner() || await this.isDev() || await this.isLocalOwner() || await this.isLocalAdmin() || await this.isLocalMod()) return true;
//         else return false;
//     }
//     /**
//      * Returns true if user is Opted In.
//      * @param table
//      * @param user 
//      */
//     isOptedIn = async () => {
//         var _optedUsers = String(await new GuildSettings(this._guild).readSetting(`opted`)).split(`,`);
//         var ret = false;
//         // guild.member(user).roles.forEach(r => { if (_optedUsers.includes(r.id)) ret = true; });
//         if (_optedUsers.indexOf(this._user.id) != -1) { ret = true }
//         return ret;
//     }
//     /**
//      * Returns true if user is Opted In.
//      * @param table
//      * @param user 
//      */
//     isLocalProtectee = async () => {
//         var _protecteeRoles = String(await new GuildSettings(this._guild).readSetting(`protecteeroles`)).split(`,`);
//         var ret = false;
//         this._guild.member(this._user)?.roles.cache.forEach(r => { if (_protecteeRoles.includes(r.id)) ret = true; });
//         return ret;
//     }
//     /**
//      * Returns true if a user is locally Request Blacklisted.
//      * @param table
//      * @param user 
//      * @param guild 
//      */
//     isLocalRequestBlacklisted = async () => {
//         var _requestBlacklistUsers = String(await new GuildSettings(this._guild).readSetting(`requestBlacklisted`)).split(`,`);
//         if (await _requestBlacklistUsers.indexOf(this._user.id) > -1) return true;
//         else return false;
//     }
//     /**
//      * Returns true if a user ID is blacklisted.
//      * @param table
//      * @param user 
//      */
//     isLocalBlacklisted = async () => {
//         // Check if player's ID is revoked in the list
//         var ret = false;
//         if (String(await new GuildSettings(this._guild).readSetting('usersblacklisted')).includes(this._user.id)) { ret = true; };
//         return ret;
//     }
//     /**
//      * Returns true if a user has a blacklisted role.
//      * @param table
//      * @param user 
//      */
//     isAnnounceBlacklisted = async () => {
//         var _blacklistedAnnounceRoles = String(await new GuildSettings(this._guild).readSetting(`roleannounceblacklist`)).split(`,`);
//         // Check if player's ID is revoked in the list
//         var ret = false;
//         this._guild.member(this._user)?.roles.cache.forEach(r => { if (_blacklistedAnnounceRoles.includes(r.id)) ret = true; });
//         return ret;
//     }
//     /**
//      * Returns true if a user has revoked permissions.
//      * @param table
//      * @param user 
//      */
//     isPermissionRevoked = async () => {
//         var _revokedUsers = String(await new GuildSettings(this._guild).readSetting(`usersblacklisted`)).split(`,`);
//         // Check if player's ID is revoked in the list
//         if (_revokedUsers.indexOf(this._user.id) > -1) return true; 
//         else return false;
//     }
//     /**
//      * Returns true if a user has a local role.
//      * @param discord 
//      * @param user 
//      * @param role 
//      */
//     hasLocalRole = () => {
//         var ret = false;
//         this._guild.member(this._user)?.roles.cache.forEach(r => { if (r.id === (this._role as Discord.Role).id) ret = true; })
//         return ret;
//     }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5Q0FBeUM7QUFDekMsNERBQTREO0FBRTVELDRCQUE0QjtBQUM1QixtQ0FBbUM7QUFFbkMseUNBQXlDO0FBQ3pDLDZCQUE2QjtBQUM3QixRQUFRO0FBRVIsVUFBVTtBQUNWLDJFQUEyRTtBQUMzRSxzQkFBc0I7QUFDdEIsc0JBQXNCO0FBQ3RCLFVBQVU7QUFDViw0QkFBNEI7QUFDNUIseUZBQXlGO0FBRXpGLHNFQUFzRTtBQUN0RSw4QkFBOEI7QUFDOUIsUUFBUTtBQUVSLFVBQVU7QUFDVixtREFBbUQ7QUFDbkQsc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUN0QixVQUFVO0FBQ1Ysb0NBQW9DO0FBQ3BDLDZGQUE2RjtBQUU3Rix3RUFBd0U7QUFDeEUsNkJBQTZCO0FBQzdCLFFBQVE7QUFFUixVQUFVO0FBQ1YsOENBQThDO0FBQzlDLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsVUFBVTtBQUNWLGtDQUFrQztBQUNsQyx5RkFBeUY7QUFFekYsc0VBQXNFO0FBQ3RFLDZCQUE2QjtBQUM3QixRQUFRO0FBRVIsVUFBVTtBQUNWLDBEQUEwRDtBQUMxRCxzQkFBc0I7QUFDdEIsc0JBQXNCO0FBQ3RCLFVBQVU7QUFDVix3Q0FBd0M7QUFDeEMseUdBQXlHO0FBQ3pHLDZCQUE2QjtBQUM3QixRQUFRO0FBQ1IsSUFBSTtBQUVKLDJCQUEyQjtBQUMzQixxQ0FBcUM7QUFDckMsbUNBQW1DO0FBQ25DLG9DQUFvQztBQUVwQyxtRkFBbUY7QUFDbkYsK0JBQStCO0FBQy9CLDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsUUFBUTtBQUVSLFVBQVU7QUFDViwyRUFBMkU7QUFDM0Usc0JBQXNCO0FBQ3RCLHNCQUFzQjtBQUN0QixVQUFVO0FBQ1YsNEJBQTRCO0FBQzVCLHlGQUF5RjtBQUV6RixzRUFBc0U7QUFDdEUsOEJBQThCO0FBQzlCLFFB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