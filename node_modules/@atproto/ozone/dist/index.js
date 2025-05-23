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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OzoneService = exports.httpLogger = exports.AppContext = exports.OzoneDaemon = exports.EventReverser = exports.EventPusher = exports.Database = void 0;
const node_events_1 = __importDefault(require("node:events"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_terminator_1 = require("http-terminator");
const common_1 = require("@atproto/common");
const api_1 = __importStar(require("./api"));
const context_1 = require("./context");
const error = __importStar(require("./error"));
const lexicon_1 = require("./lexicon");
const logger_1 = require("./logger");
__exportStar(require("./config"), exports);
var db_1 = require("./db");
Object.defineProperty(exports, "Database", { enumerable: true, get: function () { return db_1.Database; } });
var daemon_1 = require("./daemon");
Object.defineProperty(exports, "EventPusher", { enumerable: true, get: function () { return daemon_1.EventPusher; } });
Object.defineProperty(exports, "EventReverser", { enumerable: true, get: function () { return daemon_1.EventReverser; } });
Object.defineProperty(exports, "OzoneDaemon", { enumerable: true, get: function () { return daemon_1.OzoneDaemon; } });
var context_2 = require("./context");
Object.defineProperty(exports, "AppContext", { enumerable: true, get: function () { return context_2.AppContext; } });
var logger_2 = require("./logger");
Object.defineProperty(exports, "httpLogger", { enumerable: true, get: function () { return logger_2.httpLogger; } });
class OzoneService {
    constructor(opts) {
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "server", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "terminator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dbStatsInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.ctx = opts.ctx;
        this.app = opts.app;
    }
    static async create(cfg, secrets, overrides) {
        const app = (0, express_1.default)();
        app.set('trust proxy', true);
        app.use((0, cors_1.default)({ maxAge: common_1.DAY / common_1.SECOND }));
        app.use(logger_1.loggerMiddleware);
        app.use((0, compression_1.default)());
        const ctx = await context_1.AppContext.fromConfig(cfg, secrets, overrides);
        let server = (0, lexicon_1.createServer)({
            validateResponse: false,
            payload: {
                jsonLimit: 100 * 1024, // 100kb
                textLimit: 100 * 1024, // 100kb
                blobLimit: 5 * 1024 * 1024, // 5mb
            },
        });
        server = (0, api_1.default)(server, ctx);
        app.use(api_1.health.createRouter(ctx));
        app.use(api_1.wellKnown.createRouter(ctx));
        app.use(server.xrpc.router);
        app.use(error.handler);
        return new OzoneService({ ctx, app });
    }
    async seedInitialMembers() {
        const members = [];
        this.ctx.cfg.access.admins.forEach((did) => members.push({
            role: 'tools.ozone.team.defs#roleAdmin',
            did,
        }));
        this.ctx.cfg.access.triage.forEach((did) => members.push({
            role: 'tools.ozone.team.defs#roleTriage',
            did,
        }));
        this.ctx.cfg.access.moderators.forEach((did) => members.push({
            role: 'tools.ozone.team.defs#roleModerator',
            did,
        }));
        for (const member of members) {
            const service = this.ctx.teamService(this.ctx.db);
            await service.upsert({
                ...member,
                lastUpdatedBy: this.ctx.cfg.service.did,
            });
        }
    }
    async start() {
        if (this.dbStatsInterval) {
            throw new Error(`${this.constructor.name} already started`);
        }
        // Any moderator that are configured via env var may not exist in the database
        // so we need to sync them from env var to the database
        await this.seedInitialMembers();
        const { db, backgroundQueue } = this.ctx;
        this.dbStatsInterval = setInterval(() => {
            logger_1.dbLogger.info({
                idleCount: db.pool.idleCount,
                totalCount: db.pool.totalCount,
                waitingCount: db.pool.waitingCount,
            }, 'db pool stats');
            logger_1.dbLogger.info(backgroundQueue.getStats(), 'background queue stats');
        }, 10000);
        await this.ctx.sequencer.start();
        const server = this.app.listen(this.ctx.cfg.service.port);
        this.server = server;
        server.keepAliveTimeout = 90000;
        this.terminator = (0, http_terminator_1.createHttpTerminator)({ server });
        await node_events_1.default.once(server, 'listening');
        const { port } = server.address();
        this.ctx.assignPort(port);
        return server;
    }
    async destroy() {
        await this.terminator?.terminate();
        await this.ctx.backgroundQueue.destroy();
        await this.ctx.sequencer.destroy();
        await this.ctx.db.close();
        clearInterval(this.dbStatsInterval);
        this.dbStatsInterval = undefined;
    }
}
exports.OzoneService = OzoneService;
exports.default = OzoneService;
//# sourceMappingURL=index.js.map