"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobDiskCache = void 0;
exports.createMiddleware = createMiddleware;
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const promises_2 = require("node:stream/promises");
const http_errors_1 = __importStar(require("http-errors"));
const common_1 = require("@atproto/common");
const repo_1 = require("@atproto/repo");
const blob_resolver_1 = require("../api/blob-resolver");
const http_1 = require("../util/http");
const logger_1 = __importDefault(require("./logger"));
const sharp_1 = require("./sharp");
const uri_1 = require("./uri");
const util_1 = require("./util");
function createMiddleware(ctx, { prefix = '/' } = {}) {
    if (!prefix.startsWith('/') || !prefix.endsWith('/')) {
        throw new TypeError('Prefix must start and end with a slash');
    }
    // If there is a CDN, we don't need to serve images
    if (ctx.cfg.cdnUrl) {
        return (req, res, next) => next();
    }
    const cache = new BlobDiskCache(ctx.cfg.blobCacheLocation);
    return async (req, res, next) => {
        if (res.destroyed)
            return;
        if (req.method !== 'GET' && req.method !== 'HEAD')
            return next();
        if (!req.url?.startsWith(prefix))
            return next();
        const { 0: path, 1: _search } = req.url.slice(prefix.length - 1).split('?');
        if (!path.startsWith('/') || path === '/')
            return next();
        try {
            const options = uri_1.ImageUriBuilder.getOptions(path);
            const cacheKey = [options.did, options.cid, options.preset].join('::');
            // Cached flow
            try {
                const cachedImage = await cache.get(cacheKey);
                res.statusCode = 200;
                res.setHeader('x-cache', 'hit');
                res.setHeader('content-type', getMime(options.format));
                res.setHeader('cache-control', `public, max-age=31536000`); // 1 year
                res.setHeader('content-length', cachedImage.size);
                await (0, promises_2.pipeline)(cachedImage, res);
                return;
            }
            catch (err) {
                if (!(err instanceof repo_1.BlobNotFoundError)) {
                    logger_1.default.error({ cacheKey, err }, 'failed to serve cached image');
                }
                if (res.headersSent || res.destroyed) {
                    res.destroy();
                    return; // nothing we can do...
                }
                else {
                    // Ignore and move on to non-cached flow.
                    res.removeHeader('x-cache');
                    res.removeHeader('content-type');
                    res.removeHeader('cache-control');
                    res.removeHeader('content-length');
                }
            }
            // Non-cached flow
            const streamOptions = {
                did: options.did,
                cid: options.cid,
                signal: (0, http_1.responseSignal)(res),
            };
            await (0, blob_resolver_1.streamBlob)(ctx, streamOptions, (upstream, { did, cid, url }) => {
                // Definitely not an image ? Let's fail right away.
                if (isImageMime(upstream.headers['content-type']) === false) {
                    throw (0, http_errors_1.default)(400, 'Not an image');
                }
                // Let's transform (decompress, verify CID, upscale), process and respond
                const transforms = [
                    ...(0, common_1.createDecoders)(upstream.headers['content-encoding']),
                    new common_1.VerifyCidTransform(cid),
                    (0, sharp_1.createImageUpscaler)(options),
                ];
                const processor = (0, sharp_1.createImageProcessor)(options);
                // Cache in the background
                cache
                    .put(cacheKey, (0, common_1.cloneStream)(processor))
                    .catch((err) => logger_1.default.error({ err }, 'failed to cache image'));
                res.statusCode = 200;
                res.setHeader('cache-control', `public, max-age=31536000`); // 1 year
                res.setHeader('x-cache', 'miss');
                processor.once('info', ({ size, format }) => {
                    const type = util_1.formatsToMimes.get(format) || 'application/octet-stream';
                    // @NOTE sharp does emit this in time to be set as a header
                    res.setHeader('content-length', size);
                    res.setHeader('content-type', type);
                });
                const streams = [...transforms, processor, res];
                void (0, promises_2.pipeline)(streams).catch((err) => {
                    logger_1.default.warn({ err, did, cid: cid.toString(), pds: url.origin }, 'blob resolution failed during transmission');
                });
                return streams[0];
            });
        }
        catch (err) {
            if (res.headersSent || res.destroyed) {
                res.destroy();
            }
            else {
                res.removeHeader('content-type');
                res.removeHeader('content-length');
                res.removeHeader('cache-control');
                res.removeHeader('x-cache');
                if (err instanceof uri_1.BadPathError) {
                    next((0, http_errors_1.default)(400, err));
                }
                else if (err instanceof common_1.VerifyCidError) {
                    next((0, http_errors_1.default)(404, 'Blob not found', err));
                }
                else if ((0, http_errors_1.isHttpError)(err)) {
                    next(err);
                }
                else {
                    next((0, http_errors_1.default)(502, 'Upstream Error', { cause: err }));
                }
            }
        }
    };
}
function isImageMime(contentType) {
    if (contentType == null || contentType === 'application/octet-stream') {
        return undefined; // maybe
    }
    if (Array.isArray(contentType)) {
        if (contentType.length === 0)
            return undefined; // should never happen
        if (contentType.length === 1)
            return isImageMime(contentType[0]);
        return contentType.every(isImageMime); // Should we throw a 502 here?
    }
    return contentType.startsWith('image/');
}
function getMime(format) {
    const mime = util_1.formatsToMimes.get(format);
    if (!mime)
        throw new Error('Unknown format');
    return mime;
}
class BlobDiskCache {
    constructor(basePath) {
        Object.defineProperty(this, "tempDir", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.tempDir = basePath || node_path_1.default.join(node_os_1.default.tmpdir(), 'bsky--processed-images');
        if (!node_path_1.default.isAbsolute(this.tempDir)) {
            throw new Error('Must provide an absolute path');
        }
        try {
            node_fs_1.default.mkdirSync(this.tempDir, { recursive: true });
        }
        catch (err) {
            // All good if cache dir already exists
            if ((0, common_1.isErrnoException)(err) && err.code === 'EEXIST')
                return;
        }
    }
    async get(fileId) {
        try {
            const handle = await promises_1.default.open(node_path_1.default.join(this.tempDir, fileId), 'r');
            const { size } = await handle.stat();
            if (size === 0) {
                throw new repo_1.BlobNotFoundError();
            }
            return Object.assign(handle.createReadStream(), { size });
        }
        catch (err) {
            if ((0, common_1.isErrnoException)(err) && err.code === 'ENOENT') {
                throw new repo_1.BlobNotFoundError();
            }
            throw err;
        }
    }
    async put(fileId, stream) {
        const filename = node_path_1.default.join(this.tempDir, fileId);
        try {
            await promises_1.default.writeFile(filename, stream, { flag: 'wx' });
        }
        catch (err) {
            // Do not overwrite existing file, just ignore the error
            if ((0, common_1.isErrnoException)(err) && err.code === 'EEXIST')
                return;
            throw err;
        }
    }
    async clear(fileId) {
        const filename = node_path_1.default.join(this.tempDir, fileId);
        await promises_1.default.rm(filename, { force: true });
    }
    async clearAll() {
        await promises_1.default.rm(this.tempDir, { recursive: true, force: true });
    }
}
exports.BlobDiskCache = BlobDiskCache;
//# sourceMappingURL=server.js.map