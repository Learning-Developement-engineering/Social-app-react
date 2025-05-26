"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authWithApiKey = exports.isBsyncError = exports.Code = exports.createBsyncClient = void 0;
const connect_1 = require("@connectrpc/connect");
Object.defineProperty(exports, "Code", { enumerable: true, get: function () { return connect_1.Code; } });
const connect_node_1 = require("@connectrpc/connect-node");
const bsync_connect_1 = require("./proto/bsync_connect");
const createBsyncClient = (opts) => {
    const transport = (0, connect_node_1.createConnectTransport)(opts);
    return (0, connect_1.createPromiseClient)(bsync_connect_1.Service, transport);
};
exports.createBsyncClient = createBsyncClient;
const isBsyncError = (err, code) => {
    if (err instanceof connect_1.ConnectError) {
        return !code || err.code === code;
    }
    return false;
};
exports.isBsyncError = isBsyncError;
const authWithApiKey = (apiKey) => (next) => (req) => {
    req.header.set('authorization', `Bearer ${apiKey}`);
    return next(req);
};
exports.authWithApiKey = authWithApiKey;
//# sourceMappingURL=bsync.js.map