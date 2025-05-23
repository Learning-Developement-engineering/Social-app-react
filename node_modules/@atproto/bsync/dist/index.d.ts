import http from 'node:http';
import { ServerConfig } from './config';
import { AppContext, AppContextOptions } from './context';
export * from './config';
export * from './client';
export { Database } from './db';
export { AppContext } from './context';
export { httpLogger } from './logger';
export declare class BsyncService {
    ctx: AppContext;
    server: http.Server;
    private ac;
    private terminator;
    private dbStatsInterval?;
    constructor(opts: {
        ctx: AppContext;
        server: http.Server;
        ac: AbortController;
    });
    static create(cfg: ServerConfig, overrides?: Partial<AppContextOptions>): Promise<BsyncService>;
    start(): Promise<http.Server>;
    destroy(): Promise<void>;
    setupAppEvents(): Promise<void>;
}
export default BsyncService;
//# sourceMappingURL=index.d.ts.map