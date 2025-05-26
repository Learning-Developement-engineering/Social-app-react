"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiTokenPayloadSchema = void 0;
const jwk_1 = require("@atproto/jwk");
const oauth_store_js_1 = require("../oauth-store.js");
const sub_js_1 = require("../oidc/sub.js");
const request_uri_js_1 = require("../request/request-uri.js");
exports.apiTokenPayloadSchema = jwk_1.jwtPayloadSchema
    .extend({
    sub: sub_js_1.subSchema,
    deviceId: oauth_store_js_1.deviceIdSchema,
    // If the token is bound to a particular authorization request, it can only
    // be used in the context of that request.
    requestUri: request_uri_js_1.requestUriSchema.optional(),
})
    .passthrough();
//# sourceMappingURL=api-token-payload.js.map