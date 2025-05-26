import http from 'node:http';
import express from 'express';
import { OzoneConfig, OzoneSecrets } from './config';
import { AppContext, AppContextOptions } from './context';
export * from './config';
export { type ImageInvalidator } from './image-invalidator';
export { Database } from './db';
export { EventPusher, EventReverser, OzoneDaemon } from './daemon';
export { AppContext } from './context';
export { httpLogger } from './logger';
export declare class OzoneService {
    ctx: AppContext;
    app: express.Application;
    server?: http.Server;
    private terminator?;
    private dbStatsInterval?;
    constructor(opts: {
        ctx: AppContext;
        app: express.Application;
    });
    static create(cfg: OzoneConfig, secrets: OzoneSecrets, overrides?: Partial<AppContextOptions>): Promise<OzoneService>;
    seedInitialMembers(): Promise<void>;
    start(): Promise<http.Server>;
    destroy(): Promise<void>;
}
export default OzoneService;
//# sourceMappingURL=index.d.ts.map