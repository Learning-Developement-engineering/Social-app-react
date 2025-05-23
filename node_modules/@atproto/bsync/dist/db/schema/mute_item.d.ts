import { Selectable } from 'kysely';
export interface MuteItem {
    actorDid: string;
    subject: string;
    fromId: number;
}
export type MuteItemEntry = Selectable<MuteItem>;
export declare const tableName = "mute_item";
export type PartialDB = {
    [tableName]: MuteItem;
};
//# sourceMappingURL=mute_item.d.ts.map