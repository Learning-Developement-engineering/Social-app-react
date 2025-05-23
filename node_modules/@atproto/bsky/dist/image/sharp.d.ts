import { PassThrough, Readable } from 'node:stream';
import sharp from 'sharp';
import { ImageInfo, Options } from './util';
export type { Options };
/**
 * Scale up to hit any specified minimum size
 */
export declare function createImageUpscaler({ min }: Options): sharp.Sharp | PassThrough;
/**
 * Scale down (or possibly up if min is true) to desired size, then compress
 * to the desired format.
 */
export declare function createImageProcessor({ height, width, min, fit, format, quality, }: Options): sharp.Sharp;
export declare function maybeGetInfo(stream: Readable): Promise<ImageInfo | null>;
export declare function getInfo(stream: Readable): Promise<ImageInfo>;
//# sourceMappingURL=sharp.d.ts.map