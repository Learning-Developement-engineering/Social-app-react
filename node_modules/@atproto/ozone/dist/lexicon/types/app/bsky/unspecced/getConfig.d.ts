/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { type ValidationResult } from '@atproto/lexicon';
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server';
export interface QueryParams {
}
export type InputSchema = undefined;
export interface OutputSchema {
    checkEmailConfirmed?: boolean;
    liveNow?: LiveNowConfig[];
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
export interface LiveNowConfig {
    $type?: 'app.bsky.unspecced.getConfig#liveNowConfig';
    did: string;
    domains: string[];
}
export declare function isLiveNowConfig<V>(v: V): v is import("../../../../util").$TypedObject<V, "app.bsky.unspecced.getConfig", "liveNowConfig">;
export declare function validateLiveNowConfig<V>(v: V): ValidationResult<LiveNowConfig & V>;
//# sourceMappingURL=getConfig.d.ts.map