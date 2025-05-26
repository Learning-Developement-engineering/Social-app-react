import http from 'node:http';
import express from 'express';
import { Keypair } from '@atproto/crypto';
import { ServerConfig } from './config';
import { AppContext } from './context';
export { ServerConfig } from './config';
export type { ServerConfigValues } from './config';
export { AppContext } from './context';
export * from './data-plane';
export { BackgroundQueue } from './data-plane/server/background';
export { Database } from './data-plane/server/db';
export { Redis } from './redis';
export declare class BskyAppView {
    ctx: AppContext;
    app: express.Application;
    server?: http.Server;
    private terminator?;
    constructor(opts: {
        ctx: AppContext;
        app: express.Application;
    });
    static create(opts: {
        config: ServerConfig;
        signingKey: Keypair;
    }): BskyAppView;
    start(): Promise<http.Server>;
    destroy(): Promise<void>;
}
export default BskyAppView;
//# sourceMappingURL=index.d.ts.map