import http from 'node:http';
import { SkeletonHandler } from '@atproto/pds';
export declare class TestFeedGen {
    port: number;
    server: http.Server;
    did: string;
    destroyed: boolean;
    constructor(port: number, server: http.Server, did: string);
    static create(plcUrl: string, feeds: Record<string, SkeletonHandler>): Promise<TestFeedGen>;
    close(): Promise<void>;
}
//# sourceMappingURL=feed-gen.d.ts.map