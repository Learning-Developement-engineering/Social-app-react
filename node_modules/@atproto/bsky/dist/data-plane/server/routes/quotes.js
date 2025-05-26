"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("../db/pagination");
exports.default = (db) => ({
    async getQuotesBySubjectSorted(req) {
        const { subject, cursor, limit } = req;
        const { ref } = db.db.dynamic;
        if (!subject?.uri)
            return { uris: [] };
        let builder = db.db
            .selectFrom('quote')
            .where('quote.subject', '=', subject.uri)
            .select(['quote.uri', 'quote.cid', 'quote.sortAt']);
        const keyset = new pagination_1.TimeCidKeyset(ref('quote.sortAt'), ref('quote.cid'));
        builder = (0, pagination_1.paginate)(builder, {
            limit,
            cursor,
            keyset,
        });
        const quotes = await builder.execute();
        return {
            uris: quotes.map((q) => q.uri),
            cursor: keyset.packFromResult(quotes),
        };
    },
});
//# sourceMappingURL=quotes.js.map