"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.communication.listTemplates({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a full moderator to view list of communication template');
            }
            const communicationTemplate = ctx.communicationTemplateService(db);
            const list = await communicationTemplate.list();
            return {
                encoding: 'application/json',
                body: {
                    communicationTemplates: list.map((item) => communicationTemplate.view(item)),
                },
            };
        },
    });
}
//# sourceMappingURL=listTemplates.js.map