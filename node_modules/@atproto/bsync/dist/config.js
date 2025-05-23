"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readEnv = exports.envToCfg = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const common_1 = require("@atproto/common");
const envToCfg = (env) => {
    const serviceCfg = {
        port: env.port ?? 2585,
        version: env.version ?? 'unknown',
        longPollTimeoutMs: env.longPollTimeoutMs ?? 10000,
    };
    (0, node_assert_1.default)(env.dbUrl, 'missing postgres url');
    const dbCfg = {
        url: env.dbUrl,
        schema: env.dbSchema,
        poolSize: env.dbPoolSize,
        poolMaxUses: env.dbPoolMaxUses,
        poolIdleTimeoutMs: env.dbPoolIdleTimeoutMs,
        migrate: env.dbMigrate,
    };
    (0, node_assert_1.default)(env.apiKeys.length > 0, 'missing api keys');
    const authCfg = {
        apiKeys: new Set(env.apiKeys),
    };
    return {
        service: serviceCfg,
        db: dbCfg,
        auth: authCfg,
    };
};
exports.envToCfg = envToCfg;
const readEnv = () => {
    return {
        // service
        port: (0, common_1.envInt)('BSYNC_PORT'),
        version: (0, common_1.envStr)('BSYNC_VERSION'),
        longPollTimeoutMs: (0, common_1.envInt)('BSYNC_LONG_POLL_TIMEOUT_MS'),
        // database
        dbUrl: (0, common_1.envStr)('BSYNC_DB_POSTGRES_URL'),
        dbSchema: (0, common_1.envStr)('BSYNC_DB_POSTGRES_SCHEMA'),
        dbPoolSize: (0, common_1.envInt)('BSYNC_DB_POOL_SIZE'),
        dbPoolMaxUses: (0, common_1.envInt)('BSYNC_DB_POOL_MAX_USES'),
        dbPoolIdleTimeoutMs: (0, common_1.envInt)('BSYNC_DB_POOL_IDLE_TIMEOUT_MS'),
        dbMigrate: (0, common_1.envBool)('BSYNC_DB_MIGRATE'),
        // secrets
        apiKeys: (0, common_1.envList)('BSYNC_API_KEYS'),
    };
};
exports.readEnv = readEnv;
//# sourceMappingURL=config.js.map