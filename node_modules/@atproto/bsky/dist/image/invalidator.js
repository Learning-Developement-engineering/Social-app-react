"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessingServerInvalidator = void 0;
const uri_1 = require("./uri");
class ImageProcessingServerInvalidator {
    constructor(cache) {
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cache
        });
    }
    async invalidate(_subject, paths) {
        const results = await Promise.allSettled(paths.map(async (path) => {
            const [, signature] = path.split('/');
            if (!signature)
                throw new Error('Missing signature');
            const options = uri_1.ImageUriBuilder.getOptions(path);
            const cacheKey = [
                options.did,
                options.cid.toString(),
                options.preset,
            ].join('::');
            await this.cache.clear(cacheKey);
        }));
        const rejection = results.find((result) => result.status === 'rejected');
        if (rejection)
            throw rejection.reason;
    }
}
exports.ImageProcessingServerInvalidator = ImageProcessingServerInvalidator;
//# sourceMappingURL=invalidator.js.map