export declare const tableName = "subscription";
export interface Subscription {
    service: string;
    method: string;
    state: string;
}
export type PartialDB = {
    [tableName]: Subscription;
};
//# sourceMappingURL=subscription.d.ts.map