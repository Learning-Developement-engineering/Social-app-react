import { BlobCache } from './server';
export interface ImageInvalidator {
    invalidate(subject: string, paths: string[]): Promise<void>;
}
export declare class ImageProcessingServerInvalidator implements ImageInvalidator {
    private cache;
    constructor(cache: BlobCache);
    invalidate(_subject: string, paths: string[]): Promise<void>;
}
//# sourceMappingURL=invalidator.d.ts.map