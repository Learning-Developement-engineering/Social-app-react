import { AsyncBuffer } from '@atproto/common';
import { LabelsEvt, Sequencer } from './sequencer';
export type OutboxOpts = {
    maxBufferSize: number;
};
export declare class Outbox {
    sequencer: Sequencer;
    private caughtUp;
    lastSeen: number;
    cutoverBuffer: LabelsEvt[];
    outBuffer: AsyncBuffer<LabelsEvt>;
    constructor(sequencer: Sequencer, opts?: Partial<OutboxOpts>);
    events(backfillCursor?: number, signal?: AbortSignal): AsyncGenerator<LabelsEvt>;
    getBackfill(backfillCursor: number): AsyncGenerator<LabelsEvt, void, unknown>;
}
//# sourceMappingURL=outbox.d.ts.map