"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("../db/pagination");
exports.default = (db) => ({
    async getActorStarterPacks(req) {
        const { actorDid, limit, cursor } = req;
        const { ref } = db.db.dynamic;
        let builder = db.db
            .selectFrom('starter_pack')
            .selectAll()
            .where('creator', '=', actorDid);
        const keyset = new pagination_1.TimeCidKeyset(ref('starter_pack.sortAt'), ref('starter_pack.cid'));
        builder = (0, pagination_1.paginate)(builder, {
            limit,
            cursor,
            keyset,
        });
        const starterPacks = await builder.execute();
        return {
            uris: starterPacks.map((sp) => sp.uri),
            cursor: keyset.packFromResult(starterPacks),
        };
    },
});
//# sourceMappingURL=starter-packs.js.map