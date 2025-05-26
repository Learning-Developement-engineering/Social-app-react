"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.verification.revokeVerifications({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            if (!ctx.cfg.verifier) {
                throw new xrpc_server_1.InvalidRequestError('Verifier not configured');
            }
            if (!auth.credentials.isVerifier) {
                throw new xrpc_server_1.AuthRequiredError('Must be an admin or verifier to revoke verifications');
            }
            const verificationIssuer = ctx.verificationIssuer(ctx.cfg.verifier);
            const { uris, revokeReason } = input.body;
            const { revokedVerifications, failedRevocations } = await verificationIssuer.revoke({ uris });
            if (revokedVerifications.length) {
                const verificationService = ctx.verificationService(ctx.db);
                await verificationService.markRevoked({
                    uris: revokedVerifications,
                    revokeReason,
                    revokedBy: 'iss' in auth.credentials ? auth.credentials.iss : undefined,
                });
            }
            return {
                encoding: 'application/json',
                body: {
                    revokedVerifications,
                    failedRevocations,
                },
            };
        },
    });
}
//# sourceMappingURL=revokeVerifications.js.map