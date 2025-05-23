"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventReverser = void 0;
const common_1 = require("@atproto/common");
const logger_1 = require("../logger");
class EventReverser {
    constructor(db, modService) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
        Object.defineProperty(this, "modService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: modService
        });
        Object.defineProperty(this, "destroyed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "reversalPromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Promise.resolve()
        });
        Object.defineProperty(this, "timer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    start() {
        this.poll();
    }
    poll() {
        if (this.destroyed)
            return;
        this.reversalPromise = this.findAndRevertDueActions()
            .catch((err) => logger_1.dbLogger.error({ err }, 'moderation action reversal errored'))
            .finally(() => {
            this.timer = setTimeout(() => this.poll(), getInterval());
        });
    }
    async destroy() {
        this.destroyed = true;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
        await this.reversalPromise;
    }
    async revertState(subject) {
        await this.db.transaction(async (dbTxn) => {
            const moderationTxn = this.modService(dbTxn);
            const originalEvent = await moderationTxn.getLastReversibleEventForSubject(subject);
            if (originalEvent) {
                await moderationTxn.revertState({
                    action: originalEvent.action,
                    createdBy: originalEvent.createdBy,
                    comment: '[SCHEDULED_REVERSAL] Reverting action as originally scheduled',
                    subject: subject.subject,
                    createdAt: new Date(),
                });
            }
        });
    }
    async findAndRevertDueActions() {
        const moderationService = this.modService(this.db);
        const subjectsDueForReversal = await moderationService.getSubjectsDueForReversal();
        // We shouldn't have too many actions due for reversal at any given time, so running in parallel is probably fine
        // Internally, each reversal runs within its own transaction
        await Promise.all(subjectsDueForReversal.map(this.revertState.bind(this)));
    }
}
exports.EventReverser = EventReverser;
const getInterval = () => {
    // super basic synchronization by agreeing when the intervals land relative to unix timestamp
    const now = Date.now();
    const intervalMs = common_1.MINUTE;
    const nextIteration = Math.ceil(now / intervalMs);
    return nextIteration * intervalMs - now;
};
//# sourceMappingURL=event-reverser.js.map