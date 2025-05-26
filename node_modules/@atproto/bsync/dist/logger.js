"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = exports.httpLogger = exports.dbLogger = void 0;
const pino_http_1 = require("pino-http");
const common_1 = require("@atproto/common");
exports.dbLogger = (0, common_1.subsystemLogger)('bsync:db');
exports.httpLogger = (0, common_1.subsystemLogger)('bsync');
exports.loggerMiddleware = (0, pino_http_1.pinoHttp)({
    logger: exports.httpLogger,
    redact: {
        paths: ['req.headers.authorization'],
    },
    serializers: {
        err: (err) => ({
            code: err?.['code'],
            message: err?.['message'],
        }),
        req: (req) => {
            const serialized = pino_http_1.stdSerializers.req(req);
            const headers = (0, common_1.obfuscateHeaders)(serialized.headers);
            return { ...serialized, headers };
        },
    },
});
//# sourceMappingURL=logger.js.map