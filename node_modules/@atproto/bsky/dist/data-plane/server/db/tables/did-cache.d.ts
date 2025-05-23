import { DidDocument } from '@atproto/identity';
export interface DidCache {
    did: string;
    doc: DidDocument;
    updatedAt: number;
}
export declare const tableName = "did_cache";
export type PartialDB = {
    [tableName]: DidCache;
};
//# sourceMappingURL=did-cache.d.ts.map