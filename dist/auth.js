"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guild = exports.main = void 0;
const modulardiscordbot_db_1 = require("modulardiscordbot-db");
var main;
(function (main) {
    class auth {
        constructor(user) {
            this.isOwner = async () => {
                let _ownerIDs = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, "owners"))[0].owners).split(',');
                if (_ownerIDs.indexOf(this._user.id) > -1)
                    return true;
                return false;
            };
            /**
             * Returns true if a players ID matches that of the developer's IDs.
             * @param table
             * @param user
             */
            this.isDev = async () => {
                let _devIDs = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, "devs"))[0].devs).split(`,`);
                if (_devIDs.indexOf(this._user.id) > -1)
                    return true;
                return false;
            };
            /**
             * Returns true if a user has an admin role.
             * @param table
             * @param user
             */
            this.isAdmin = async () => {
                let _adminIDs = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'admins'))[0].admins).split(`,`);
                if (_adminIDs.indexOf(this._user.id) > -1)
                    return true;
                return false;
            };
            /**
             * Returns true if user has a mod role.
             * @param table
             * @param user
             */
            this.isMod = async () => {
                let _modIDs = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, 'mods'))[0].mods).split(`,`);
                if (_modIDs.indexOf(this._user.id) > -1)
                    return true;
                return false;
            };
            /**
             * Returns true if user is Dev/SuperAdmin/Admin/Mod
             * @param table
             * @param user
             */
            this.isEmpowered = async () => {
                if (await this.isDev() || await this.isAdmin() || await this.isMod())
                    return true;
                return false;
            };
            this._user = user;
        }
    }
    main.auth = auth;
})(main = exports.main || (exports.main = {}));
var guild;
(function (guild_1) {
    class auth {
        constructor(guild, user) {
            /**
             * Returns true if a players ID matches that of the developer's IDs.
             * @param table
             * @param user
             */
            this.isDev = async () => {
                let _devIDs = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.main.coreMainModel(true)).readRecords(undefined, `devs`))[0].devs).split(`,`);
                if (await _devIDs.indexOf(this._user.id) > -1)
                    return true;
                else
                    return false;
            };
            /**
             * Returns true if a user is the Guild Owner
             * @param guild
             * @param user
             */
            this.isGuildOwner = () => {
                let ret = false;
                if (this._guild.ownerId == this._user.id) {
                    ret = true;
                }
                ;
                return ret;
            };
            /**
             * Returns true if a user has a local owner role.
             * @param table
             * @param user
             */
            this.isOwner = async () => {
                let _ownerRoles = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `ownerroles`))[0].ownerroles).split(`,`);
                let _owners = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `owners`))[0].owners).split(`,`);
                // check if player's ID is in the list
                let ret = false;
                this._guild.members.cache.find((member) => { return member.user == this._user; })?.roles.cache.forEach(r => { if (_ownerRoles.includes(r.id))
                    ret = true; });
                if (_owners.includes(this._user.id)) {
                    ret = true;
                }
                ;
                return ret;
            };
            /**
             * Returns true if a user has a local admin role.
             * @param table
             * @param user
             */
            this.isAdmin = async () => {
                let _adminRoles = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `adminroles`))[0].adminroles).split(`,`);
                let _admins = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `admins`))[0].admins).split(`,`);
                // check if player's ID is in the list
                let ret = false;
                this._guild.members.cache.find((member) => { return member.user == this._user; })?.roles.cache.forEach(r => { if (_adminRoles.includes(r.id))
                    ret = true; });
                if (_admins.includes(this._user.id)) {
                    ret = true;
                }
                ;
                return ret;
            };
            /**
             * Returns true if user has a local mod role.
             * @param table
             * @param user
             */
            this.isMod = async () => {
                let _modRoles = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `modroles`))[0].modroles).split(`,`);
                let _mods = String((await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `mods`))[0].mods).split(`,`);
                let ret = false;
                this._guild.members.cache.find((member) => { return member.user == this._user; })?.roles.cache.forEach(r => { if (_modRoles.includes(r.id))
                    ret = true; });
                if (_mods.includes(this._user.id)) {
                    ret = true;
                }
                ;
                return ret;
            };
            /**
             * Returns true if user is Dev/SuperAdmin/Admin/Mod
             * @param table
             * @param user
             */
            this.isEmpowered = async () => {
                if (await this.isGuildOwner() || await this.isDev() || await this.isOwner() || await this.isAdmin() || await this.isMod())
                    return true;
                else
                    return false;
            };
            /**
             * Returns true if user is Opted In.
             * @param table
             * @param user
             */
            this.isProtectee = async () => {
                let _protecteeRoles = String(await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `protecteeroles`)).split(`,`);
                let ret = false;
                this._guild.members.cache.find((member) => { return member.user == this._user; })?.roles.cache.forEach(r => { if (_protecteeRoles.includes(r.id))
                    ret = true; });
                return ret;
            };
            /**
             * Returns true if a user is locally Request Blacklisted.
             * @param table
             * @param user
             * @param guild
             */
            this.isRequestBlacklisted = async () => {
                let _requestBlacklistUsers = String(await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `requestBlacklisted`)).split(`,`);
                if (await _requestBlacklistUsers.indexOf(this._user.id) > -1)
                    return true;
                else
                    return false;
            };
            /**
             * Returns true if a user ID is blacklisted.
             * @param table
             * @param user
             */
            this.isBlacklisted = async () => {
                // Check if player's ID is revoked in the list
                let ret = false;
                if (String(await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, 'usersblacklisted')).includes(this._user.id)) {
                    ret = true;
                }
                ;
                return ret;
            };
            /**
             * Returns true if a user has a blacklisted role.
             * @param table
             * @param user
             */
            this.isAnnounceBlacklisted = async () => {
                let _blacklistedAnnounceRoles = String(await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `roleannounceblacklist`)).split(`,`);
                // Check if player's ID is revoked in the list
                let ret = false;
                this._guild.members.cache.find((member) => { return member.user == this._user; })?.roles.cache.forEach(r => { if (_blacklistedAnnounceRoles.includes(r.id))
                    ret = true; });
                return ret;
            };
            /**
             * Returns true if a user has revoked permissions.
             * @param table
             * @param user
             */
            this.isPermissionRevoked = async () => {
                let _revokedUsers = String(await new modulardiscordbot_db_1.db(modulardiscordbot_db_1.schemas.guild.coreGuildModel(this._guild, true)).readRecords(undefined, `usersblacklisted`)).split(`,`);
                // Check if player's ID is revoked in the list
                if (_revokedUsers.indexOf(this._user.id) > -1)
                    return true;
                else
                    return false;
            };
            /**
             * Returns true if a user has a local role.
             * @param discord
             * @param user
             * @param role
             */
            this.hasRole = (_role) => {
                let ret = false;
                this._guild.members.cache.find((member) => { return member.user == this._user; })?.roles.cache.forEach(r => { if (r.id === _role.id)
                    ret = true; });
                return ret;
            };
            this._guild = guild;
            this._user = user;
        }
    }
    guild_1.auth = auth;
})(guild = exports.guild || (exports.guild = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLCtEQUFtRDtBQUVuRCxJQUFpQixJQUFJLENBNkRwQjtBQTdERCxXQUFpQixJQUFJO0lBQ2pCLE1BQWEsSUFBSTtRQUdiLFlBQWEsSUFBa0I7WUFJL0IsWUFBTyxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUNqQixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsQ0FBQyxNQUFNLElBQUkseUJBQUUsQ0FBQyw4QkFBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUvSCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBQ3ZELE9BQU8sS0FBSyxDQUFDO1lBQ2pCLENBQUMsQ0FBQTtZQUVEOzs7O2VBSUc7WUFDSCxVQUFLLEdBQUcsS0FBSyxJQUFJLEVBQUU7Z0JBQ2YsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsTUFBTSxJQUFJLHlCQUFFLENBQUMsOEJBQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFekgsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUFFLE9BQU8sSUFBSSxDQUFD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