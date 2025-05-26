"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.team.deleteMember({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { did } = input.body;
            if (!access.isAdmin) {
                throw new xrpc_server_1.AuthRequiredError('Must be an admin to delete a member');
            }
            if ('did' in auth.credentials && did === auth.credentials.did) {
                throw new xrpc_server_1.InvalidRequestError('You can not delete yourself from the team', 'CannotDeleteSelf');
            }
            await db.transaction(async (dbTxn) => {
                const teamService = ctx.teamService(dbTxn);
                await teamService.assertCanDelete(did);
                await teamService.delete(did);
            });
        },
    });
}
//# sourceMappingURL=deleteMember.js.map