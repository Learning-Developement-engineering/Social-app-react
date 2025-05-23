"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const util_1 = require("../util");
function default_1(server, ctx) {
    server.tools.ozone.team.addMember({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { did, role } = input.body;
            if (!access.isAdmin) {
                throw new xrpc_server_1.AuthRequiredError('Must be an admin to add a member');
            }
            const newMember = await db.transaction(async (dbTxn) => {
                const teamService = ctx.teamService(dbTxn);
                const alreadyExists = await teamService.doesMemberExist(did);
                if (alreadyExists) {
                    throw new xrpc_server_1.InvalidRequestError('member already exists', 'MemberAlreadyExists');
                }
                const profiles = await teamService.getProfiles([did]);
                const profile = profiles.get(did);
                const member = await teamService.create({
                    did,
                    handle: profile?.handle || null,
                    displayName: profile?.displayName || null,
                    disabled: false,
                    role: (0, util_1.getMemberRole)(role),
                    lastUpdatedBy: access.type === 'admin_token' ? 'admin_token' : access.iss,
                });
                const memberView = await teamService.view([member]);
                return memberView[0];
            });
            return {
                encoding: 'application/json',
                body: newMember,
            };
        },
    });
}
//# sourceMappingURL=addMember.js.map