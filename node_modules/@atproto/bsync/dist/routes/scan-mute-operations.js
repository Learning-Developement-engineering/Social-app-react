"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_events_1 = require("node:events");
const mute_op_1 = require("../db/schema/mute_op");
const bsync_pb_1 = require("../proto/bsync_pb");
const auth_1 = require("./auth");
const util_1 = require("./util");
exports.default = (ctx) => ({
    async scanMuteOperations(req, handlerCtx) {
        (0, auth_1.authWithApiKey)(ctx, handlerCtx);
        const { db, events } = ctx;
        const limit = req.limit || 1000;
        const cursor = (0, util_1.validCursor)(req.cursor);
        const nextMuteOpPromise = (0, node_events_1.once)(events, mute_op_1.createMuteOpChannel, {
            signal: (0, util_1.combineSignals)(ctx.shutdown, AbortSignal.timeout(ctx.cfg.service.longPollTimeoutMs)),
        });
        nextMuteOpPromise.catch(() => null); // ensure timeout is always handled
        const nextMuteOpPageQb = db.db
            .selectFrom('mute_op')
            .selectAll()
            .where('id', '>', cursor ?? -1)
            .orderBy('id', 'asc')
            .limit(limit);
        let ops = await nextMuteOpPageQb.execute();
        if (!ops.length) {
            // if there were no ops on the page, wait for an event then try again.
            try {
                await nextMuteOpPromise;
            }
            catch (err) {
                ctx.shutdown.throwIfAborted();
                return new bsync_pb_1.ScanMuteOperationsResponse({
                    operations: [],
                    cursor: req.cursor,
                });
            }
            ops = await nextMuteOpPageQb.execute();
            if (!ops.length) {
                return new bsync_pb_1.ScanMuteOperationsResponse({
                    operations: [],
                    cursor: req.cursor,
                });
            }
        }
        const lastOp = ops[ops.length - 1];
        return new bsync_pb_1.ScanMuteOperationsResponse({
            operations: ops.map((op) => ({
                id: op.id.toString(),
                type: op.type,
                actorDid: op.actorDid,
                subject: op.subject,
            })),
            cursor: lastOp.id.toString(),
        });
    },
});
//# sourceMappingURL=scan-mute-operations.js.map