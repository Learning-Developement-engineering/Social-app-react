"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEV_MODE = void 0;
exports.combineMiddlewares = combineMiddlewares;
exports.asHandler = asHandler;
exports.createFinalHandler = createFinalHandler;
const function_js_1 = require("../util/function.js");
const response_js_1 = require("./response.js");
const isNonNullable = (x) => x != null;
/**
 * Combine express/connect like middlewares (that can be async) into a single
 * middleware.
 */
function combineMiddlewares(middlewares, { skipKeyword } = {}) {
    const middlewaresArray = Array.from(middlewares).filter(isNonNullable);
    // Optimization: if there are no middlewares, return a noop middleware.
    if (middlewaresArray.length === 0)
        return (req, res, next) => void next();
    if (middlewaresArray.length === 1)
        return middlewaresArray[0];
    return function (req, res, next) {
        let i = 0;
        const nextMiddleware = (err) => {
            if (err) {
                if (skipKeyword && err === skipKeyword)
                    next();
                else
                    next(err);
            }
            else if (i >= middlewaresArray.length) {
                next();
            }
            else {
                const currentMiddleware = middlewaresArray[i++];
                const currentNext = (0, function_js_1.invokeOnce)(nextMiddleware);
                currentMiddleware.call(this, req, res, currentNext);
            }
        };
        nextMiddleware();
    };
}
/**
 * Convert a middleware in a function that can be used as both a middleware and
 * and handler.
 */
function asHandler(middleware, options) {
    return function (req, res, next = (0, function_js_1.invokeOnce)(createFinalHandler(req, res, options))) {
        return middleware.call(this, req, res, next);
    };
}
exports.DEV_MODE = process.env['NODE_ENV'] === 'development';
function createFinalHandler(req, res, options) {
    return (err) => {
        if (err != null && (options?.debug ?? exports.DEV_MODE)) {
            console.error(err);
        }
        if (res.headersSent) {
            // If an error occurred, and headers were sent, we can't know that the
            // whole response body was sent. So we can't safely reuse the socket.
            if (err)
                req.socket.destroy();
            return;
        }
        const { status, ...payload } = buildFallbackPayload(req, err);
        res.setHeader('Content-Security-Policy', "default-src 'none'");
        res.setHeader('X-Content-Type-Options', 'nosniff');
        (0, response_js_1.writeJson)(res, payload, { status });
    };
}
function buildFallbackPayload(req, err) {
    const status = err ? getErrorStatusCode(err) : 404;
    const expose = getProp(err, 'expose', 'boolean') ?? status < 500;
    return {
        status,
        error: err
            ? expose
                ? getProp(err, 'code', 'string') ??
                    getProp(err, 'error', 'string') ??
                    'unknown_error'
                : 'system_error'
            : 'not_found',
        error_description: err instanceof Error
            ? expose
                ? getProp(err, 'error_description', 'string') ||
                    String(err.message) ||
                    'Unknown error'
                : 'System error'
            : `Cannot ${req.method} ${req.url}`,
        stack: exports.DEV_MODE && err instanceof Error ? err.stack : undefined,
    };
}
function getErrorStatusCode(err) {
    const status = getProp(err, 'status', 'number') ?? getProp(err, 'statusCode', 'number');
    return status != null && status >= 400 && status < 600 ? status : 500;
}
function getProp(obj, key, type) {
    if (obj != null && typeof obj === 'object' && key in obj) {
        const value = obj[key];
        if (typeof value === type)
            return value;
    }
    return undefined;
}
//# sourceMappingURL=middleware.js.map