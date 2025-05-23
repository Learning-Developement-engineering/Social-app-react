"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(server, ctx) {
    server.tools.ozone.moderation.getReporterStats({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params }) => {
            const db = ctx.db;
            const stats = await ctx.modService(db).getReporterStats(params.dids);
            return {
                encoding: 'application/json',
                body: { stats },
            };
        },
    });
}
//# sourceMappingURL=getReporterStats.js.map