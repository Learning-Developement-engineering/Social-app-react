"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(server, ctx) {
    server.tools.ozone.team.listMembers({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params }) => {
            const teamService = ctx.teamService(ctx.db);
            const { members, cursor } = await teamService.list(params);
            return {
                encoding: 'application/json',
                body: {
                    cursor,
                    members: await teamService.view(members),
                },
            };
        },
    });
}
//# sourceMappingURL=listMembers.js.map