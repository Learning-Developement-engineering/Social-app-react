import { Database } from './db';
type Task = (db: Database, signal: AbortSignal) => Promise<void>;
/**
 * A simple queue for in-process, out-of-band/backgrounded work
 */
export declare class BackgroundQueue {
    protected db: Database;
    private abortController;
    private queue;
    get signal(): AbortSignal;
    get destroyed(): boolean;
    constructor(db: Database, queueOpts?: {
        concurrency?: number;
    });
    getStats(): {
        runningCount: number;
        waitingCount: number;
    };
    /**
     * Add a task that will be executed at some point in the future.
     *
     * The task will be executed even if the backgroundQueue is destroyed, unless
     * the provided `signal` is aborted.
     *
     * The `signal` provided to the task will be aborted whenever either the
     * backgroundQueue is destroyed or the provided `signal` is aborted.
     */
    add(task: Task, signal?: AbortSignal): Promise<void>;
    processAll(): Promise<void>;
    /**
     * On destroy we stop accepting new tasks, but complete all
     * pending/in-progress tasks. Tasks can decide to abort their current
     * operation based on the signal they received. The application calls this
     * only once http connections have drained (tasks no longer being added).
     */
    destroy(): Promise<void>;
}
/**
 * A simple periodic background task runner. This class will schedule a task to
 * run through a provided {@link BackgroundQueue} at a fixed interval. The task
 * will never run more than once concurrently, and will wait at least `interval`
 * milliseconds between the end of one run and the start of the next.
 */
export declare class PeriodicBackgroundTask {
    protected backgroundQueue: BackgroundQueue;
    protected interval: number;
    protected task: Task;
    private abortController;
    private intervalPromise?;
    private runningPromise?;
    get signal(): AbortSignal;
    get destroyed(): boolean;
    constructor(backgroundQueue: BackgroundQueue, interval: number, task: Task);
    run(signal?: AbortSignal): Promise<void>;
    start(): void;
    destroy(): Promise<void>;
}
export {};
//# sourceMappingURL=background.d.ts.map