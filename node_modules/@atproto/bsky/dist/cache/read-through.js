"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadThroughCache = void 0;
const logger_1 = require("../logger");
class ReadThroughCache {
    constructor(redis, opts) {
        Object.defineProperty(this, "redis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: redis
        });
        Object.defineProperty(this, "opts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: opts
        });
    }
    async _fetchMany(keys) {
        let result = {};
        if (this.opts.fetchManyMethod) {
            result = await this.opts.fetchManyMethod(keys);
        }
        else {
            const got = await Promise.all(keys.map((k) => this.opts.fetchMethod(k)));
            for (let i = 0; i < keys.length; i++) {
                result[keys[i]] = got[i] ?? null;
            }
        }
        // ensure caching negatives
        for (const key of keys) {
            result[key] ?? (result[key] = null);
        }
        return result;
    }
    async fetchAndCache(key) {
        const fetched = await this.opts.fetchMethod(key);
        this.set(key, fetched).catch((err) => logger_1.cacheLogger.error({ err, key }, 'failed to set cache value'));
        return fetched;
    }
    async fetchAndCacheMany(keys) {
        const fetched = await this._fetchMany(keys);
        this.setMany(fetched).catch((err) => logger_1.cacheLogger.error({ err, keys }, 'failed to set cache values'));
        return removeNulls(fetched);
    }
    async get(key, opts) {
        if (opts?.revalidate) {
            return this.fetchAndCache(key);
        }
        let cached;
        try {
            const got = await this.redis.get(key);
            cached = got ? JSON.parse(got) : null;
        }
        catch (err) {
            cached = null;
            logger_1.cacheLogger.warn({ key, err }, 'failed to fetch value from cache');
        }
        if (!cached || this.isExpired(cached)) {
            return this.fetchAndCache(key);
        }
        if (this.isStale(cached)) {
            this.fetchAndCache(key).catch((err) => logger_1.cacheLogger.warn({ key, err }, 'failed to refresh stale cache value'));
        }
        return cached.val;
    }
    async getMany(keys, opts) {
        if (opts?.revalidate) {
            return this.fetchAndCacheMany(keys);
        }
        let cached;
        try {
            cached = await this.redis.getMulti(keys);
        }
        catch (err) {
            cached = {};
            logger_1.cacheLogger.warn({ keys, err }, 'failed to fetch values from cache');
        }
        const stale = [];
        const toFetch = [];
        const results = {};
        for (const key of keys) {
            const val = cached[key] ? JSON.parse(cached[key]) : null;
            if (!val || this.isExpired(val)) {
                toFetch.push(key);
                continue;
            }
            if (this.isStale(val)) {
                stale.push(key);
            }
            if (val.val) {
                results[key] = val.val;
            }
        }
        const fetched = await this.fetchAndCacheMany(toFetch);
        this.fetchAndCacheMany(stale).catch((err) => logger_1.cacheLogger.warn({ keys, err }, 'failed to refresh stale cache values'));
        return {
            ...results,
            ...fetched,
        };
    }
    async set(key, val) {
        await this.setMany({ [key]: val });
    }
    async setMany(vals) {
        const items = {};
        for (const key of Object.keys(vals)) {
            items[key] = JSON.stringify({
                val: vals[key],
                updatedAt: Date.now(),
            });
        }
        await this.redis.setMulti(items, this.opts.maxTTL);
    }
    async clearEntry(key) {
        await this.redis.del(key);
    }
    isExpired(result) {
        return Date.now() > result.updatedAt + this.opts.maxTTL;
    }
    isStale(result) {
        return Date.now() > result.updatedAt + this.opts.staleTTL;
    }
}
exports.ReadThroughCache = ReadThroughCache;
const removeNulls = (obj) => {
    return Object.entries(obj).reduce((acc, [key, val]) => {
        if (val !== null) {
            acc[key] = val;
        }
        return acc;
    }, {});
};
//# sourceMappingURL=read-through.js.map