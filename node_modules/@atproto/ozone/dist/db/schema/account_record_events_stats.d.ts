import { GeneratedAlways, Selectable } from 'kysely';
export declare const tableName = "account_record_events_stats";
type AccountRecordEventsStats = {
    subjectDid: GeneratedAlways<string>;
    totalReports: GeneratedAlways<number>;
    reportedCount: GeneratedAlways<number>;
    escalatedCount: GeneratedAlways<number>;
    appealedCount: GeneratedAlways<number>;
};
export type AccountRecordEventsStatsRow = Selectable<AccountRecordEventsStats>;
export type PartialDB = {
    [tableName]: AccountRecordEventsStats;
};
export {};
//# sourceMappingURL=account_record_events_stats.d.ts.map