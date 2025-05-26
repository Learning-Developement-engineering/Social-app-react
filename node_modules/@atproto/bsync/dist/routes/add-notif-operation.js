"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("@connectrpc/connect");
const kysely_1 = require("kysely");
const notif_op_1 = require("../db/schema/notif_op");
const bsync_pb_1 = require("../proto/bsync_pb");
const auth_1 = require("./auth");
const util_1 = require("./util");
exports.default = (ctx) => ({
    async addNotifOperation(req, handlerCtx) {
        (0, auth_1.authWithApiKey)(ctx, handlerCtx);
        const { db } = ctx;
        const { actorDid, priority } = req;
        if (!(0, util_1.isValidDid)(actorDid)) {
            throw new connect_1.ConnectError('actor_did must be a valid did', connect_1.Code.InvalidArgument);
        }
        const id = await db.transaction(async (txn) => {
            // create notif op
            const id = await createNotifOp(txn, actorDid, priority);
            // update notif state
            if (priority !== undefined) {
                await updateNotifItem(txn, id, actorDid, priority);
            }
            return id;
        });
        return new bsync_pb_1.AddNotifOperationResponse({
            operation: {
                id: String(id),
                actorDid,
                priority,
            },
        });
    },
});
const createNotifOp = async (db, actorDid, priority) => {
    const { ref } = db.db.dynamic;
    const { id } = await db.db
        .insertInto('notif_op')
        .values({
        actorDid,
        priority,
    })
        .returning('id')
        .executeTakeFirstOrThrow();
    await (0, kysely_1.sql) `notify ${ref(notif_op_1.createNotifOpChannel)}`.execute(db.db); // emitted transactionally
    return id;
};
const updateNotifItem = async (db, fromId, actorDid, priority) => {
    const { ref } = db.db.dynamic;
    await db.db
        .insertInto('notif_item')
        .values({
        actorDid,
        priority,
        fromId,
    })
        .onConflict((oc) => oc.column('actorDid').doUpdateSet({
        priority: (0, kysely_1.sql) `${ref('excluded.priority')}`,
        fromId: (0, kysely_1.sql) `${ref('excluded.fromId')}`,
    }))
        .execute();
};
//# sourceMappingURL=add-notif-operation.js.map