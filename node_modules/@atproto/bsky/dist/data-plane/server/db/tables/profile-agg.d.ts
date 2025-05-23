import { Generated } from 'kysely';
export declare const tableName = "profile_agg";
export interface ProfileAgg {
    did: string;
    followersCount: Generated<number>;
    followsCount: Generated<number>;
    postsCount: Generated<number>;
}
export type PartialDB = {
    [tableName]: ProfileAgg;
};
//# sourceMappingURL=profile-agg.d.ts.map