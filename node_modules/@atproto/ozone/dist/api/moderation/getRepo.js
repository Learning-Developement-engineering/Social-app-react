"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const util_1 = require("../util");
function default_1(server, ctx) {
    server.tools.ozone.moderation.getRepo({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params, auth, req }) => {
            const { did } = params;
            const db = ctx.db;
            const labelers = ctx.reqLabelers(req);
            const [partialRepos, accountInfo] = await Promise.all([
                ctx.modService(db).views.repoDetails([did], labelers),
                (0, util_1.getPdsAccountInfos)(ctx, [did]),
            ]);
            const partialRepo = partialRepos.get(did);
            if (!partialRepo) {
                throw new xrpc_server_1.InvalidRequestError('Repo not found', 'RepoNotFound');
            }
            const repo = (0, util_1.addAccountInfoToRepoViewDetail)(partialRepo, accountInfo.get(did) || null, auth.credentials.isModerator);
            return {
                encoding: 'application/json',
                body: repo,
            };
        },
    });
}
//# sourceMappingURL=getRepo.js.map