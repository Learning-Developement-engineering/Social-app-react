import { Readable } from 'node:stream';
import { IdResolver } from '@atproto/identity';
import { BlobDivertConfig } from '../config';
import { Database } from '../db';
export declare class BlobDiverter {
    db: Database;
    serviceConfig: BlobDivertConfig;
    idResolver: IdResolver;
    constructor(db: Database, services: {
        idResolver: IdResolver;
        serviceConfig: BlobDivertConfig;
    });
    /**
     * @throws {XRPCError} so that retryHttp can handle retries
     */
    getBlob(options: GetBlobOptions): Promise<Blob>;
    /**
     * @throws {XRPCError} so that retryHttp can handle retries
     */
    uploadBlob(blob: Blob, report: ReportBlobOptions): Promise<void>;
    uploadBlobOnService({ subjectDid: did, subjectUri: uri, subjectBlobCids, }: {
        subjectDid: string;
        subjectUri: string | null;
        subjectBlobCids: string[];
    }): Promise<void>;
}
type Blob = {
    type: string;
    stream: Readable;
};
type GetBlobOptions = {
    pds: string;
    did: string;
    cid: string;
};
type ReportBlobOptions = {
    did: string;
    uri: string | null;
};
export {};
//# sourceMappingURL=blob-diverter.d.ts.map