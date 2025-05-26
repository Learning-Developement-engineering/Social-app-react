/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { type ValidationResult } from '@atproto/lexicon';
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server';
import type * as ToolsOzoneVerificationDefs from './defs.js';
export interface QueryParams {
}
export interface InputSchema {
    /** Array of verification requests to process */
    verifications: VerificationInput[];
}
export interface OutputSchema {
    verifications: ToolsOzoneVerificationDefs.VerificationView[];
    failedVerifications: GrantError[];
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
export interface VerificationInput {
    $type?: 'tools.ozone.verification.grantVerifications#verificationInput';
    /** The did of the subject being verified */
    subject: string;
    /** Handle of the subject the verification applies to at the moment of verifying. */
    handle: string;
    /** Display name of the subject the verification applies to at the moment of verifying. */
    displayName: string;
    /** Timestamp for verification record. Defaults to current time when not specified. */
    createdAt?: string;
}
export declare function isVerificationInput<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.verification.grantVerifications", "verificationInput">;
export declare function validateVerificationInput<V>(v: V): ValidationResult<VerificationInput & V>;
/** Error object for failed verifications. */
export interface GrantError {
    $type?: 'tools.ozone.verification.grantVerifications#grantError';
    /** Error message describing the reason for failure. */
    error: string;
    /** The did of the subject being verified */
    subject: string;
}
export declare function isGrantError<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.verification.grantVerifications", "grantError">;
export declare function validateGrantError<V>(v: V): ValidationResult<GrantError & V>;
//# sourceMappingURL=grantVerifications.d.ts.map