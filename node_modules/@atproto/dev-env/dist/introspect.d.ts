import http from 'node:http';
import { TestBsky } from './bsky';
import { TestOzone } from './ozone';
import { TestPds } from './pds';
import { TestPlc } from './plc';
export declare class IntrospectServer {
    port: number;
    server: http.Server;
    constructor(port: number, server: http.Server);
    static start(port: number, plc: TestPlc, pds: TestPds, bsky: TestBsky, ozone: TestOzone): Promise<IntrospectServer>;
    close(): Promise<void>;
}
//# sourceMappingURL=introspect.d.ts.map