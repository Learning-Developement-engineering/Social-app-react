"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntrospectServer = void 0;
const node_events_1 = __importDefault(require("node:events"));
const express_1 = __importDefault(require("express"));
class IntrospectServer {
    constructor(port, server) {
        Object.defineProperty(this, "port", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: port
        });
        Object.defineProperty(this, "server", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: server
        });
    }
    static async start(port, plc, pds, bsky, ozone) {
        const app = (0, express_1.default)();
        app.get('/', (_req, res) => {
            res.status(200).send({
                plc: {
                    url: plc.url,
                },
                pds: {
                    url: pds.url,
                    did: pds.ctx.cfg.service.did,
                },
                bsky: {
                    url: bsky.url,
                    did: bsky.ctx.cfg.serverDid,
                },
                ozone: {
                    url: ozone.url,
                    did: ozone.ctx.cfg.service.did,
                },
                db: {
                    url: ozone.ctx.cfg.db.postgresUrl,
                },
            });
        });
        const server = app.listen(port);
        await node_events_1.default.once(server, 'listening');
        return new IntrospectServer(port, server);
    }
    async close() {
        this.server.close();
        await node_events_1.default.once(this.server, 'close');
    }
}
exports.IntrospectServer = IntrospectServer;
//# sourceMappingURL=introspect.js.map