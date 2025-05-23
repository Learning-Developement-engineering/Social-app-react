export interface ActorSync {
    did: string;
    commitCid: string;
    repoRev: string | null;
}
export declare const tableName = "actor_sync";
export type PartialDB = {
    [tableName]: ActorSync;
};
//# sourceMappingURL=actor-sync.d.ts.map