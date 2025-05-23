"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.set.deleteSet({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { name } = input.body;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a moderator to delete a set');
            }
            const setService = ctx.setService(db);
            const set = await setService.getByName(name);
            if (!set) {
                throw new xrpc_server_1.InvalidRequestError(`Set with name "${name}" does not exist`, 'SetNotFound');
            }
            await setService.removeSet(set.id);
            return {
                encoding: 'application/json',
                body: {},
            };
        },
    });
}
//# sourceMappingURL=deleteSet.js.map