"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const util_1 = require("../../verification/util");
function default_1(server, ctx) {
    server.tools.ozone.verification.grantVerifications({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth, req }) => {
            if (!ctx.cfg.verifier) {
                throw new xrpc_server_1.InvalidRequestError('Verifier not configured');
            }
            if (!auth.credentials.isVerifier) {
                throw new xrpc_server_1.AuthRequiredError('Must be an admin or verifier to grant verifications');
            }
            const modViews = ctx.modService(ctx.db).views;
            const profilesBefore = await modViews.getProfiles(input.body.verifications.map((v) => v.subject));
            // Filter out any subject for which, the current issuer already has a valid verification record indexed
            const verificationsToBeGranted = input.body.verifications.filter((verificationInput) => {
                const hasValidVerification = profilesBefore
                    .get(verificationInput.subject)
                    ?.verification?.verifications.find((v) => v.issuer === ctx.cfg.verifier?.did && v.isValid);
                return !hasValidVerification;
            });
            const verificationIssuer = ctx.verificationIssuer(ctx.cfg.verifier);
            const verificationService = ctx.verificationService(ctx.db);
            const { grantedVerifications, failedVerifications } = await verificationIssuer.verify(verificationsToBeGranted);
            if (!grantedVerifications.length) {
                return {
                    encoding: 'application/json',
                    body: {
                        verifications: [],
                        failedVerifications,
                    },
                };
            }
            const createdVerifications = [];
            const verificationEntries = await verificationService.create(grantedVerifications);
            const dids = new Set([ctx.cfg.verifier.did]);
            for (const verification of verificationEntries) {
                createdVerifications.push(verification);
                dids.add(verification.subject);
            }
            const didsArr = Array.from(dids);
            const [repos, profiles] = await Promise.all([
                (0, util_1.getReposForVerifications)(ctx, ctx.reqLabelers(req), ctx.modService(ctx.db), didsArr, auth.credentials.isModerator),
                modViews.getProfiles(didsArr),
            ]);
            const verifications = verificationService.view(createdVerifications, repos, profiles);
            return {
                encoding: 'application/json',
                body: {
                    verifications,
                    failedVerifications,
                },
            };
        },
    });
}
//# sourceMappingURL=grantVerifications.js.map