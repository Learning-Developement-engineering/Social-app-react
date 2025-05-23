"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyResponseHeaders = proxyResponseHeaders;
exports.responseSignal = responseSignal;
const http_errors_1 = __importDefault(require("http-errors"));
const RESPONSE_HEADERS_TO_PROXY = new Set([
    'content-type',
    'content-length',
    'content-encoding',
    'content-language',
    'cache-control',
    'last-modified',
    'etag',
    'expires',
    'retry-after',
    'vary', // Might vary based on "accept" headers
]);
function proxyResponseHeaders(data, res) {
    res.statusCode = data.statusCode >= 500 ? 502 : data.statusCode;
    for (const name of RESPONSE_HEADERS_TO_PROXY) {
        const val = data.headers[name];
        if (val)
            res.setHeader(name, val);
    }
}
function responseSignal(res) {
    if (res.destroyed)
        throw (0, http_errors_1.default)(499, 'Client Disconnected');
    const controller = new AbortController();
    res.once('close', () => controller.abort());
    return controller.signal;
}
//# sourceMappingURL=http.js.map