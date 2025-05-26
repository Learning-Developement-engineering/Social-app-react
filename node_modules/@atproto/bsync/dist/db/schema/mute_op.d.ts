import { GeneratedAlways, Selectable } from 'kysely';
import { MuteOperation_Type } from '../../proto/bsync_pb';
export interface MuteOp {
    id: GeneratedAlways<number>;
    type: MuteOperation_Type;
    actorDid: string;
    subject: string;
    createdAt: GeneratedAlways<Date>;
}
export type MuteOpEntry = Selectable<MuteOp>;
export declare const tableName = "mute_op";
export type PartialDB = {
    [tableName]: MuteOp;
};
export declare const createMuteOpChannel = "mute_op_create";
//# sourceMappingURL=mute_op.d.ts.map