import type { IncomingMessage, ServerResponse } from 'node:http';
import { Middleware } from '../lib/http/index.js';
import type { OAuthProvider } from '../oauth-provider.js';
import type { MiddlewareOptions } from './middleware-options.js';
export declare function createAccountPageMiddleware<Ctx extends object | void = void, Req extends IncomingMessage = IncomingMessage, Res extends ServerResponse = ServerResponse>(server: OAuthProvider, { onError }: MiddlewareOptions<Req, Res>): Middleware<Ctx, Req, Res>;
//# sourceMappingURL=create-account-page-middleware.d.ts.map