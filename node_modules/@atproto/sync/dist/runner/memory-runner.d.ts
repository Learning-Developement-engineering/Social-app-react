import PQueue from 'p-queue';
import { ConsecutiveList } from './consecutive-list';
import { EventRunner } from './types';
export type MemoryRunnerOptions = {
    setCursor?: (cursor: number) => Promise<void>;
    concurrency?: number;
    startCursor?: number;
};
export declare class MemoryRunner implements EventRunner {
    opts: MemoryRunnerOptions;
    consecutive: ConsecutiveList<number>;
    mainQueue: PQueue;
    partitions: Map<string, PQueue<import("p-queue/dist/priority-queue").default, import("p-queue").DefaultAddOptions>>;
    cursor: number | undefined;
    constructor(opts?: MemoryRunnerOptions);
    getCursor(): number | undefined;
    addTask(partitionId: string, task: () => Promise<void>): Promise<void>;
    private getPartition;
    trackEvent(did: string, seq: number, handler: () => Promise<void>): Promise<void>;
    processAll(): Promise<void>;
    destroy(): Promise<void>;
}
//# sourceMappingURL=memory-runner.d.ts.map