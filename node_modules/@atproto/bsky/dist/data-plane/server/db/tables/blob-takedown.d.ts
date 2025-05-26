export interface BlobTakedown {
    did: string;
    cid: string;
    takedownRef: string;
}
export declare const tableName = "blob_takedown";
export type PartialDB = {
    [tableName]: BlobTakedown;
};
//# sourceMappingURL=blob-takedown.d.ts.map