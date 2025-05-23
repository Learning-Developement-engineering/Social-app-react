import { GeneratedAlways } from 'kysely';
declare const tableName = "quote";
export interface Quote {
    uri: string;
    cid: string;
    subject: string;
    subjectCid: string;
    createdAt: string;
    indexedAt: string;
    sortAt: GeneratedAlways<string>;
}
export type PartialDB = {
    [tableName]: Quote;
};
export {};
//# sourceMappingURL=quote.d.ts.map