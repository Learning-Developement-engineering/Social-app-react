"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequencer = void 0;
const node_events_1 = __importDefault(require("node:events"));
const label_1 = require("../db/schema/label");
const logger_1 = require("../logger");
class Sequencer extends node_events_1.default {
    constructor(modSrvc, lastSeen = 0) {
        super();
        Object.defineProperty(this, "modSrvc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: modSrvc
        });
        Object.defineProperty(this, "lastSeen", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: lastSeen
        });
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "destroyed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "pollPromise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "queued", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "conn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = modSrvc.db;
        // note: this does not err when surpassed, just prints a warning to stderr
        this.setMaxListeners(100);
    }
    async start() {
        const curr = await this.curr();
        this.lastSeen = curr ?? 0;
        this.poll();
        this.conn = await this.db.pool.connect();
        this.conn.query(`listen ${label_1.LabelChannel}`); // if this errors, unhandled rejection should cause process to exit
        this.conn.on('notification', (notif) => {
            if (notif.channel === label_1.LabelChannel) {
                this.poll();
            }
        });
    }
    async destroy() {
        if (this.destroyed)
            return;
        this.destroyed = true;
        if (this.conn) {
            this.conn.release();
            this.conn = undefined;
        }
        if (this.pollPromise) {
            await this.pollPromise;
        }
        this.emit('close');
    }
    async curr() {
        const got = await this.db.db
            .selectFrom('label')
            .selectAll()
            .orderBy('id', 'desc')
            .limit(1)
            .executeTakeFirst();
        return got?.id ?? null;
    }
    async next(cursor) {
        const got = await this.db.db
            .selectFrom('label')
            .selectAll()
            .where('id', '>', cursor)
            .limit(1)
            .orderBy('id', 'asc')
            .executeTakeFirst();
        return got || null;
    }
    async requestLabelRange(opts) {
        const { earliestId, limit } = opts;
        let seqQb = this.db.db.selectFrom('label').selectAll().orderBy('id', 'asc');
        if (earliestId !== undefined) {
            seqQb = seqQb.where('id', '>', earliestId);
        }
        if (limit !== undefined) {
            seqQb = seqQb.limit(limit);
        }
        const rows = await seqQb.execute();
        if (rows.length < 1) {
            return [];
        }
        const evts = await Promise.all(rows.map(async (row) => {
            const formatted = await this.modSrvc.views.formatLabelAndEnsureSig(row);
            return { seq: row.id, labels: [formatted] };
        }));
        return evts;
    }
    poll() {
        if (this.destroyed)
            return;
        if (this.pollPromise) {
            this.queued = true;
            return;
        }
        this.queued = false;
        this.pollPromise = this.requestLabelRange({
            earliestId: this.lastSeen,
            limit: 500,
        })
            .then((evts) => {
            this.emit('events', evts);
            this.lastSeen = evts.at(-1)?.seq ?? this.lastSeen;
            if (evts.length > 0) {
                this.queued = true;
            }
        })
            .catch((err) => {
            logger_1.seqLogger.error({ err, lastSeen: this.lastSeen }, 'sequencer failed to poll db');
        })
            .finally(() => {
            this.pollPromise = undefined;
            if (this.queued) {
                this.poll();
            }
        });
    }
}
exports.Sequencer = Sequencer;
//# sourceMappingURL=sequencer.js.map