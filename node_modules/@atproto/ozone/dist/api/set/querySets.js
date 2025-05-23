"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.set.querySets({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { limit, cursor, namePrefix, sortBy, sortDirection } = params;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a moderator to query sets');
            }
            const setService = ctx.setService(db);
            const queryResult = await setService.query({
                limit,
                cursor,
                namePrefix,
                sortBy,
                sortDirection,
            });
            return {
                encoding: 'application/json',
                body: {
                    sets: queryResult.sets.map((set) => setService.view(set)),
                    cursor: queryResult.cursor,
                },
            };
        },
    });
}
//# sourceMappingURL=querySets.js.map