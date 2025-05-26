"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.set.addValues({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { name, values } = input.body;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a moderator to add values to a set');
            }
            const setService = ctx.setService(db);
            const set = await setService.getByName(name);
            if (!set) {
                throw new xrpc_server_1.InvalidRequestError(`Set with name "${name}" does not exist`);
            }
            await setService.addValues(set.id, values);
        },
    });
}
//# sourceMappingURL=addValues.js.map