"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsecutiveItem = exports.ConsecutiveList = void 0;
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
class ConsecutiveList {
    constructor() {
        Object.defineProperty(this, "list", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    push(value) {
        const item = new ConsecutiveItem(this, value);
        this.list.push(item);
        return item;
    }
    complete() {
        let i = 0;
        while (this.list[i]?.isComplete) {
            i += 1;
        }
        return this.list.splice(0, i).map((item) => item.value);
    }
}
exports.ConsecutiveList = ConsecutiveList;
class ConsecutiveItem {
    constructor(consecutive, value) {
        Object.defineProperty(this, "consecutive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: consecutive
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
        });
        Object.defineProperty(this, "isComplete", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    complete() {
        this.isComplete = true;
        return this.consecutive.complete();
    }
}
exports.ConsecutiveItem = ConsecutiveItem;
//# sourceMappingURL=consecutive-list.js.map