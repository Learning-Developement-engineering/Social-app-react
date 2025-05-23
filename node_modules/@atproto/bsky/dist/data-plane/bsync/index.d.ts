import http from 'node:http';
import { Database } from '../server/db';
export declare class MockBsync {
    server: http.Server;
    constructor(server: http.Server);
    static create(db: Database, port: number): Promise<MockBsync>;
    destroy(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map