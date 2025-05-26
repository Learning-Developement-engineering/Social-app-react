"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(server, ctx) {
    server.tools.ozone.moderation.getEvent({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params }) => {
            const { id } = params;
            const db = ctx.db;
            const modService = ctx.modService(db);
            const event = await modService.getEventOrThrow(id);
            const eventDetail = await modService.views.eventDetail(event);
            return {
                encoding: 'application/json',
                body: eventDetail,
            };
        },
    });
}
//# sourceMappingURL=getEvent.js.map