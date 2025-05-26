import { GeneratedAlways } from 'kysely';
export declare const tableName = "list_block";
export interface ListBlock {
    uri: string;
    cid: string;
    creator: string;
    subjectUri: string;
    createdAt: string;
    indexedAt: string;
    sortAt: GeneratedAlways<string>;
}
export type PartialDB = {
    [tableName]: ListBlock;
};
//# sourceMappingURL=list-block.d.ts.map