"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPlaneServer = exports.RepoSubscription = void 0;
const node_events_1 = __importDefault(require("node:events"));
const connect_express_1 = require("@connectrpc/connect-express");
const express_1 = __importDefault(require("express"));
const identity_1 = require("@atproto/identity");
const routes_1 = __importDefault(require("./routes"));
var subscription_1 = require("./subscription");
Object.defineProperty(exports, "RepoSubscription", { enumerable: true, get: function () { return subscription_1.RepoSubscription; } });
class DataPlaneServer {
    constructor(server, idResolver) {
        Object.defineProperty(this, "server", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: server
        });
        Object.defineProperty(this, "idResolver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: idResolver
        });
    }
    static async create(db, port, plcUrl) {
        const app = (0, express_1.default)();
        const didCache = new identity_1.MemoryCache();
        const idResolver = new identity_1.IdResolver({ plcUrl, didCache });
        const routes = (0, routes_1.default)(db, idResolver);
        app.use((0, connect_express_1.expressConnectMiddleware)({ routes }));
        const server = app.listen(port);
        await node_events_1.default.once(server, 'listening');
        return new DataPlaneServer(server, idResolver);
    }
    async destroy() {
        return new Promise((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.DataPlaneServer = DataPlaneServer;
//# sourceMappingURL=index.js.map