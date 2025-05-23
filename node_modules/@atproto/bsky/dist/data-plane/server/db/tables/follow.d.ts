import { GeneratedAlways } from 'kysely';
export declare const tableName = "follow";
export interface Follow {
    uri: string;
    cid: string;
    creator: string;
    subjectDid: string;
    createdAt: string;
    indexedAt: string;
    sortAt: GeneratedAlways<string>;
}
export type PartialDB = {
    [tableName]: Follow;
};
//# sourceMappingURL=follow.d.ts.map