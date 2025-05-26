import * as bsync from '@atproto/bsync';
import { BsyncConfig } from './types';
export declare class TestBsync {
    url: string;
    port: number;
    service: bsync.BsyncService;
    constructor(url: string, port: number, service: bsync.BsyncService);
    static create(cfg: BsyncConfig): Promise<TestBsync>;
    get ctx(): bsync.AppContext;
    close(): Promise<void>;
}
//# sourceMappingURL=bsync.d.ts.map