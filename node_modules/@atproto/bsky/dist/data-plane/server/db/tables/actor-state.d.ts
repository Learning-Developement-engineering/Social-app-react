export interface ActorState {
    did: string;
    lastSeenNotifs: string;
    priorityNotifs: boolean;
    lastSeenPriorityNotifs: string | undefined;
}
export declare const tableName = "actor_state";
export type PartialDB = {
    [tableName]: ActorState;
};
//# sourceMappingURL=actor-state.d.ts.map