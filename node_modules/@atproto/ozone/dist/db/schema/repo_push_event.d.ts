import { Generated } from 'kysely';
export declare const eventTableName = "repo_push_event";
export type RepoPushEventType = 'pds_takedown' | 'appview_takedown';
export interface RepoPushEvent {
    id: Generated<number>;
    eventType: RepoPushEventType;
    subjectDid: string;
    takedownRef: string | null;
    confirmedAt: Date | null;
    lastAttempted: Date | null;
    attempts: Generated<number>;
}
export type PartialDB = {
    [eventTableName]: RepoPushEvent;
};
//# sourceMappingURL=repo_push_event.d.ts.map