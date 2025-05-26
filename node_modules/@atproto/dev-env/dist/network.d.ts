import { TestBsky } from './bsky';
import { IntrospectServer } from './introspect';
import { TestNetworkNoAppView } from './network-no-appview';
import { TestOzone } from './ozone';
import { TestPds } from './pds';
import { TestPlc } from './plc';
import { TestServerParams } from './types';
export declare class TestNetwork extends TestNetworkNoAppView {
    plc: TestPlc;
    pds: TestPds;
    bsky: TestBsky;
    ozone: TestOzone;
    introspect?: IntrospectServer | undefined;
    constructor(plc: TestPlc, pds: TestPds, bsky: TestBsky, ozone: TestOzone, introspect?: IntrospectServer | undefined);
    static create(params?: Partial<TestServerParams>): Promise<TestNetwork>;
    processFullSubscription(timeout?: number): Promise<void>;
    processAll(timeout?: number): Promise<void>;
    serviceHeaders(did: string, lxm: string, aud?: string): Promise<{
        authorization: string;
    }>;
    adminHeaders({ username, password, }: {
        username?: string;
        password?: string;
    }): Promise<{
        authorization: string;
    }>;
    close(): Promise<void>;
}
//# sourceMappingURL=network.d.ts.map