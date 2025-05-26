export interface Mute {
    subjectDid: string;
    mutedByDid: string;
    createdAt: string;
}
export declare const tableName = "mute";
export type PartialDB = {
    [tableName]: Mute;
};
//# sourceMappingURL=mute.d.ts.map