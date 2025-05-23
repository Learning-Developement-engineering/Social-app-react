import { GeneratedAlways, Selectable } from 'kysely';
export declare const tableName = "account_record_status_stats";
type AccountRecordStatusStats = {
    did: GeneratedAlways<string>;
    subjectCount: GeneratedAlways<number>;
    pendingCount: GeneratedAlways<number>;
    processedCount: GeneratedAlways<number>;
    takendownCount: GeneratedAlways<number>;
};
export type AccountRecordStatusStatsRow = Selectable<AccountRecordStatusStats>;
export type PartialDB = {
    [tableName]: AccountRecordStatusStats;
};
export {};
//# sourceMappingURL=account_record_status_stats.d.ts.map