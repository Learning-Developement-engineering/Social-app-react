"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@atproto/common");
const bsky_pb_1 = require("../../../proto/bsky_pb");
const pagination_1 = require("../db/pagination");
exports.default = (db) => ({
    async getActorFollowsActors(req) {
        const { actorDid, targetDids } = req;
        if (targetDids.length < 1) {
            return { uris: [] };
        }
        const res = await db.db
            .selectFrom('follow')
            .where('follow.creator', '=', actorDid)
            .where('follow.subjectDid', 'in', targetDids)
            .selectAll()
            .execute();
        const bySubject = (0, common_1.keyBy)(res, 'subjectDid');
        const uris = targetDids.map((did) => bySubject.get(did)?.uri ?? '');
        return {
            uris,
        };
    },
    async getFollowers(req) {
        const { actorDid, limit, cursor } = req;
        const { ref } = db.db.dynamic;
        let followersReq = db.db
            .selectFrom('follow')
            .where('follow.subjectDid', '=', actorDid)
            .innerJoin('actor as creator', 'creator.did', 'follow.creator')
            .selectAll('creator')
            .select([
            'follow.uri as uri',
            'follow.cid as cid',
            'follow.creator as creatorDid',
            'follow.subjectDid as subjectDid',
            'follow.sortAt as sortAt',
        ]);
        const keyset = new pagination_1.TimeCidKeyset(ref('follow.sortAt'), ref('follow.cid'));
        followersReq = (0, pagination_1.paginate)(followersReq, {
            limit,
            cursor,
            keyset,
            tryIndex: true,
        });
        const followers = await followersReq.execute();
        return {
            followers: followers.map((f) => ({
                uri: f.uri,
                actorDid: f.creatorDid,
                subjectDid: f.subjectDid,
            })),
            cursor: keyset.packFromResult(followers),
        };
    },
    async getFollows(req) {
        const { actorDid, limit, cursor } = req;
        const { ref } = db.db.dynamic;
        let followsReq = db.db
            .selectFrom('follow')
            .where('follow.creator', '=', actorDid)
            .innerJoin('actor as subject', 'subject.did', 'follow.subjectDid')
            .selectAll('subject')
            .select([
            'follow.uri as uri',
            'follow.cid as cid',
            'follow.creator as creatorDid',
            'follow.subjectDid as subjectDid',
            'follow.sortAt as sortAt',
        ]);
        const keyset = new pagination_1.TimeCidKeyset(ref('follow.sortAt'), ref('follow.cid'));
        followsReq = (0, pagination_1.paginate)(followsReq, {
            limit,
            cursor,
            keyset,
            tryIndex: true,
        });
        const follows = await followsReq.execute();
        return {
            follows: follows.map((f) => ({
                uri: f.uri,
                actorDid: f.creatorDid,
                subjectDid: f.subjectDid,
            })),
            cursor: keyset.packFromResult(follows),
        };
    },
    /**
     * Return known followers of a given actor.
     *
     * Example:
     *   - Alice follows Bob
     *   - Bob follows Dan
     *
     *   If Alice (the viewer) looks at Dan's profile (the subject), she should see that Bob follows Dan
     */
    async getFollowsFollowing(req) {
        const { actorDid: viewerDid, targetDids: subjectDids } = req;
        /*
         * 1. Get all the people the Alice is following
         * 2. Get all the people the Dan is followed by
         * 3. Find the intersection
         */
        const results = [];
        for (const subjectDid of subjectDids) {
            const followsReq = db.db
                .selectFrom('follow')
                .where('follow.creator', '=', viewerDid)
                .where('follow.subjectDid', 'in', db.db
                .selectFrom('follow')
                .where('follow.subjectDid', '=', subjectDid)
                .select(['creator']))
                .select(['subjectDid']);
            const rows = await followsReq.execute();
            results.push(new bsky_pb_1.FollowsFollowing({
                targetDid: subjectDid,
                dids: rows.map((r) => r.subjectDid),
            }));
        }
        return { results };
    },
});
//# sourceMappingURL=follows.js.map