"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (db) => ({
    async getLatestRev(req) {
        const res = await db.db
            .selectFrom('actor_sync')
            .where('did', '=', req.actorDid)
            .select('repoRev')
            .executeTakeFirst();
        return {
            rev: res?.repoRev ?? undefined,
        };
    },
});
//# sourceMappingURL=sync.js.map