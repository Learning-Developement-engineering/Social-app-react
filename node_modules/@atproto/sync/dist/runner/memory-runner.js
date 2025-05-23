"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRunner = void 0;
const p_queue_1 = __importDefault(require("p-queue"));
const consecutive_list_1 = require("./consecutive-list");
// A queue with arbitrarily many partitions, each processing work sequentially.
// Partitions are created lazily and taken out of memory when they go idle.
class MemoryRunner {
    constructor(opts = {}) {
        Object.defineProperty(this, "opts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: opts
        });
        Object.defineProperty(this, "consecutive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new consecutive_list_1.ConsecutiveList()
        });
        Object.defineProperty(this, "mainQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "partitions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "cursor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.mainQueue = new p_queue_1.default({ concurrency: opts.concurrency ?? Infinity });
        this.cursor = opts.startCursor;
    }
    getCursor() {
        return this.cursor;
    }
    async addTask(partitionId, task) {
        if (this.mainQueue.isPaused)
            return;
        return this.mainQueue.add(() => {
            return this.getPartition(partitionId).add(task);
        });
    }
    getPartition(partitionId) {
        let partition = this.partitions.get(partitionId);
        if (!partition) {
            partition = new p_queue_1.default({ concurrency: 1 });
            partition.once('idle', () => this.partitions.delete(partitionId));
            this.partitions.set(partitionId, partition);
        }
        return partition;
    }
    async trackEvent(did, seq, handler) {
        if (this.mainQueue.isPaused)
            return;
        const item = this.consecutive.push(seq);
        await this.addTask(did, async () => {
            await handler();
            const latest = item.complete().at(-1);
            if (latest !== undefined) {
                this.cursor = latest;
                if (this.opts.setCursor) {
                    await this.opts.setCursor(this.cursor);
                }
            }
        });
    }
    async processAll() {
        await this.mainQueue.onIdle();
    }
    async destroy() {
        this.mainQueue.pause();
        this.mainQueue.clear();
        this.partitions.forEach((p) => p.clear());
        await this.mainQueue.onIdle();
    }
}
exports.MemoryRunner = MemoryRunner;
//# sourceMappingURL=memory-runner.js.map