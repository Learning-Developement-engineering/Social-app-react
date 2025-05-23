"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(server, ctx) {
    server.tools.ozone.moderation.queryStatuses({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params }) => {
            const db = ctx.db;
            const modService = ctx.modService(db);
            const results = await modService.getSubjectStatuses(params);
            const subjectStatuses = results.statuses.map((status) => modService.views.formatSubjectStatus(status));
            return {
                encoding: 'application/json',
                body: {
                    cursor: results.cursor,
                    subjectStatuses,
                },
            };
        },
    });
}
//# sourceMappingURL=queryStatuses.js.map