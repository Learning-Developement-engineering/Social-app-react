import { IdResolver } from '@atproto/identity';
import { Firehose, MemoryRunner } from '@atproto/sync';
import { BackgroundQueue } from './background';
import { Database } from './db';
import { IndexingService } from './indexing';
export declare class RepoSubscription {
    opts: {
        service: string;
        db: Database;
        idResolver: IdResolver;
    };
    firehose: Firehose;
    runner: MemoryRunner;
    background: BackgroundQueue;
    indexingSvc: IndexingService;
    constructor(opts: {
        service: string;
        db: Database;
        idResolver: IdResolver;
    });
    start(): void;
    restart(): Promise<void>;
    processAll(): Promise<void>;
    destroy(): Promise<void>;
}
//# sourceMappingURL=subscription.d.ts.map