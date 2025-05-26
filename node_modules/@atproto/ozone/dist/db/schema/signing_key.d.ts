import { Generated } from 'kysely';
export declare const tableName = "signing_key";
export interface SigningKey {
    id: Generated<number>;
    key: string;
}
export type PartialDB = {
    [tableName]: SigningKey;
};
//# sourceMappingURL=signing_key.d.ts.map