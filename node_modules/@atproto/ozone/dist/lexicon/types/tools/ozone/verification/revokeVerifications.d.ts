/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { type ValidationResult } from '@atproto/lexicon';
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server';
export interface QueryParams {
}
export interface InputSchema {
    /** Array of verification record uris to revoke */
    uris: string[];
    /** Reason for revoking the verification. This is optional and can be omitted if not needed. */
    revokeReason?: string;
}
export interface OutputSchema {
    /** List of verification uris successfully revoked */
    revokedVerifications: string[];
    /** List of verification uris that couldn't be revoked, including failure reasons */
    failedRevocations: RevokeError[];
}
export interface HandlerInput {
    encoding: 'application/json';
    body: InputSchema;
}
export interface HandlerSuccess {
    encoding: 'application/json';
    body: OutputSchema;
    headers?: {
        [key: string]: string;
    };
}
export interface HandlerError {
    status: number;
    message?: string;
}
export type HandlerOutput = HandlerError | HandlerSuccess | HandlerPipeThrough;
export type HandlerReqCtx<HA extends HandlerAuth = never> = {
    auth: HA;
    params: QueryParams;
    input: HandlerInput;
    req: express.Request;
    res: express.Response;
    resetRouteRateLimits: () => Promise<void>;
};
export type Handler<HA extends HandlerAuth = never> = (ctx: HandlerReqCtx<HA>) => Promise<HandlerOutput> | HandlerOutput;
/** Error object for failed revocations */
export interface RevokeError {
    $type?: 'tools.ozone.verification.revokeVerifications#revokeError';
    /** The AT-URI of the verification record that failed to revoke. */
    uri: string;
    /** Description of the error that occurred during revocation. */
    error: string;
}
export declare function isRevokeError<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.verification.revokeVerifications", "revokeError">;
export declare function validateRevokeError<V>(v: V): ValidationResult<RevokeError & V>;
//# sourceMappingURL=revokeVerifications.d.ts.map