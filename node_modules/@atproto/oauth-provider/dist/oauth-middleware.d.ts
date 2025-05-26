import type { IncomingMessage, ServerResponse } from 'node:http';
import { Handler } from './lib/http/types.js';
import { OAuthProvider } from './oauth-provider.js';
import { ErrorHandler } from './router/error-handler.js';
import { MiddlewareOptions } from './router/middleware-options.js';
export type { ErrorHandler, Handler, IncomingMessage, MiddlewareOptions, ServerResponse, };
/**
 * @returns An http request handler that can be used with node's http server
 * or as a middleware with express / connect.
 */
export declare function oauthMiddleware<Req extends IncomingMessage = IncomingMessage, Res extends ServerResponse = ServerResponse>(server: OAuthProvider, { ...options }?: MiddlewareOptions<Req, Res>): Handler<void, Req, Res>;
//# sourceMappingURL=oauth-middleware.d.ts.map