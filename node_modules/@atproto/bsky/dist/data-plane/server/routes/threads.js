"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
exports.default = (db) => ({
    async getThread(req) {
        const { postUri, above, below } = req;
        const [ancestors, descendents] = await Promise.all([
            (0, util_1.getAncestorsAndSelfQb)(db.db, {
                uri: postUri,
                parentHeight: above,
            })
                .selectFrom('ancestor')
                .selectAll()
                .execute(),
            (0, util_1.getDescendentsQb)(db.db, {
                uri: postUri,
                depth: below,
            })
                .selectFrom('descendent')
                .innerJoin('post', 'post.uri', 'descendent.uri')
                .orderBy('post.sortAt', 'desc')
                .selectAll()
                .execute(),
        ]);
        const uris = [
            ...ancestors.map((p) => p.uri),
            ...descendents.map((p) => p.uri),
        ];
        return { uris };
    },
});
//# sourceMappingURL=threads.js.map