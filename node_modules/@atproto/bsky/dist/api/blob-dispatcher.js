"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlobDispatcher = createBlobDispatcher;
const undici_1 = require("undici");
const fetch_node_1 = require("@atproto-labs/fetch-node");
const retry_1 = require("../util/retry");
function createBlobDispatcher(cfg) {
    const baseDispatcher = new undici_1.Agent({
        allowH2: cfg.proxyAllowHTTP2, // This is experimental
        headersTimeout: cfg.proxyHeadersTimeout,
        maxResponseSize: cfg.proxyMaxResponseSize,
        bodyTimeout: cfg.proxyBodyTimeout,
        factory: cfg.disableSsrfProtection
            ? undefined
            : (origin, opts) => {
                const { protocol, hostname } = origin instanceof URL ? origin : new URL(origin);
                if (protocol !== 'https:') {
                    throw new Error(`Forbidden protocol "${protocol}"`);
                }
                if ((0, fetch_node_1.isUnicastIp)(hostname) === false) {
                    throw new Error('Hostname resolved to non-unicast address');
                }
                return new undici_1.Pool(origin, opts);
            },
        connect: {
            lookup: cfg.disableSsrfProtection ? undefined : fetch_node_1.unicastLookup,
        },
    });
    return cfg.proxyMaxRetries > 0
        ? new undici_1.RetryAgent(baseDispatcher, {
            statusCodes: [...retry_1.RETRYABLE_HTTP_STATUS_CODES],
            methods: ['GET', 'HEAD'],
            maxRetries: cfg.proxyMaxRetries,
        })
        : baseDispatcher;
}
//# sourceMappingURL=blob-dispatcher.js.map