"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLabelerHeader = exports.defaultLabelerHeader = exports.parseLabelerHeader = exports.LABELER_HEADER_NAME = exports.retryHttp = exports.RETRYABLE_HTTP_STATUS_CODES = exports.getSigningKeyId = void 0;
exports.startInterval = startInterval;
exports.isCausedBySignal = isCausedBySignal;
exports.boundAbortController = boundAbortController;
const node_assert_1 = __importDefault(require("node:assert"));
const structured_headers_1 = require("structured-headers");
const common_1 = require("@atproto/common");
const xrpc_1 = require("@atproto/xrpc");
const getSigningKeyId = async (db, signingKey) => {
    const selectRes = await db.db
        .selectFrom('signing_key')
        .selectAll()
        .where('key', '=', signingKey)
        .executeTakeFirst();
    if (selectRes) {
        return selectRes.id;
    }
    const insertRes = await db.db
        .insertInto('signing_key')
        .values({ key: signingKey })
        .returningAll()
        .executeTakeFirstOrThrow();
    return insertRes.id;
};
exports.getSigningKeyId = getSigningKeyId;
exports.RETRYABLE_HTTP_STATUS_CODES = new Set([
    408, 425, 429, 500, 502, 503, 504, 522, 524,
]);
exports.retryHttp = (0, common_1.createRetryable)((err) => {
    if (err instanceof xrpc_1.XRPCError) {
        if (err.status === xrpc_1.ResponseType.Unknown)
            return true;
        return exports.RETRYABLE_HTTP_STATUS_CODES.has(err.status);
    }
    return false;
});
exports.LABELER_HEADER_NAME = 'atproto-accept-labelers';
const parseLabelerHeader = (header, ignoreDid) => {
    if (!header)
        return null;
    const labelerDids = new Set();
    const redactDids = new Set();
    const parsed = (0, structured_headers_1.parseList)(header);
    for (const item of parsed) {
        const did = item[0].toString();
        if (!did) {
            return null;
        }
        if (did === ignoreDid) {
            continue;
        }
        labelerDids.add(did);
        const redact = item[1].get('redact')?.valueOf();
        if (redact === true) {
            redactDids.add(did);
        }
    }
    return {
        dids: [...labelerDids],
        redact: redactDids,
    };
};
exports.parseLabelerHeader = parseLabelerHeader;
const defaultLabelerHeader = (dids) => {
    return {
        dids,
        redact: new Set(dids),
    };
};
exports.defaultLabelerHeader = defaultLabelerHeader;
const formatLabelerHeader = (parsed) => {
    const parts = parsed.dids.map((did) => parsed.redact.has(did) ? `${did};redact` : did);
    return parts.join(',');
};
exports.formatLabelerHeader = formatLabelerHeader;
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
async function startInterval(fn, interval, signal, runImmediately = false) {
    signal.throwIfAborted();
    // Renaming for clarity
    const inputSignal = signal;
    const intervalController = new AbortController();
    const intervalSignal = intervalController.signal;
    return new Promise((resolve, reject) => {
        let timer;
        const run = async () => {
            // Cloning the signal for this particular run to prevent memory leaks
            const runController = boundAbortController(intervalSignal);
            const runSignal = runController.signal;
            try {
                await fn(runSignal);
            }
            catch (err) {
                if (err != null && isCausedBySignal(err, runSignal)) {
                    // Silently ignore the error if it is caused by the signal. At this
                    // point, the interval controller was aborted, which will cause the
                    // promise to resolve in the "finally" block bellow.
                }
                else {
                    // Invalid behavior: stop the interval and reject the promise.
                    const error = new TypeError('Unexpected error', { cause: err });
                    // Rejecting here will make `resolve()` in the "finally" block to be a
                    // no-op. Rejecting before aborting the controller to ensure the
                    // promise does not get resolved by the `abort` event listeners.
                    reject(error);
                    // Using `error` as abort reason to avoid creating an AbortError.
                    intervalController.abort(error);
                }
            }
            finally {
                // Cleanup the listeners added by `boundAbortController`
                runController.abort();
                if (intervalSignal.aborted)
                    resolve();
                else
                    schedule();
            }
        };
        const schedule = () => {
            (0, node_assert_1.default)(timer === undefined, 'unexpected state');
            timer = setTimeout(() => {
                timer = undefined; // "running" state
                void run();
            }, interval);
        };
        inputSignal.addEventListener('abort', 
        // This function will only be called if the `inputSignal` is aborted
        // before the interval controller is aborted.
        () => {
            // Stop the interval, using the input signal's reason
            intervalController.abort(inputSignal.reason);
            if (timer === undefined) {
                // `fn` is currently running; `run`'s finally block will resolve the
                // promise.
            }
            else {
                // The execution was scheduled but not started yet. Clear the timer
                // and resolve the promise.
                clearTimeout(timer);
                resolve();
            }
        }, 
        // Remove the listener whenever the interval is aborted.
        { signal: intervalSignal });
        if (runImmediately)
            void run();
        else
            schedule();
    });
}
/**
 * Determines whether the cause of an error is a signal's reason
 */
function isCausedBySignal(err, signal) {
    if (!signal.aborted)
        return false;
    if (signal.reason == null)
        return false; // Ignore nullish reasons
    return (err === signal.reason ||
        (err instanceof Error && err.cause === signal.reason));
}
/**
 * Creates an AbortController that will be aborted when any of the given signals
 * is aborted.
 *
 * @note Make sure to call `abortController.abort()` when you are done with
 * the controller to avoid memory leaks.
 *
 * @throws if any of the input signals is already aborted.
 */
function boundAbortController(...signals) {
    for (const signal of signals) {
        signal?.throwIfAborted();
    }
    const abortController = new AbortController();
    const abort = function (event) {
        abortController.abort(event.target?.reason);
    };
    for (const signal of signals) {
        signal?.addEventListener('abort', abort, { signal: abortController.signal });
    }
    return abortController;
}
//# sourceMappingURL=util.js.map