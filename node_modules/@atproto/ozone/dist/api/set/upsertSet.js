"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.set.upsertSet({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { name, description } = input.body;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a moderator to create or update a set');
            }
            const setService = ctx.setService(db);
            await setService.upsert({
                name,
                description: description ?? null,
            });
            const setWithSize = await setService.getByNameWithSize(name);
            // Unlikely to happen since we just upserted the set
            if (!setWithSize) {
                throw new xrpc_server_1.InvalidRequestError(`Set not found`);
            }
            return {
                encoding: 'application/json',
                body: setService.view(setWithSize),
            };
        },
    });
}
//# sourceMappingURL=upsertSet.js.map