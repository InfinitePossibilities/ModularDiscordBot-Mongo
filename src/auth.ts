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