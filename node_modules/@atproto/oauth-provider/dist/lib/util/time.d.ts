import { Awaitable } from './type.js';
export declare function onOvertimeDefault(options: {
    start: number;
    end: number;
    elapsed: number;
    time: number;
}): void;
/**
 * Utility function to protect against timing attacks.
 */
export declare function constantTime<R>(time: number, fn: () => Awaitable<R>, onOvertime?: typeof onOvertimeDefault): Promise<R>;
//# sourceMappingURL=time.d.ts.map