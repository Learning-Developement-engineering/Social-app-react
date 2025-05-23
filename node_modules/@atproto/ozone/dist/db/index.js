"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_stream_1 = require("node:stream");
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const logger_1 = require("../logger");
const migrations = __importStar(require("./migrations"));
const provider_1 = require("./migrations/provider");
class Database {
    constructor(opts, instances) {
        Object.defineProperty(this, "opts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: opts
        });
        Object.defineProperty(this, "pool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "migrator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "txEvt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new node_stream_1.EventEmitter()
        });
        Object.defineProperty(this, "destroyed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isPrimary", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // if instances are provided, use those
        if (instances) {
            this.db = instances.db;
            this.pool = instances.pool;
        }
        else {
            // else create a pool & connect
            const { schema, url } = opts;
            const pool = opts.pool ??
                new pg_1.Pool({
                    connectionString: url,
                    max: opts.poolSize,
                    maxUses: opts.poolMaxUses,
                    idleTimeoutMillis: opts.poolIdleTimeoutMs,
                });
            // Select count(*) and other pg bigints as js integer
            pg_1.types.setTypeParser(pg_1.types.builtins.INT8, (n) => parseInt(n, 10));
            // Setup schema usage, primarily for test parallelism (each test suite runs in its own pg schema)
            if (schema && !/^[a-z_]+$/i.test(schema)) {
                throw new Error(`Postgres schema must only contain [A-Za-z_]: ${schema}`);
            }
            pool.on('error', onPoolError);
            pool.on('connect', (client) => {
                client.on('error', onClientError);
                // Used for trigram indexes, e.g. on actor search
                client.query('SET pg_trgm.word_similarity_threshold TO .4;');
                if (schema) {
                    // Shared objects such as extensions will go in the public schema
                    client.query(`SET search_path TO "${schema}",public;`);
                }
            });
            this.pool = pool;
            this.db = new kysely_1.Kysely({
                dialect: new kysely_1.PostgresDialect({ pool }),
            });
        }
        this.migrator = new kysely_1.Migrator({
            db: this.db,
            migrationTableSchema: opts.schema,
            provider: new provider_1.CtxMigrationProvider(migrations, 'pg'),
        });
    }
    get schema() {
        return this.opts.schema;
    }
    get isTransaction() {
        return this.db.isTransaction;
    }
    assertTransaction() {
        (0, node_assert_1.default)(this.isTransaction, 'Transaction required');
    }
    assertNotTransaction() {
        (0, node_assert_1.default)(!this.isTransaction, 'Cannot be in a transaction');
    }
    async transaction(fn) {
        const leakyTxPlugin = new LeakyTxPlugin();
        const { dbTxn, txRes } = await this.db
            .withPlugin(leakyTxPlugin)
            .transaction()
            .execute(async (txn) => {
            const dbTxn = new Database(this.opts, {
                db: txn,
                pool: this.pool,
            });
            const txRes = await fn(dbTxn)
                .catch(async (err) => {
                leakyTxPlugin.endTx();
                // ensure that all in-flight queries are flushed & the connection is open
                await dbTxn.db.getExecutor().provideConnection(noopAsync);
                throw err;
            })
                .finally(() => leakyTxPlugin.endTx());
            return { dbTxn, txRes };
        });
        dbTxn?.txEvt.emit('commit');
        return txRes;
    }
    onCommit(fn) {
        this.assertTransaction();
        this.txEvt.once('commit', fn);
    }
    async close() {
        if (this.destroyed)
            return;
        await this.db.destroy();
        this.destroyed = true;
    }
    async migrateToOrThrow(migration) {
        if (this.schema) {
            await this.db.schema.createSchema(this.schema).ifNotExists().execute();
        }
        const { error, results } = await this.migrator.migrateTo(migration);
        if (error) {
            throw error;
        }
        if (!results) {
            throw new Error('An unknown failure occurred while migrating');
        }
        return results;
    }
    async migrateToLatestOrThrow() {
        if (this.schema) {
            await this.db.schema.createSchema(this.schema).ifNotExists().execute();
        }
        const { error, results } = await this.migrator.migrateToLatest();
        if (error) {
            throw error;
        }
        if (!results) {
            throw new Error('An unknown failure occurred while migrating');
        }
        return results;
    }
}
exports.Database = Database;
exports.default = Database;
const onPoolError = (err) => logger_1.dbLogger.error({ err }, 'db pool error');
const onClientError = (err) => logger_1.dbLogger.error({ err }, 'db client error');
// utils
// -------
class LeakyTxPlugin {
    constructor() {
        Object.defineProperty(this, "txOver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    endTx() {
        this.txOver = true;
    }
    transformQuery(args) {
        if (this.txOver) {
            throw new Error('tx already failed');
        }
        return args.node;
    }
    async transformResult(args) {
        return args.result;
    }
}
const noopAsync = async () => { };
//# sourceMappingURL=index.js.map