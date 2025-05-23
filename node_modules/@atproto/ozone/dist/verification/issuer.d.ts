import { Selectable } from 'kysely';
import { Agent } from '@atproto/api';
import { VerifierConfig } from '../config';
import { Verification } from '../db/schema/verification';
export type VerificationInput = {
    displayName: string;
    handle: string;
    subject: string;
    createdAt?: string;
};
export type VerificationIssuerCreator = (verifierConfig: VerifierConfig) => VerificationIssuer;
export declare class VerificationIssuer {
    private verifierConfig;
    private session;
    private agent;
    constructor(verifierConfig: VerifierConfig);
    static creator(): (verifierConfig: VerifierConfig) => VerificationIssuer;
    getAgent(): Promise<Agent>;
    verify(verifications: VerificationInput[]): Promise<{
        grantedVerifications: Selectable<Verification>[];
        failedVerifications: {
            $type: "tools.ozone.verification.grantVerifications#grantError";
            subject: string;
            error: string;
        }[];
    }>;
    revoke({ uris }: {
        uris: string[];
    }): Promise<{
        revokedVerifications: string[];
        failedRevocations: {
            uri: string;
            error: string;
        }[];
    }>;
}
//# sourceMappingURL=issuer.d.ts.map