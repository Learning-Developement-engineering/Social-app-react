"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connect_1 = require("@connectrpc/connect");
const kysely_1 = require("kysely");
const syntax_1 = require("@atproto/syntax");
const mute_op_1 = require("../db/schema/mute_op");
const bsync_pb_1 = require("../proto/bsync_pb");
const auth_1 = require("./auth");
const util_1 = require("./util");
exports.default = (ctx) => ({
    async addMuteOperation(req, handlerCtx) {
        (0, auth_1.authWithApiKey)(ctx, handlerCtx);
        const { db } = ctx;
        const op = validMuteOp(req);
        const id = await db.transaction(async (txn) => {
            // create mute op
            const id = await createMuteOp(txn, op);
            // update mute state
            if (op.type === bsync_pb_1.MuteOperation_Type.ADD) {
                await addMuteItem(txn, id, op);
            }
            else if (op.type === bsync_pb_1.MuteOperation_Type.REMOVE) {
                await removeMuteItem(txn, op);
            }
            else if (op.type === bsync_pb_1.MuteOperation_Type.CLEAR) {
                await clearMuteItems(txn, op);
            }
            else {
                const exhaustiveCheck = op.type;
                throw new Error(`unreachable: ${exhaustiveCheck}`);
            }
            return id;
        });
        return new bsync_pb_1.AddMuteOperationResponse({
            operation: {
                id: String(id),
                type: op.type,
                actorDid: op.actorDid,
                subject: op.subject,
            },
        });
    },
});
const createMuteOp = async (db, op) => {
    const { ref } = db.db.dynamic;
    const { id } = await db.db
        .insertInto('mute_op')
        .values({
        type: op.type,
        actorDid: op.actorDid,
        subject: op.subject,
    })
        .returning('id')
        .executeTakeFirstOrThrow();
    await (0, kysely_1.sql) `notify ${ref(mute_op_1.createMuteOpChannel)}`.execute(db.db); // emitted transactionally
    return id;
};
const addMuteItem = async (db, fromId, op) => {
    const { ref } = db.db.dynamic;
    await db.db
        .insertInto('mute_item')
        .values({
        actorDid: op.actorDid,
        subject: op.subject,
        fromId,
    })
        .onConflict((oc) => oc
        .constraint('mute_item_pkey')
        .doUpdateSet({ fromId: (0, kysely_1.sql) `${ref('excluded.fromId')}` }))
        .execute();
};
const removeMuteItem = async (db, op) => {
    await db.db
        .deleteFrom('mute_item')
        .where('actorDid', '=', op.actorDid)
        .where('subject', '=', op.subject)
        .execute();
};
const clearMuteItems = async (db, op) => {
    await db.db
        .deleteFrom('mute_item')
        .where('actorDid', '=', op.actorDid)
        .execute();
};
const validMuteOp = (op) => {
    if (!Object.values(bsync_pb_1.MuteOperation_Type).includes(op.type)) {
        throw new connect_1.ConnectError('bad mute operation type', connect_1.Code.InvalidArgument);
    }
    if (op.type === bsync_pb_1.MuteOperation_Type.UNSPECIFIED) {
        throw new connect_1.ConnectError('unspecified mute operation type', connect_1.Code.InvalidArgument);
    }
    if (!(0, util_1.isValidDid)(op.actorDid)) {
        throw new connect_1.ConnectError('actor_did must be a valid did', connect_1.Code.InvalidArgument);
    }
    if (op.type === bsync_pb_1.MuteOperation_Type.CLEAR) {
        if (op.subject !== '') {
            throw new connect_1.ConnectError('subject must not be set on a clear op', connect_1.Code.InvalidArgument);
        }
    }
    else {
        if ((0, util_1.isValidDid)(op.subject)) {
            // all good
        }
        else if ((0, util_1.isValidAtUri)(op.subject)) {
            const uri = new syntax_1.AtUri(op.subject);
            if (uri.collection !== 'app.bsky.graph.list' &&
                uri.collection !== 'app.bsky.feed.post') {
                throw new connect_1.ConnectError('subject aturis must reference a list or post record', connect_1.Code.InvalidArgument);
            }
        }
        else {
            throw new connect_1.ConnectError('subject must be a did or aturi on add or remove op', connect_1.Code.InvalidArgument);
        }
    }
    return op; // op.type has been checked
};
//# sourceMappingURL=add-mute-operation.js.map