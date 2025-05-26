"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.communication.deleteTemplate({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { id } = input.body;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a moderator to delete a communication template');
            }
            const communicationTemplate = ctx.communicationTemplateService(db);
            await communicationTemplate.delete(Number(id));
        },
    });
}
//# sourceMappingURL=deleteTemplate.js.map