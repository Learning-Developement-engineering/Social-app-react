"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtcdMap = void 0;
const node_events_1 = require("node:events");
/**
 * A reactive map based on the keys and values stored within etcd under a given prefix.
 */
class EtcdMap {
    constructor(etcd, prefix = '') {
        Object.defineProperty(this, "etcd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: etcd
        });
        Object.defineProperty(this, "prefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: prefix
        });
        Object.defineProperty(this, "inner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "watcher", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "connecting", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "handlers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.watcher = etcd.watch().prefix(prefix).watcher();
        this.connecting = connectWatcher(this.watcher);
    }
    async connect() {
        this.watcher.on('put', (kv) => {
            const key = kv.key.toString();
            const value = kv.value.toString();
            const rev = revToInt(kv.mod_revision);
            this.apply(key, { value, rev });
        });
        this.watcher.on('delete', (kv) => {
            const key = kv.key.toString();
            const value = null;
            const rev = revToInt(kv.mod_revision);
            this.apply(key, { value, rev });
        });
        await this.connecting?.finally(() => {
            this.connecting = undefined;
        });
        const { kvs } = await this.etcd.getAll().prefix(this.prefix).exec();
        for (const kv of kvs) {
            const key = kv.key.toString();
            const value = kv.value.toString();
            const rev = revToInt(kv.mod_revision);
            this.apply(key, { value, rev });
        }
    }
    get(key) {
        return this.inner.get(key)?.value ?? null;
    }
    *values() {
        for (const { value } of this.inner.values()) {
            if (value !== null) {
                yield value;
            }
        }
    }
    onUpdate(handler) {
        this.handlers.push(handler);
    }
    update() {
        for (const handler of this.handlers) {
            handler(this);
        }
    }
    apply(key, vv) {
        const curr = this.inner.get(key);
        if (curr && curr.rev > vv.rev)
            return;
        this.inner.set(key, vv);
        this.update();
    }
}
exports.EtcdMap = EtcdMap;
function revToInt(rev) {
    return parseInt(rev, 10);
}
async function connectWatcher(watcher) {
    await Promise.race([
        (0, node_events_1.once)(watcher, 'connected'),
        (0, node_events_1.once)(watcher, 'error').then((err) => Promise.reject(err)),
    ]);
}
//# sourceMappingURL=etcd.js.map