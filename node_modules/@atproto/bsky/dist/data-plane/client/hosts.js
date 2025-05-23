"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtcdHostList = exports.BasicHostList = void 0;
const etcd_1 = require("../../etcd");
const logger_1 = require("../../logger");
/**
 * Maintains a reactive HostList based on a simple setter.
 */
class BasicHostList {
    constructor(hosts) {
        Object.defineProperty(this, "hosts", {
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
        this.hosts = hosts;
    }
    get() {
        return this.hosts;
    }
    set(hosts) {
        this.hosts = hosts;
        this.update();
    }
    update() {
        for (const handler of this.handlers) {
            handler(this.hosts);
        }
    }
    onUpdate(handler) {
        this.handlers.push(handler);
    }
}
exports.BasicHostList = BasicHostList;
/**
 * Maintains a reactive HostList based on etcd key values under a given key prefix.
 * When fallback is provided, ensures that this fallback is used whenever no hosts are available.
 */
class EtcdHostList {
    constructor(etcd, prefix, fallback) {
        Object.defineProperty(this, "kv", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new BasicHostList(new Set())
        });
        Object.defineProperty(this, "fallback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.fallback = new Set(fallback);
        this.kv = new etcd_1.EtcdMap(etcd, prefix);
        this.update(); // init fallback if necessary
        this.kv.watcher.on('connected', (res) => {
            logger_1.dataplaneLogger.warn({ watcherId: this.kv.watcher.id, header: res.header }, 'EtcdHostList connected');
        });
        this.kv.watcher.on('disconnected', (err) => {
            logger_1.dataplaneLogger.warn({ watcherId: this.kv.watcher.id, err }, 'EtcdHostList disconnected');
        });
        this.kv.watcher.on('error', (err) => {
            logger_1.dataplaneLogger.error({ watcherId: this.kv.watcher.id, err }, 'EtcdHostList error');
        });
    }
    async connect() {
        await this.kv.connect();
        this.update();
        this.kv.onUpdate(() => this.update());
    }
    get() {
        return this.inner.get();
    }
    update() {
        const hosts = new Set();
        for (const host of this.kv.values()) {
            if (URL.canParse(host)) {
                hosts.add(host);
            }
        }
        if (hosts.size) {
            this.inner.set(hosts);
        }
        else if (this.fallback.size) {
            this.inner.set(this.fallback);
        }
    }
    onUpdate(handler) {
        this.inner.onUpdate(handler);
    }
}
exports.EtcdHostList = EtcdHostList;
//# sourceMappingURL=hosts.js.map