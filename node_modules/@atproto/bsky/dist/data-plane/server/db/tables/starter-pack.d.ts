import { GeneratedAlways } from 'kysely';
export declare const tableName = "starter_pack";
export interface StarterPack {
    uri: string;
    cid: string;
    creator: string;
    name: string;
    createdAt: string;
    indexedAt: string;
    sortAt: GeneratedAlways<string>;
}
export type PartialDB = {
    [tableName]: StarterPack;
};
//# sourceMappingURL=starter-pack.d.ts.map