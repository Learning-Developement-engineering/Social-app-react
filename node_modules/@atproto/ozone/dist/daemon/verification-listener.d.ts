import { BackgroundQueue } from '../background';
import { Database } from '../db';
type VerificationRecord = {
    subject: string;
    handle: string;
    displayName: string;
    createdAt: string;
};
export declare class VerificationListener {
    private db;
    private jetstreamUrl;
    private verifierIssuersToIndex?;
    destroyed: boolean;
    private cursor?;
    private jetstream;
    private collection;
    backgroundQueue: BackgroundQueue;
    private verificationService;
    constructor(db: Database, jetstreamUrl: string, verifierIssuersToIndex?: string[] | undefined);
    ensureCoolDown(): Promise<boolean>;
    handleNewVerification(issuer: string, uri: string, cid: string, record: VerificationRecord, cursor: number): void;
    handleDeletedVerification(uri: string, cursor: number): void;
    getCursor(): Promise<number | undefined>;
    updateCursor(cursor: number): Promise<void>;
    start(): Promise<void>;
    stop(): void;
}
export {};
//# sourceMappingURL=verification-listener.d.ts.map