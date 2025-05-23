export interface DuplicateRecord {
    uri: string;
    cid: string;
    duplicateOf: string;
    indexedAt: string;
}
export declare const tableName = "duplicate_record";
export type PartialDB = {
    [tableName]: DuplicateRecord;
};
//# sourceMappingURL=duplicate-record.d.ts.map