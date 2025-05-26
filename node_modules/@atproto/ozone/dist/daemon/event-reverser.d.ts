import { Database } from '../db';
import { ModerationServiceCreator, ReversalSubject } from '../mod-service';
export declare class EventReverser {
    private db;
    private modService;
    destroyed: boolean;
    reversalPromise: Promise<void>;
    timer?: NodeJS.Timeout;
    constructor(db: Database, modService: ModerationServiceCreator);
    start(): void;
    poll(): void;
    destroy(): Promise<void>;
    revertState(subject: ReversalSubject): Promise<void>;
    findAndRevertDueActions(): Promise<void>;
}
//# sourceMappingURL=event-reverser.d.ts.map