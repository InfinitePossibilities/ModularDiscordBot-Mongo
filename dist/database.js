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
        function templateSchema(collection, schema) {
            const _schema = schema ? new mongoose_1.Schema(schema, { collection: collection }) : new mongoose_1.Schema({}, { collection: collection });
            return _schema;
        }
        template.templateSchema = templateSchema;
        function templateModel(_collection, _schema, _clearModels) {
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
                ownerroles: { type: [Number], default: [] },
                owners: { type: [Number], default: [] },
                adminroles: { type: [Number], default: [] },
                admins: { type: [Number], default: [] },
                modroles: { type: [Number], default: [] },
                mods: { type: [Number], default: [] },
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
                owners: { type: [Number], default: [] },
                devs: { type: [Number], default: [] },
                admins: { type: [Number], default: [] },
                mods: { type: [Number], default: [] },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsdUNBQWtFO0FBU2xFLE1BQU0sRUFBRTtJQUdKLFlBQVksS0FBMEI7UUFDbEMsSUFBSSxLQUFLLEVBQUU7WUFBRyxJQUFJLENBQUMsS0FBNEIsR0FBRyxLQUFLLENBQUM7U0FBRTtJQUM5RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFjO1FBQzdCLElBQUksQ0FBQyxLQUE0QixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQXlCLEVBQUUsT0FBZ0I7UUFDekQsSUFBSSxPQUFPLEdBQVUsRUFBRSxDQUFDO1FBRXhCLElBQUksTUFBTSxJQUFJLFNBQVMsRUFBRTtZQUNyQixLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtnQkFDeEIsSUFBSSxPQUFPLEVBQUU7b0JBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFPLElBQUksQ0FBQyxLQUE0QixDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztpQkFDekY7Z0JBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFPLElBQUksQ0FBQyxLQUE0QixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ2hGO1NBQ0o7UUFDRCxJQUFJLE1BQU0sSUFBSSxTQUFTLEVBQUU7WUFDckIsSUFBSSxPQUFPLEVBQUU7Z0JBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFPLElBQUksQ0FBQyxLQUE0QixDQUFDLE9BQU8sQ0FBQyxFQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUN2RjtTQUNKO1FB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