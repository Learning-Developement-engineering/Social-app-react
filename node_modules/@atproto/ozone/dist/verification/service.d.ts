import { Selectable } from 'kysely';
import { $Typed, AppBskyActorDefs, ToolsOzoneModerationDefs, ToolsOzoneVerificationDefs } from '@atproto/api';
import { Database } from '../db';
import { Verification } from '../db/schema/verification';
export type VerificationServiceCreator = (db: Database) => VerificationService;
export declare class VerificationService {
    db: Database;
    constructor(db: Database);
    static creator(): (db: Database) => VerificationService;
    create(verifications: Pick<Verification, 'uri' | 'issuer' | 'subject' | 'handle' | 'displayName' | 'createdAt' | 'cid'>[]): Promise<Selectable<Verification>[]>;
    markRevoked({ uris, revokedBy, revokedAt, revokeReason, }: {
        uris: string[];
        revokedBy?: string;
        revokedAt?: string;
        revokeReason?: string;
    }): Promise<import("kysely").UpdateResult[] | undefined>;
    list({ sortDirection, cursor, createdAfter, createdBefore, issuers, subjects, isRevoked, limit, }: {
        sortDirection?: 'asc' | 'desc';
        cursor?: string;
        createdAfter?: string;
        createdBefore?: string;
        issuers?: string[];
        subjects?: string[];
        isRevoked?: boolean;
        limit?: number;
    }): Promise<{
        verifications: {
            createdAt: string;
            updatedAt: string;
            uri: string;
            cid: string;
            subject: string;
            handle: string;
            displayName: string;
            issuer: string;
            revokeReason: string | null;
            revokedAt: string | null;
            revokedBy: string | null;
        }[];
        cursor: string | undefined;
    }>;
    view(verifications: Selectable<Verification>[], repos: Map<string, $Typed<ToolsOzoneModerationDefs.RepoViewDetail> | $Typed<ToolsOzoneModerationDefs.RepoViewNotFound>>, profiles: Map<string, AppBskyActorDefs.ProfileViewDetailed>): $Typed<ToolsOzoneVerificationDefs.VerificationView>[];
    getFirehoseCursor(): Promise<number | null>;
    createFirehoseCursor(): Promise<import("kysely").InsertResult[]>;
    updateFirehoseCursor(cursor: number): Promise<number | null | undefined>;
}
//# sourceMappingURL=service.d.ts.map