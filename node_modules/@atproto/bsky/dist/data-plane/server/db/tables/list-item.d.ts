import { GeneratedAlways } from 'kysely';
export declare const tableName = "list_item";
export interface ListItem {
    uri: string;
    cid: string;
    creator: string;
    subjectDid: string;
    listUri: string;
    createdAt: string;
    indexedAt: string;
    sortAt: GeneratedAlways<string>;
}
export type PartialDB = {
    [tableName]: ListItem;
};
//# sourceMappingURL=list-item.d.ts.map