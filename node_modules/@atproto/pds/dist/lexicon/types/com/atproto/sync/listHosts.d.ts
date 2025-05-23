/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { type ValidationResult } from '@atproto/lexicon';
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server';
import type * as ComAtprotoSyncDefs from './defs.js';
export interface QueryParams {
    limit: number;
    cursor?: string;
}
export type InputSchema = undefined;
export interface OutputSchema {
    cursor?: string;
    /** Sort order is not formally specified. Recommended order is by time host was first seen by the server, with oldest first. */
    hosts: Host[];
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
export interface Host {
    $type?: 'com.atproto.sync.listHosts#host';
    /** hostname of server; not a URL (no scheme) */
    hostname: string;
    /** Recent repo stream event sequence number. May be delayed from actual stream processing (eg, persisted cursor not in-memory cursor). */
    seq?: number;
    accountCount?: number;
    status?: ComAtprotoSyncDefs.HostStatus;
}
export declare function isHost<V>(v: V): v is import("../../../../util").$TypedObject<V, "com.atproto.sync.listHosts", "host">;
export declare function validateHost<V>(v: V): ValidationResult<Host & V>;
//# sourceMappingURL=listHosts.d.ts.map