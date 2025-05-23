"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const util_1 = require("../util");
function default_1(server, ctx) {
    server.tools.ozone.team.updateMember({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { did, role, ...rest } = input.body;
            if (!access.isAdmin) {
                throw new xrpc_server_1.AuthRequiredError('Must be an admin to update a member');
            }
            if (did === ctx.cfg.service.did) {
                throw new xrpc_server_1.InvalidRequestError('Can not update service owner');
            }
            const updatedMember = await db.transaction(async (dbTxn) => {
                const teamService = ctx.teamService(dbTxn);
                const memberExists = await teamService.doesMemberExist(did);
                if (!memberExists) {
                    throw new xrpc_server_1.InvalidRequestError('member not found', 'MemberNotFound');
                }
                const updated = await teamService.update(did, {
                    ...rest,
                    ...(role ? { role: (0, util_1.getMemberRole)(role) } : {}),
                    lastUpdatedBy: access.type === 'admin_token' ? 'admin_token' : access.iss,
                });
                const memberView = await teamService.view([updated]);
                return memberView[0];
            });
            return {
                encoding: 'application/json',
                body: updatedMember,
            };
        },
    });
}
//# sourceMappingURL=updateMember.js.map