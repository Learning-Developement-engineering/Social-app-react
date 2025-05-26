/**
 * Add items to a list, and mark those items as
 * completed. Upon item completion, get list of consecutive
 * items completed at the head of the list. Example:
 *
 * const consecutive = new ConsecutiveList<number>()
 * const item1 = consecutive.push(1)
 * const item2 = consecutive.push(2)
 * const item3 = consecutive.push(3)
 * item2.complete() // []
 * item1.complete() // [1, 2]
 * item3.complete() // [3]
 *
 */
export declare class ConsecutiveList<T> {
    list: ConsecutiveItem<T>[];
    push(value: T): ConsecutiveItem<T>;
    complete(): T[];
}
export declare class ConsecutiveItem<T> {
    private consecutive;
    value: T;
    isComplete: boolean;
    constructor(consecutive: ConsecutiveList<T>, value: T);
    complete(): T[];
}
//# sourceMappingURL=consecutive-list.d.ts.map