"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodicBackgroundTask = exports.BackgroundQueue = void 0;
const p_queue_1 = __importDefault(require("p-queue"));
const logger_1 = require("./logger");
const util_1 = require("./util");
/**
 * A simple queue for in-process, out-of-band/backgrounded work
 */
class BackgroundQueue {
    get signal() {
        return this.abortController.signal;
    }
    get destroyed() {
        return this.signal.aborted;
    }
    constructor(db, queueOpts) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
        Object.defineProperty(this, "abortController", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new AbortController()
        });
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.queue = new p_queue_1.default(queueOpts ?? { concurrency: 20 });
    }
    getStats() {
        return {
            runningCount: this.queue.pending,
            waitingCount: this.queue.size,
        };
    }
    /**
     * Add a task that will be executed at some point in the future.
     *
     * The task will be executed even if the backgroundQueue is destroyed, unless
     * the provided `signal` is aborted.
     *
     * The `signal` provided to the task will be aborted whenever either the
     * backgroundQueue is destroyed or the provided `signal` is aborted.
     */
    async add(task, signal) {
        if (this.destroyed) {
            return;
        }
        const abortController = (0, util_1.boundAbortController)(this.signal, signal);
        return this.queue.add(async () => {
            try {
                // Do not run the task if the signal provided to the task has become
                // aborted. Do not use `abortController.signal` here since we do not
                // want to abort the task if the backgroundQueue is being destroyed.
                if (signal?.aborted)
                    return;
                // The task will receive a "combined signal" allowing it to abort if
                // either the backgroundQueue is destroyed or the provided signal is
                // aborted.
                await task(this.db, abortController.signal);
            }
            catch (err) {
                if (!(0, util_1.isCausedBySignal)(err, abortController.signal)) {
                    logger_1.dbLogger.error({ err }, 'background queue task failed');
                }
            }
            finally {
                abortController.abort();
            }
        });
    }
    async processAll() {
        await this.queue.onIdle();
    }
    /**
     * On destroy we stop accepting new tasks, but complete all
     * pending/in-progress tasks. Tasks can decide to abort their current
     * operation based on the signal they received. The application calls this
     * only once http connections have drained (tasks no longer being added).
     */
    async destroy() {
        this.abortController.abort();
        await this.queue.onIdle();
    }
}
exports.BackgroundQueue = BackgroundQueue;
/**
 * A simple periodic background task runner. This class will schedule a task to
 * run through a provided {@link BackgroundQueue} at a fixed interval. The task
 * will never run more than once concurrently, and will wait at least `interval`
 * milliseconds between the end of one run and the start of the next.
 */
class PeriodicBackgroundTask {
    get signal() {
        return this.abortController.signal;
    }
    get destroyed() {
        return this.signal.aborted;
    }
    constructor(backgroundQueue, interval, task) {
        Object.defineProperty(this, "backgroundQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: backgroundQueue
        });
        Object.defineProperty(this, "interval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: interval
        });
        Object.defineProperty(this, "task", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: task
        });
        Object.defineProperty(this, "abortController", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "intervalPromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "runningPromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (!Number.isFinite(interval) || interval <= 0) {
            throw new TypeError('interval must be a positive number');
        }
        // Bind this class's signal to the backgroundQueue's signal (destroying this
        // instance if the backgroundQueue is destroyed)
        this.abortController = (0, util_1.boundAbortController)(backgroundQueue.signal);
    }
    run(signal) {
        // `startInterval` already ensures that only one run is in progress at a
        // time. However, we want to be able to expose a `run()` method that can be
        // used to force a run, which could cause concurrent executions. We prevent
        // this using the `runningPromise` property.
        if (this.runningPromise)
            return this.runningPromise;
        // Combine the `this.signal` with the provided `signal`, if any.
        const abortController = (0, util_1.boundAbortController)(this.signal, signal);
        const promise = this.backgroundQueue.add(this.task, abortController.signal);
        return (this.runningPromise = promise).finally(() => {
            if (this.runningPromise === promise)
                this.runningPromise = undefined;
            // Cleanup the listeners added by `boundAbortController`
            abortController.abort();
        });
    }
    start() {
        // Noop if already started. Throws if this.signal is aborted (instance is
        // destroyed).
        this.intervalPromise || (this.intervalPromise = (0, util_1.startInterval)(async (signal) => this.run(signal), this.interval, this.signal));
    }
    async destroy() {
        // @NOTE This instance does not "own" the backgroundQueue, so we do not
        // destroy it here.
        this.abortController.abort();
        await this.intervalPromise;
        this.intervalPromise = undefined;
    }
}
exports.PeriodicBackgroundTask = PeriodicBackgroundTask;
//# sourceMappingURL=background.js.map