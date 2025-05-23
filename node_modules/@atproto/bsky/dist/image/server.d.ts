import fsSync from 'node:fs';
import { Readable } from 'node:stream';
import { AppContext } from '../context';
import { Middleware } from '../util/http';
export declare function createMiddleware(ctx: AppContext, { prefix }?: {
    prefix?: string;
}): Middleware;
export interface BlobCache {
    get(fileId: string): Promise<Readable & {
        size: number;
    }>;
    put(fileId: string, stream: Readable): Promise<void>;
    clear(fileId: string): Promise<void>;
    clearAll(): Promise<void>;
}
export declare class BlobDiskCache implements BlobCache {
    tempDir: string;
    constructor(basePath?: string);
    get(fileId: string): Promise<fsSync.ReadStream & {
        size: number;
    }>;
    put(fileId: string, stream: Readable): Promise<void>;
    clear(fileId: string): Promise<void>;
    clearAll(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map