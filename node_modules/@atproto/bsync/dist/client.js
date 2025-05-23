"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authWithApiKey = exports.createClient = void 0;
const connect_1 = require("@connectrpc/connect");
const connect_node_1 = require("@connectrpc/connect-node");
const bsync_connect_1 = require("./proto/bsync_connect");
const createClient = (opts) => {
    const transport = (0, connect_node_1.createConnectTransport)(opts);
    return (0, connect_1.createPromiseClient)(bsync_connect_1.Service, transport);
};
exports.createClient = createClient;
const authWithApiKey = (apiKey) => (next) => (req) => {
    req.header.set('authorization', `Bearer ${apiKey}`);
    return next(req);
};
exports.authWithApiKey = authWithApiKey;
//# sourceMappingURL=client.js.map