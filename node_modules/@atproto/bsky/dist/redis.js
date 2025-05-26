"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
exports.addressParts = addressParts;
const node_assert_1 = __importDefault(require("node:assert"));
const ioredis_1 = require("ioredis");
class Redis {
    constructor(opts) {
        Object.defineProperty(this, "driver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if ('sentinel' in opts) {
            (0, node_assert_1.default)(opts.sentinel && Array.isArray(opts.hosts) && opts.hosts.length);
            this.driver = new ioredis_1.Redis({
                name: opts.sentinel,
                sentinels: opts.hosts.map((h) => addressParts(h, 26379)),
                password: opts.password,
                db: opts.db,
                commandTimeout: opts.commandTimeout,
            });
        }
        else if ('host' in opts) {
            (0, node_assert_1.default)(opts.host);
            this.driver = new ioredis_1.Redis({
                ...addressParts(opts.host),
                password: opts.password,
                db: opts.db,
                commandTimeout: opts.commandTimeout,
            });
        }
        else {
            (0, node_assert_1.default)(opts.driver);
            this.driver = opts.driver;
        }
        this.namespace = opts.namespace;
    }
    withNamespace(namespace) {
        return new Redis({ driver: this.driver, namespace });
    }
    async readStreams(streams, opts) {
        const allRead = await this.driver.xreadBuffer('COUNT', opts.count, // events per stream
        'BLOCK', opts.blockMs ?? 1000, // millis
        'STREAMS', ...streams.map((s) => this.ns(s.key)), ...streams.map((s) => s.cursor));
        const results = [];
        for (const [key, messages] of allRead ?? []) {
            const result = {
                key: this.rmns(key.toString()),
                messages: [],
            };
            results.push(result);
            for (const [seqBuf, values] of messages) {
                const message = { cursor: seqBuf.toString(), contents: {} };
                result.messages.push(message);
                for (let i = 0; i < values.length; ++i) {
                    if (i % 2 === 0)
                        continue;
                    const field = values[i - 1].toString();
                    message.contents[field] = values[i];
                }
            }
        }
        return results;
    }
    async addToStream(key, id, fields) {
        await this.driver.xadd(this.ns(key), id, ...fields.flat());
    }
    async addMultiToStream(evts) {
        const pipeline = this.driver.pipeline();
        for (const { key, id, fields } of evts) {
            pipeline.xadd(this.ns(key), id, ...fields.flat());
        }
        return (await pipeline.exec()) ?? [];
    }
    async trimStream(key, cursor) {
        await this.driver.xtrim(this.ns(key), 'MINID', cursor);
    }
    async streamLengths(keys) {
        const pipeline = this.driver.pipeline();
        for (const key of keys) {
            pipeline.xlen(this.ns(key));
        }
        const results = await pipeline.exec();
        return (results ?? []).map(([, len = 0]) => Number(len));
    }
    async get(key) {
        return await this.driver.get(this.ns(key));
    }
    async set(key, val, ttlMs) {
        if (ttlMs !== undefined) {
            await this.driver.set(this.ns(key), val, 'PX', ttlMs);
        }
        else {
            await this.driver.set(this.ns(key), val);
        }
    }
    async getMulti(keys) {
        const namespaced = keys.map((k) => this.ns(k));
        const got = await this.driver.mget(...namespaced);
        const results = {};
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            results[key] = got[i];
        }
        return results;
    }
    async setMulti(vals, ttlMs) {
        if (Object.keys(vals).length === 0) {
            return;
        }
        let builder = this.driver.multi({ pipeline: true });
        for (const key of Object.keys(vals)) {
            if (ttlMs !== undefined) {
                builder = builder.set(this.ns(key), vals[key], 'PX', ttlMs);
            }
            else {
                builder = builder.set(this.ns(key), vals[key]);
            }
        }
        await builder.exec();
    }
    async del(key) {
        return await this.driver.del(this.ns(key));
    }
    async expire(key, seconds) {
        return await this.driver.expire(this.ns(key), seconds);
    }
    async zremrangebyscore(key, min, max) {
        return await this.driver.zremrangebyscore(this.ns(key), min, max);
    }
    async zcount(key, min, max) {
        return await this.driver.zcount(this.ns(key), min, max);
    }
    async zadd(key, score, member) {
        return await this.driver.zadd(this.ns(key), score, member);
    }
    async destroy() {
        await this.driver.quit();
    }
    // namespace redis keys
    ns(key) {
        return this.namespace ? `${this.namespace}:${key}` : key;
    }
    // remove namespace from redis key
    rmns(key) {
        return this.namespace && key.startsWith(`${this.namespace}:`)
            ? key.replace(`${this.namespace}:`, '')
            : key;
    }
}
exports.Redis = Redis;
function addressParts(addr, defaultPort = 6379) {
    const [host, portStr, ...others] = addr.split(':');
    const port = portStr ? parseInt(portStr, 10) : defaultPort;
    (0, node_assert_1.default)(host && !isNaN(port) && !others.length, `invalid address: ${addr}`);
    return { host, port };
}
//# sourceMappingURL=redis.js.map