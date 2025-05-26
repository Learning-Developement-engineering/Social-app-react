"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const syntax_1 = require("@atproto/syntax");
const util_1 = require("../util");
function default_1(server, ctx) {
    server.tools.ozone.moderation.getRecords({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params, auth, req }) => {
            const db = ctx.db;
            const labelers = ctx.reqLabelers(req);
            const [records, accountInfos] = await Promise.all([
                ctx.modService(db).views.recordDetails(params.uris.map((uri) => ({ uri })), labelers),
                (0, util_1.getPdsAccountInfos)(ctx, params.uris.map((uri) => new syntax_1.AtUri(uri).hostname)),
            ]);
            const results = params.uris.map((uri) => {
                const record = records.get(uri);
                if (!record) {
                    return {
                        uri,
                        $type: 'tools.ozone.moderation.defs#recordViewNotFound',
                    };
                }
                return {
                    $type: 'tools.ozone.moderation.defs#recordViewDetail',
                    ...record,
                    repo: (0, util_1.addAccountInfoToRepoView)(record.repo, accountInfos.get(record.repo.did) || null, auth.credentials.isModerator),
                };
            });
            return {
                encoding: 'application/json',
                body: { records: results },
            };
        },
    });
}
//# sourceMappingURL=getRecords.js.map