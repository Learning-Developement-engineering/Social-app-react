"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = void 0;
const express_1 = require("express");
const kysely_1 = require("kysely");
const createRouter = (ctx) => {
    const router = (0, express_1.Router)();
    router.get('/robots.txt', function (req, res) {
        res.type('text/plain');
        res.send('# Hello Friends!\n\n# Crawling the public parts of the API is allowed. HTTP 429 ("backoff") status codes are used for rate-limiting. Up to a handful concurrent requests should be ok.\nUser-agent: *\nAllow: /');
    });
    router.get('/xrpc/_health', async function (req, res) {
        const { version } = ctx.cfg.service;
        try {
            await (0, kysely_1.sql) `select 1`.execute(ctx.db.db);
        }
        catch (err) {
            req.log.error({ err }, 'failed health check');
            return res.status(503).send({ version, error: 'Service Unavailable' });
        }
        res.send({ version });
    });
    return router;
};
exports.createRouter = createRouter;
//# sourceMappingURL=health.js.map