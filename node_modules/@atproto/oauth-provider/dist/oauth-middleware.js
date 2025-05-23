"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthMiddleware = oauthMiddleware;
const middleware_js_1 = require("./lib/http/middleware.js");
const assets_js_1 = require("./router/assets/assets.js");
const create_account_page_middleware_js_1 = require("./router/create-account-page-middleware.js");
const create_api_middleware_js_1 = require("./router/create-api-middleware.js");
const create_authorization_page_middleware_js_1 = require("./router/create-authorization-page-middleware.js");
const create_oauth_middleware_js_1 = require("./router/create-oauth-middleware.js");
/**
 * @returns An http request handler that can be used with node's http server
 * or as a middleware with express / connect.
 */
function oauthMiddleware(server, { ...options } = {}) {
    const { onError } = options;
    // options is shallow cloned so it's fine to mutate it
    options.onError =
        process.env['NODE_ENV'] === 'development'
            ? (req, res, err, msg) => {
                console.error(`OAuthProvider error (${msg}):`, err);
                return onError?.(req, res, err, msg);
            }
            : onError;
    return (0, middleware_js_1.asHandler)((0, middleware_js_1.combineMiddlewares)([
        assets_js_1.assetsMiddleware,
        (0, create_oauth_middleware_js_1.createOAuthMiddleware)(server, options),
        (0, create_api_middleware_js_1.createApiMiddleware)(server, options),
        (0, create_authorization_page_middleware_js_1.createAuthorizationPageMiddleware)(server, options),
        (0, create_account_page_middleware_js_1.createAccountPageMiddleware)(server, options),
    ]));
}
//# sourceMappingURL=oauth-middleware.js.map