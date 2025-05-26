"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@atproto/common");
const pagination_1 = require("../db/pagination");
const util_1 = require("../db/util");
exports.default = (db) => ({
    async getActorLists(req) {
        const { actorDid, cursor, limit } = req;
        const { ref } = db.db.dynamic;
        let builder = db.db
            .selectFrom('list')
            .where('creator', '=', actorDid)
            .selectAll();
        const keyset = new pagination_1.TimeCidKeyset(ref('list.sortAt'), ref('list.cid'));
        builder = (0, pagination_1.paginate)(builder, {
            limit,
            cursor,
            keyset,
            tryIndex: true,
        });
        const lists = await builder.execute();
        return {
            listUris: lists.map((item) => item.uri),
            cursor: keyset.packFromResult(lists),
        };
    },
    async getListMembers(req) {
        const { listUri, cursor, limit } = req;
        const { ref } = db.db.dynamic;
        let builder = db.db
            .selectFrom('list_item')
            .where('listUri', '=', listUri)
            .selectAll();
        const keyset = new pagination_1.TimeCidKeyset(ref('list_item.sortAt'), ref('list_item.cid'));
        builder = (0, pagination_1.paginate)(builder, {
            limit,
            cursor,
            keyset,
            tryIndex: true,
        });
        const listItems = await builder.execute();
        return {
            listitems: listItems.map((item) => ({
                uri: item.uri,
                did: item.subjectDid,
            })),
            cursor: keyset.packFromResult(listItems),
        };
    },
    async getListMembership(req) {
        const { actorDid, listUris } = req;
        if (listUris.length === 0) {
            return { listitemUris: [] };
        }
        const res = await db.db
            .selectFrom('list_item')
            .where('subjectDid', '=', actorDid)
            .where('listUri', 'in', listUris)
            .selectAll()
            .execute();
        const byListUri = (0, common_1.keyBy)(res, 'listUri');
        const listitemUris = listUris.map((uri) => byListUri.get(uri)?.uri ?? '');
        return {
            listitemUris,
        };
    },
    async getListCount(req) {
        const res = await db.db
            .selectFrom('list_item')
            .select(util_1.countAll.as('count'))
            .where('list_item.listUri', '=', req.listUri)
            .executeTakeFirst();
        return {
            count: res?.count,
        };
    },
});
//# sourceMappingURL=lists.js.map