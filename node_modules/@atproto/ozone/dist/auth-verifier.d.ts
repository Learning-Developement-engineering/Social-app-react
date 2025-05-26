import express from 'express';
import { IdResolver } from '@atproto/identity';
import { TeamService } from './team';
type ReqCtx = {
    req: express.Request;
};
export type AdminTokenOutput = {
    credentials: {
        type: 'admin_token';
        isAdmin: true;
        isModerator: true;
        isTriage: true;
        isVerifier: true;
    };
};
export type ModeratorOutput = {
    credentials: {
        type: 'moderator';
        aud: string;
        iss: string;
        isAdmin: boolean;
        isModerator: boolean;
        isTriage: boolean;
        isVerifier: boolean;
    };
};
type StandardOutput = {
    credentials: {
        type: 'standard';
        aud: string;
        iss: string;
        isAdmin: boolean;
        isModerator: boolean;
        isTriage: boolean;
        isVerifier: boolean;
    };
};
type NullOutput = {
    credentials: {
        type: 'none';
        iss: null;
    };
};
export type AuthVerifierOpts = {
    serviceDid: string;
    adminPassword: string;
    teamService: TeamService;
};
export declare class AuthVerifier {
    idResolver: IdResolver;
    serviceDid: string;
    teamService: TeamService;
    private adminPassword;
    constructor(idResolver: IdResolver, opts: AuthVerifierOpts);
    modOrAdminToken: (reqCtx: ReqCtx) => Promise<ModeratorOutput | AdminTokenOutput>;
    moderator: (reqCtx: ReqCtx) => Promise<ModeratorOutput>;
    standard: (reqCtx: ReqCtx) => Promise<StandardOutput>;
    standardOptional: (reqCtx: ReqCtx) => Promise<StandardOutput | NullOutput>;
    standardOptionalOrAdminToken: (reqCtx: ReqCtx) => Promise<StandardOutput | AdminTokenOutput | NullOutput>;
    adminToken: (reqCtx: ReqCtx) => Promise<AdminTokenOutput>;
    nullCreds(): NullOutput;
}
export declare const getJwtStrFromReq: (req: express.Request) => string | null;
export declare const parseBasicAuth: (token: string) => {
    username: string;
    password: string;
} | null;
export {};
//# sourceMappingURL=auth-verifier.d.ts.map