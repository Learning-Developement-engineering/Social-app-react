"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
const common_1 = require("@atproto/common");
const util_1 = require("../db/util");
exports.default = (db) => ({
    async getRelationships(req) {
        const { actorDid, targetDids } = req;
        if (targetDids.length === 0) {
            return { relationships: [] };
        }
        const { ref } = db.db.dynamic;
        const res = await db.db
            .selectFrom('actor')
            .where('did', 'in', targetDids)
            .select([
            'actor.did',
            db.db
                .selectFrom('mute')
                .where('mute.mutedByDid', '=', actorDid)
                .whereRef('mute.subjectDid', '=', ref('actor.did'))
                .select((0, kysely_1.sql) `${true}`.as('val'))
                .as('muted'),
            db.db
                .selectFrom('list_item')
                .innerJoin('list_mute', 'list_mute.listUri', 'list_item.listUri')
                .where('list_mute.mutedByDid', '=', actorDid)
                .whereRef('list_item.subjectDid', '=', ref('actor.did'))
                .select('list_item.listUri')
                .as('mutedByList'),
            db.db
                .selectFrom('actor_block')
                .where('actor_block.creator', '=', actorDid)
                .whereRef('actor_block.subjectDid', '=', ref('actor.did'))
                .select('uri')
                .as('blocking'),
            db.db
                .selectFrom('actor_block')
                .where('actor_block.subjectDid', '=', actorDid)
                .whereRef('actor_block.creator', '=', ref('actor.did'))
                .select('uri')
                .as('blockedBy'),
            db.db
                .selectFrom('list_item')
                .innerJoin('list_block', 'list_block.subjectUri', 'list_item.listUri')
                .where('list_block.creator', '=', actorDid)
                .whereRef('list_item.subjectDid', '=', ref('actor.did'))
                .select('list_item.listUri')
                .as('blockingByList'),
            db.db
                .selectFrom('list_item')
                .innerJoin('list_block', 'list_block.subjectUri', 'list_item.listUri')
                .where('list_item.subjectDid', '=', actorDid)
                .whereRef('list_block.creator', '=', ref('actor.did'))
                .select('list_item.listUri')
                .as('blockedByList'),
            db.db
                .selectFrom('follow')
                .where('follow.creator', '=', actorDid)
                .whereRef('follow.subjectDid', '=', ref('actor.did'))
                .select('uri')
                .as('following'),
            db.db
                .selectFrom('follow')
                .where('follow.subjectDid', '=', actorDid)
                .whereRef('follow.creator', '=', ref('actor.did'))
                .select('uri')
                .as('followedBy'),
        ])
            .execute();
        const byDid = (0, common_1.keyBy)(res, 'did');
        const relationships = targetDids.map((did) => {
            const row = byDid.get(did);
            return {
                muted: row?.muted ?? false,
                mutedByList: row?.mutedByList ?? '',
                blockedBy: row?.blockedBy ?? '',
                blocking: row?.blocking ?? '',
                blockedByList: row?.blockedByList ?? '',
                blockingByList: row?.blockingByList ?? '',
                following: row?.following ?? '',
                followedBy: row?.followedBy ?? '',
            };
        });
        return { relationships };
    },
    async getBlockExistence(req) {
        const { pairs } = req;
        if (pairs.length === 0) {
            return { exists: [], blocks: [] };
        }
        const { ref } = db.db.dynamic;
        const sourceRef = ref('pair.source');
        const targetRef = ref('pair.target');
        const values = (0, util_1.valuesList)(pairs.map((p) => (0, kysely_1.sql) `${p.a}, ${p.b}`));
        const res = await db.db
            .selectFrom(values.as((0, kysely_1.sql) `pair (source, target)`))
            .select([
            (0, kysely_1.sql) `${sourceRef}`.as('source'),
            (0, kysely_1.sql) `${targetRef}`.as('target'),
            (eb) => eb
                .selectFrom('actor_block')
                .whereRef('actor_block.creator', '=', sourceRef)
                .whereRef('actor_block.subjectDid', '=', targetRef)
                .select('uri')
                .as('blocking'),
            (eb) => eb
                .selectFrom('actor_block')
                .whereRef('actor_block.creator', '=', targetRef)
                .whereRef('actor_block.subjectDid', '=', sourceRef)
                .select('uri')
                .as('blockedBy'),
            (eb) => eb
                .selectFrom('list_item')
                .innerJoin('list_block', 'list_block.subjectUri', 'list_item.listUri')
                .whereRef('list_block.creator', '=', sourceRef)
                .whereRef('list_item.subjectDid', '=', targetRef)
                .select('list_item.listUri')
                .as('blockingByList'),
            (eb) => eb
                .selectFrom('list_item')
                .innerJoin('list_block', 'list_block.subjectUri', 'list_item.listUri')
                .whereRef('list_block.creator', '=', targetRef)
                .whereRef('list_item.subjectDid', '=', sourceRef)
                .select('list_item.listUri')
                .as('blockedByList'),
        ])
            .execute();
        const getKey = (a, b) => [a, b].sort().join(',');
        const lookup = res.reduce((acc, cur) => {
            const key = getKey(cur.source, cur.target);
            return acc.set(key, cur);
        }, new Map());
        return {
            exists: pairs.map((pair) => {
                const item = lookup.get(getKey(pair.a, pair.b));
                if (!item)
                    return false;
                return !!(item.blocking ||
                    item.blockedBy ||
                    item.blockingByList ||
                    item.blockedByList);
            }),
            blocks: pairs.map((pair) => {
                const item = lookup.get(getKey(pair.a, pair.b));
                if (!item)
                    return {};
                return {
                    blockedBy: item.blockedBy || undefined,
                    blocking: item.blocking || undefined,
                    blockedByList: item.blockedByList || undefined,
                    blockingByList: item.blockingByList || undefined,
                };
            }),
        };
    },
});
//# sourceMappingURL=relationships.js.map