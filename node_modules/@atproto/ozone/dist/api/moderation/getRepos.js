"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const util_1 = require("../util");
function default_1(server, ctx) {
    server.tools.ozone.moderation.getRepos({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params, auth, req }) => {
            const { dids } = params;
            const db = ctx.db;
            const labelers = ctx.reqLabelers(req);
            const [partialRepos, accountInfo] = await Promise.all([
                ctx.modService(db).views.repoDetails(dids, labelers),
                (0, util_1.getPdsAccountInfos)(ctx, dids),
            ]);
            const repos = dids.map((did) => {
                const partialRepo = partialRepos.get(did);
                if (!partialRepo) {
                    return {
                        did,
                        $type: 'tools.ozone.moderation.defs#repoViewNotFound',
                    };
                }
                return {
                    ...(0, util_1.addAccountInfoToRepoViewDetail)(partialRepo, accountInfo.get(did) || null, auth.credentials.isModerator),
                    $type: 'tools.ozone.moderation.defs#repoViewDetail',
                };
            });
            return {
                encoding: 'application/json',
                body: { repos },
            };
        },
    });
}
//# sourceMappingURL=getRepos.js.map