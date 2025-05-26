"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authWithApiKey = void 0;
const connect_1 = require("@connectrpc/connect");
const BEARER = 'Bearer ';
const authWithApiKey = (ctx, handlerCtx) => {
    const authorization = handlerCtx.requestHeader.get('authorization');
    if (!authorization?.startsWith(BEARER)) {
        throw new connect_1.ConnectError('missing auth', connect_1.Code.Unauthenticated);
    }
    const key = authorization.slice(BEARER.length);
    if (!ctx.cfg.auth.apiKeys.has(key)) {
        throw new connect_1.ConnectError('invalid api key', connect_1.Code.Unauthenticated);
    }
};
exports.authWithApiKey = authWithApiKey;
//# sourceMappingURL=auth.js.map