import { Selectable } from 'kysely';
import { PoolClient } from 'pg';
import TypedEmitter from 'typed-emitter';
import { Database } from '../db';
import { Label as LabelTable } from '../db/schema/label';
import { Labels as LabelsEvt } from '../lexicon/types/com/atproto/label/subscribeLabels';
import { ModerationService } from '../mod-service';
export type { Labels as LabelsEvt } from '../lexicon/types/com/atproto/label/subscribeLabels';
type LabelRow = Selectable<LabelTable>;
declare const Sequencer_base: new () => SequencerEmitter;
export declare class Sequencer extends Sequencer_base {
    modSrvc: ModerationService;
    lastSeen: number;
    db: Database;
    destroyed: boolean;
    pollPromise: Promise<void> | undefined;
    queued: boolean;
    conn: PoolClient | undefined;
    constructor(modSrvc: ModerationService, lastSeen?: number);
    start(): Promise<void>;
    destroy(): Promise<void>;
    curr(): Promise<number | null>;
    next(cursor: number): Promise<LabelRow | null>;
    requestLabelRange(opts: {
        earliestId?: number;
        limit?: number;
    }): Promise<LabelsEvt[]>;
    private poll;
}
type SequencerEvents = {
    events: (evts: LabelsEvt[]) => void;
    close: () => void;
};
export type SequencerEmitter = TypedEmitter<SequencerEvents>;
//# sourceMappingURL=sequencer.d.ts.map