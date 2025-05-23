"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.set.getValues({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { name, limit, cursor } = params;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a moderator to get set details');
            }
            const setService = ctx.setService(db);
            const result = await setService.getSetWithValues({
                name,
                limit,
                cursor,
            });
            if (!result) {
                throw new xrpc_server_1.InvalidRequestError(`Set with name "${name}" not found`, 'SetNotFound');
            }
            return {
                encoding: 'application/json',
                body: {
                    set: setService.view(result.set),
                    values: result.values,
                    cursor: result.cursor,
                },
            };
        },
    });
}
//# sourceMappingURL=getValues.js.map