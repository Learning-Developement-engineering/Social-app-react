"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const xrpc_server_1 = require("@atproto/xrpc-server");
class SettingService {
    constructor(db) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
    }
    static creator() {
        return (db) => new SettingService(db);
    }
    async query({ limit = 100, scope, did, cursor, prefix, keys, }) {
        let builder = this.db.db.selectFrom('setting').selectAll();
        if (prefix) {
            builder = builder.where('key', 'like', `${prefix}%`);
        }
        else if (keys?.length) {
            builder = builder.where('key', 'in', keys);
        }
        if (scope) {
            builder = builder.where('scope', '=', scope);
        }
        if (did) {
            builder = builder.where('did', '=', did);
        }
        if (cursor) {
            const cursorId = parseInt(cursor, 10);
            if (isNaN(cursorId)) {
                throw new xrpc_server_1.InvalidRequestError('invalid cursor');
            }
            builder = builder.where('id', '<', cursorId);
        }
        const options = await builder.orderBy('id', 'desc').limit(limit).execute();
        return {
            options,
            cursor: options[options.length - 1]?.id.toString(),
        };
    }
    async upsert(option) {
        await this.db.db
            .insertInto('setting')
            .values(option)
            .onConflict((oc) => {
            return oc.columns(['key', 'scope', 'did']).doUpdateSet({
                value: option.value,
                updatedAt: option.updatedAt,
                description: option.description,
                managerRole: option.managerRole,
                lastUpdatedBy: option.lastUpdatedBy,
            });
        })
            .execute();
    }
    async removeOptions(keys, filters) {
        if (!keys.length)
            return;
        if (filters.scope === 'personal') {
            (0, node_assert_1.default)(filters.did, 'did is required for personal scope');
        }
        let qb = this.db.db
            .deleteFrom('setting')
            .where('key', 'in', keys)
            .where('scope', '=', filters.scope);
        if (filters.managerRole.length) {
            qb = qb.where('managerRole', 'in', filters.managerRole);
        }
        else {
            qb = qb.where('managerRole', 'is', null);
        }
        if (filters.did) {
            qb = qb.where('did', '=', filters.did);
        }
        await qb.execute();
    }
    view(setting) {
        const { key, value, did, description, createdAt, createdBy, updatedAt, lastUpdatedBy, managerRole, scope, } = setting;
        return {
            key,
            value,
            did,
            scope,
            createdBy,
            lastUpdatedBy,
            managerRole: managerRole || undefined,
            description: description || undefined,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
        };
    }
}
exports.SettingService = SettingService;
//# sourceMappingURL=service.js.map