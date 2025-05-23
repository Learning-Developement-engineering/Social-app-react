"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const util_1 = require("../../verification/util");
function default_1(server, ctx) {
    server.tools.ozone.verification.listVerifications({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ req, params, auth }) => {
            const modViews = ctx.modService(ctx.db).views;
            const verificationService = ctx.verificationService(ctx.db);
            const { verifications, cursor } = await verificationService.list(params);
            const dids = new Set();
            for (const verification of verifications) {
                dids.add(verification.subject);
                dids.add(verification.issuer);
            }
            const didsArr = Array.from(dids);
            const [repos, profiles] = await Promise.all([
                (0, util_1.getReposForVerifications)(ctx, ctx.reqLabelers(req), ctx.modService(ctx.db), didsArr, auth.credentials.isModerator),
                modViews.getProfiles(didsArr),
            ]);
            return {
                encoding: 'application/json',
                body: {
                    cursor,
                    verifications: verificationService.view(verifications, repos, profiles),
                },
            };
        },
    });
}
//# sourceMappingURL=listVerifications.js.map