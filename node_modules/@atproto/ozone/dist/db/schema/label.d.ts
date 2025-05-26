import { Generated, Selectable } from 'kysely';
export declare const tableName = "label";
export interface Label {
    id: Generated<number>;
    src: string;
    uri: string;
    cid: string;
    val: string;
    neg: boolean;
    cts: string;
    exp: string | null;
    sig: Buffer | null;
    signingKeyId: number | null;
}
export type LabelRow = Selectable<Label>;
export type PartialDB = {
    [tableName]: Label;
};
export declare const LabelChannel = "label_channel";
//# sourceMappingURL=label.d.ts.map