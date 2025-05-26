"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const common_1 = require("@atproto/common");
const pagination_1 = require("../db/pagination");
exports.default = (db) => ({
    async getLikesBySubjectSorted(req) {
        const { subject, cursor, limit } = req;
        const { ref } = db.db.dynamic;
        if (!subject?.uri) {
            return { uris: [] };
        }
        // @NOTE ignoring subject.cid
        let builder = db.db
            .selectFrom('like')
            .where('like.subject', '=', subject?.uri)
            .selectAll('like');
        const keyset = new pagination_1.TimeCidKeyset(ref('like.sortAt'), ref('like.cid'));
        builder = (0, pagination_1.paginate)(builder, {
            limit,
            cursor,
            keyset,
        });
        const likes = await builder.execute();
        return {
            uris: likes.map((l) => l.uri),
            cursor: keyset.packFromResult(likes),
        };
    },
    // @NOTE deprecated in favor of getLikesBySubjectSorted
    async getLikesBySubject(req, context) {
        (0, node_assert_1.default)(this.getLikesBySubjectSorted);
        return this.getLikesBySubjectSorted(req, context);
    },
    async getLikesByActorAndSubjects(req) {
        const { actorDid, refs } = req;
        if (refs.length === 0) {
            return { uris: [] };
        }
        // @NOTE ignoring ref.cid
        const res = await db.db
            .selectFrom('like')
            .where('creator', '=', actorDid)
            .where('subject', 'in', refs.map(({ uri }) => uri))
            .selectAll()
            .execute();
        const bySubject = (0, common_1.keyBy)(res, 'subject');
        const uris = refs.map(({ uri }) => bySubject.get(uri)?.uri ?? '');
        return { uris };
    },
    async getActorLikes(req) {
        const { actorDid, limit, cursor } = req;
        const { ref } = db.db.dynamic;
        let builder = db.db
            .selectFrom('like')
            .where('like.creator', '=', actorDid)
            .selectAll();
        const keyset = new pagination_1.TimeCidKeyset(ref('like.sortAt'), ref('like.cid'));
        builder = (0, pagination_1.paginate)(builder, {
            limit,
            cursor,
            keyset,
        });
        const likes = await builder.execute();
        return {
            likes: likes.map((l) => ({
                uri: l.uri,
                subject: l.subject,
            })),
            cursor: keyset.packFromResult(likes),
        };
    },
});
//# sourceMappingURL=likes.js.map