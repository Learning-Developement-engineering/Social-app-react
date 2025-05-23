import { Database } from './db';
export declare const getSigningKeyId: (db: Database, signingKey: string) => Promise<number>;
export declare const RETRYABLE_HTTP_STATUS_CODES: Set<number>;
export declare const retryHttp: <T>(fn: () => Promise<T>, opts?: import("@atproto/common").RetryOptions) => Promise<T>;
export type ParsedLabelers = {
    dids: string[];
    redact: Set<string>;
};
export declare const LABELER_HEADER_NAME = "atproto-accept-labelers";
export declare const parseLabelerHeader: (header: string | undefined, ignoreDid?: string) => ParsedLabelers | null;
export declare const defaultLabelerHeader: (dids: string[]) => ParsedLabelers;
export declare const formatLabelerHeader: (parsed: ParsedLabelers) => string;
/**
 * Utility function similar to `setInterval()`. The main difference is that the
 * execution is controlled through a signal and that the function will wait for
 * `interval` milliseconds *between* the end of the previous execution and the
 * start of the next one (instead of starting the execution every `interval`
 * milliseconds), ensuring that the function is not running concurrently.
 *
 * @param fn The function to execute. That function must not throw any error
 * other than {@link signal}'s {@link AbortSignal.reason} or an {@link Error}
 * that has the {@link signal}'s {@link AbortSignal.reason} as its
 * {@link Error.cause}.
 *
 * @returns A promise that resolves when the signal is aborted, and the last
 * execution is done.
 *
 * @throws {AbortSignal['reason']} if the {@link signal} is already aborted.
 * @throws {TypeError} if {@link fn} throws an unexpected error (with the
 * unexpected error as the {@link Error.cause}).
 */
export declare function startInterval(fn: (signal: AbortSignal) => void | Promise<void>, interval: number, signal: AbortSignal, runImmediately?: boolean): Promise<void>;
/**
 * Determines whether the cause of an error is a signal's reason
 */
export declare function isCausedBySignal(err: unknown, signal: AbortSignal): boolean;
/**
 * Creates an AbortController that will be aborted when any of the given signals
 * is aborted.
 *
 * @note Make sure to call `abortController.abort()` when you are done with
 * the controller to avoid memory leaks.
 *
 * @throws if any of the input signals is already aborted.
 */
export declare function boundAbortController(...signals: readonly (AbortSignal | undefined | null)[]): AbortController;
//# sourceMappingURL=util.d.ts.map