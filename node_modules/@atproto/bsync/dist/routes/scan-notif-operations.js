"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_events_1 = require("node:events");
const notif_op_1 = require("../db/schema/notif_op");
const bsync_pb_1 = require("../proto/bsync_pb");
const auth_1 = require("./auth");
const util_1 = require("./util");
exports.default = (ctx) => ({
    async scanNotifOperations(req, handlerCtx) {
        (0, auth_1.authWithApiKey)(ctx, handlerCtx);
        const { db, events } = ctx;
        const limit = req.limit || 1000;
        const cursor = (0, util_1.validCursor)(req.cursor);
        const nextNotifOpPromise = (0, node_events_1.once)(events, notif_op_1.createNotifOpChannel, {
            signal: (0, util_1.combineSignals)(ctx.shutdown, AbortSignal.timeout(ctx.cfg.service.longPollTimeoutMs)),
        });
        nextNotifOpPromise.catch(() => null); // ensure timeout is always handled
        const nextNotifOpPageQb = db.db
            .selectFrom('notif_op')
            .selectAll()
            .where('id', '>', cursor ?? -1)
            .orderBy('id', 'asc')
            .limit(limit);
        let ops = await nextNotifOpPageQb.execute();
        if (!ops.length) {
            // if there were no ops on the page, wait for an event then try again.
            try {
                await nextNotifOpPromise;
            }
            catch (err) {
                ctx.shutdown.throwIfAborted();
                return new bsync_pb_1.ScanNotifOperationsResponse({
                    operations: [],
                    cursor: req.cursor,
                });
            }
            ops = await nextNotifOpPageQb.execute();
            if (!ops.length) {
                return new bsync_pb_1.ScanNotifOperationsResponse({
                    operations: [],
                    cursor: req.cursor,
                });
            }
        }
        const lastOp = ops[ops.length - 1];
        return new bsync_pb_1.ScanNotifOperationsResponse({
            operations: ops.map((op) => ({
                id: op.id.toString(),
                actorDid: op.actorDid,
                priority: op.priority ?? undefined,
            })),
            cursor: lastOp.id.toString(),
        });
    },
});
//# sourceMappingURL=scan-notif-operations.js.map