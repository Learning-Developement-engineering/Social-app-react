/**
 * GENERATED CODE - DO NOT MODIFY
 */
import express from 'express';
import { type ValidationResult } from '@atproto/lexicon';
import { type $Typed } from '../../../../util';
import { HandlerAuth, HandlerPipeThrough } from '@atproto/xrpc-server';
export interface QueryParams {
    did: string;
    events?: 'accountCreated' | 'emailUpdated' | 'emailConfirmed' | 'passwordUpdated' | 'handleUpdated' | (string & {})[];
    cursor?: string;
    limit: number;
}
export type InputSchema = undefined;
export interface OutputSchema {
    cursor?: string;
    events: Event[];
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
export interface Event {
    $type?: 'tools.ozone.hosting.getAccountHistory#event';
    details: $Typed<AccountCreated> | $Typed<EmailUpdated> | $Typed<EmailConfirmed> | $Typed<PasswordUpdated> | $Typed<HandleUpdated> | {
        $type: string;
    };
    createdBy: string;
    createdAt: string;
}
export declare function isEvent<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.hosting.getAccountHistory", "event">;
export declare function validateEvent<V>(v: V): ValidationResult<Event & V>;
export interface AccountCreated {
    $type?: 'tools.ozone.hosting.getAccountHistory#accountCreated';
    email?: string;
    handle?: string;
}
export declare function isAccountCreated<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.hosting.getAccountHistory", "accountCreated">;
export declare function validateAccountCreated<V>(v: V): ValidationResult<AccountCreated & V>;
export interface EmailUpdated {
    $type?: 'tools.ozone.hosting.getAccountHistory#emailUpdated';
    email: string;
}
export declare function isEmailUpdated<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.hosting.getAccountHistory", "emailUpdated">;
export declare function validateEmailUpdated<V>(v: V): ValidationResult<EmailUpdated & V>;
export interface EmailConfirmed {
    $type?: 'tools.ozone.hosting.getAccountHistory#emailConfirmed';
    email: string;
}
export declare function isEmailConfirmed<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.hosting.getAccountHistory", "emailConfirmed">;
export declare function validateEmailConfirmed<V>(v: V): ValidationResult<EmailConfirmed & V>;
export interface PasswordUpdated {
    $type?: 'tools.ozone.hosting.getAccountHistory#passwordUpdated';
}
export declare function isPasswordUpdated<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.hosting.getAccountHistory", "passwordUpdated">;
export declare function validatePasswordUpdated<V>(v: V): ValidationResult<PasswordUpdated & V>;
export interface HandleUpdated {
    $type?: 'tools.ozone.hosting.getAccountHistory#handleUpdated';
    handle: string;
}
export declare function isHandleUpdated<V>(v: V): v is import("../../../../util").$TypedObject<V, "tools.ozone.hosting.getAccountHistory", "handleUpdated">;
export declare function validateHandleUpdated<V>(v: V): ValidationResult<HandleUpdated & V>;
//# sourceMappingURL=getAccountHistory.d.ts.map