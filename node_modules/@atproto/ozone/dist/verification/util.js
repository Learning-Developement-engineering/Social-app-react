"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReposForVerifications = void 0;
const util_1 = require("../api/util");
const getReposForVerifications = async (ctx, labelers, modService, dids, isModerator) => {
    const [partialRepos, accountInfo] = await Promise.all([
        modService.views.repoDetails(dids, labelers),
        (0, util_1.getPdsAccountInfos)(ctx, dids),
    ]);
    const repos = new Map(dids.map((did) => {
        const partialRepo = partialRepos.get(did);
        if (!partialRepo) {
            return [
                did,
                {
                    did,
                    $type: 'tools.ozone.moderation.defs#repoViewNotFound',
                },
            ];
        }
        return [
            did,
            {
                ...(0, util_1.addAccountInfoToRepoViewDetail)(partialRepo, accountInfo.get(did) || null, isModerator),
                $type: 'tools.ozone.moderation.defs#repoViewDetail',
            },
        ];
    }));
    return repos;
};
exports.getReposForVerifications = getReposForVerifications;
//# sourceMappingURL=util.js.map