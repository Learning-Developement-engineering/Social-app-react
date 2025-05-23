import PQueue from 'p-queue';
import { Database } from './db';
export declare class BackgroundQueue {
    db: Database;
    queue: PQueue<import("p-queue/dist/priority-queue").default, import("p-queue").DefaultAddOptions>;
    destroyed: boolean;
    constructor(db: Database);
    add(task: Task): void;
    processAll(): Promise<void>;
    destroy(): Promise<void>;
}
type Task = (db: Database) => Promise<void>;
export {};
//# sourceMappingURL=background.d.ts.map