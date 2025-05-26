import type { IncomingMessage, ServerResponse } from 'node:http';
import { Handler, Middleware, NextFunction } from './types.js';
export declare function combineMiddlewares<M extends Middleware<any, any, any>>(middlewares: Iterable<null | undefined | M>, options?: {
    skipKeyword?: string;
}): M;
export type AsHandler<M extends Middleware<any, any, any>> = M extends Middleware<infer T, infer Req, infer Res> ? Handler<T, Req, Res> : never;
/**
 * Convert a middleware in a function that can be used as both a middleware and
 * and handler.
 */
export declare function asHandler<M extends Middleware<any, any, any>>(middleware: M, options?: FinalHandlerOptions): AsHandler<M>;
export declare const DEV_MODE: boolean;
export type FinalHandlerOptions = {
    debug?: boolean;
};
export declare function createFinalHandler(req: IncomingMessage, res: ServerResponse, options?: FinalHandlerOptions): NextFunction;
//# sourceMappingURL=middleware.d.ts.map