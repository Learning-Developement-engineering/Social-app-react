/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server';
import type * as ToolsOzoneVerificationDefs from './defs.js';
export interface QueryParams {
    /** Pagination cursor */
    cursor?: string;
    /** Maximum number of results to return */
    limit: number;
    /** Filter to verifications created after this timestamp */
    createdAfter?: string;
    /** Filter to verifications created before this timestamp */
    createdBefore?: string;
    /** Filter to verifications from specific issuers */
    issuers?: string[];
    /** Filter to specific verified DIDs */
    subjects?: string[];
    /** Sort direction for creation date */
    sortDirection: 'asc' | 'desc';
    /** Filter to verifications that are revoked or not. By default, includes both. */
    isRevoked?: boolean;
}
export type InputSchema = undefined;
export interface OutputSchema {
    cursor?: string;
    verifications: ToolsOzoneVerificationDefs.VerificationView[];
}
export type HandlerInput = undefined;
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
//# sourceMappingURL=listVerifications.d.ts.map