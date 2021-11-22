"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.db = void 0;
const mongoose_1 = require("mongoose");
class db {
    constructor(model) {
        if (model) {
            this.model = model;
        }
    }
    /**
     * Add records to database collection
     * @param records Array of records
     */
    async createRecords(records) {
        this.model.insertMany(records);
    }
    async createCollection() {
        this.model.createCollection();
    }
    /**
     * Read records from database collection
     * @param querys Record array of JSON search objects
     * @param options Optional properties to return
     * @returns Records, if any
     */
    async readRecords(querys, options) {
        var returns = [];
        if (querys != undefined) {
            for (const query of querys) {
                if (options) {
                    returns.push(await this.model.findOne(query, options).exec());
                }
                returns.push(await this.model.findOne(query).exec());
            }
        }
        if (querys == undefined) {
            if (options) {
                returns.push(await this.model.findOne({}, options).exec());
            }
        }
        return returns;
    }
    /**
     * Replace entire Records in database collection
     * @param querys Record array of JSON search objects
     * @param newValue New Records to replace found querys, if any
     */
    async replaceRecords(querys, newValue) {
        for (const query of querys) {
            await this.model.findOneAndReplace(query, newValue).exec();
        }
    }
    /**
     * Update fields of Records in database collection
     * @param querys Record array of JSON search objects
     * @param newRecord New values to replace in found queried records, if any
     */
    async updateRecords(querys, newRecord) {
        for (const query of querys) {
            await this.model.findOneAndUpdate(query, newRecord, { useFindAndModify: false }).exec();
        }
    }
    /**
     * Delete records from database collection
     * @param querys Record array of JSON search objects
     */
    async deleteRecords(querys) {
        for (const query of querys) {
            await this.model.findOneAndDelete(query).exec();
        }
    }
}
exports.db = db;
var schemas;
(function (schemas) {
    let template;
    (function (template) {
        function templateSchema(_collection, _schema) {
            const _templateSchema = _schema ? new mongoose_1.Schema(_schema, { collection: _collection }) : new mongoose_1.Schema({}, { collection: _collection });
            return _templateSchema;
        }
        template.templateSchema = templateSchema;
        function templateModel(_collection, _clearModels, _schema) {
            const _model = _schema ? mongoose_1.model(_collection, templateSchema(_collection, _schema)) : mongoose_1.model(_collection, templateSchema(_collection));
            if (_clearModels)
                for (let model in mongoose_1.models)
                    if (mongoose_1.models[model] == _model) {
                        delete mongoose_1.models[model];
                    }
            ;
            return _model;
        }
        template.templateModel = templateModel;
    })(template = schemas.template || (schemas.template = {}));
    let guild;
    (function (guild_1) {
        function coreGuildSchema(guild) {
            const _schema = new mongoose_1.Schema({
                running: { type: Boolean, required: true },
                prefix: { type: String, required: true },
                botname: { type: String, required: true },
                maincolor: { type: [Number], default: [0, 0, 0] },
                ownerroles: { type: [String], default: [] },
                owners: { type: [String], default: [] },
                adminroles: { type: [String], default: [] },
                admins: { type: [String], default: [] },
                modroles: { type: [String], default: [] },
                mods: { type: [String], default: [] },
            }, { collection: guild.id + "_CoreSettings" });
            return _schema;
        }
        guild_1.coreGuildSchema = coreGuildSchema;
        function coreGuildModel(_guild, _clearModels) {
            const _model = mongoose_1.models[_guild.id] || mongoose_1.model(_guild.id, coreGuildSchema(_guild));
            if (_clearModels)
                clearModels(_model);
            return _model;
        }
        guild_1.coreGuildModel = coreGuildModel;
    })(guild = schemas.guild || (schemas.guild = {}));
    let main;
    (function (main) {
        function coreMainSchema() {
            const _schema = new mongoose_1.Schema({
                running: { type: Boolean, required: true },
                prefix: { type: String, required: true },
                botname: { type: String, required: true },
                maincolor: { type: [Number], default: [0, 0, 0] },
                owners: { type: [String], default: [] },
                devs: { type: [String], default: [] },
                admins: { type: [String], default: [] },
                mods: { type: [String], default: [] },
                disabledCommands: { type: [String], default: [] },
            }, { collection: "Main_CoreSettings" });
            return _schema;
        }
        main.coreMainSchema = coreMainSchema;
        function coreMainModel(_clearModels) {
            const _model = mongoose_1.models.Main || mongoose_1.model("Main", coreMainSchema());
            if (_clearModels)
                clearModels(_model);
            return _model;
        }
        main.coreMainModel = coreMainModel;
    })(main = schemas.main || (schemas.main = {}));
})(schemas || (schemas = {}));
exports.schemas = schemas;
let clearModels = function (_model) {
    for (let model in mongoose_1.models)
        if (mongoose_1.models[model] == _model) {
            delete mongoose_1.models[model];
        }
    ;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsdUNBQXFFO0FBUXJFLE1BQU0sRUFBRTtJQUdKLFlBQVksS0FBMEI7UUFDbEMsSUFBSSxLQUFLLEVBQUU7WUFBRyxJQUFJLENBQUMsS0FBNEIsR0FBRyxLQUFLLENBQUM7U0FBRTtJQUM5RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFjO1FBQzdCLElBQUksQ0FBQyxLQUE0QixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQjtRQUNqQixJQUFJLENBQUMsS0FBNEIsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBeUIsRUFBRSxPQUFnQjtRQUN6RCxJQUFJLE9BQU8sR0FBVSxFQUFFLENBQUM7UUFFeEIsSUFBSSxNQUFNLElBQUksU0FBUyxFQUFFO1lBQ3JCLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO2dCQUN4QixJQUFJLE9BQU8sRUFBRTtvQkFDVCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU8sSUFBSSxDQUFDLEtBQTRCLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUN6RjtnQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU8sSUFBSSxDQUFDLEtBQTRCLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7YUFDaEY7U0FDSjtRQUNELElBQUksTUFBTSxJQUFJLFNBQVMsRUFBRTtZQUNyQixJQUFJLE9BQU8sRUFBRTtnQkFDVCxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU8sSUFBSSxDQUFDLEtB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