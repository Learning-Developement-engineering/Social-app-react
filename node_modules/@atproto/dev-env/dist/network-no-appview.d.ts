import { SkeletonHandler } from '@atproto/pds';
import { TestFeedGen } from './feed-gen';
import { TestPds } from './pds';
import { TestPlc } from './plc';
import { SeedClient } from './seed/client';
import { TestServerParams } from './types';
export declare class TestNetworkNoAppView {
    plc: TestPlc;
    pds: TestPds;
    feedGens: TestFeedGen[];
    constructor(plc: TestPlc, pds: TestPds);
    static create(params?: Partial<TestServerParams>): Promise<TestNetworkNoAppView>;
    createFeedGen(feeds: Record<string, SkeletonHandler>): Promise<TestFeedGen>;
    getSeedClient(): SeedClient<typeof this>;
    processAll(): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=network-no-appview.d.ts.map