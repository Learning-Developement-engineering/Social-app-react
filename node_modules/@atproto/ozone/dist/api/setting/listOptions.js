"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
function default_1(server, ctx) {
    server.tools.ozone.setting.listOptions({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { prefix, scope, keys, limit, cursor } = params;
            let did = ctx.cfg.service.did;
            if (scope === 'personal') {
                if (access.type !== 'moderator') {
                    throw new xrpc_server_1.AuthRequiredError('Must use moderator auth to get personal set details');
                }
                did = access.iss;
            }
            const settingService = ctx.settingService(db);
            const result = await settingService.query({
                scope: scope === 'personal' ? 'personal' : 'instance',
                did,
                keys,
                prefix,
                limit,
                cursor,
            });
            return {
                encoding: 'application/json',
                body: {
                    options: result.options.map((option) => settingService.view(option)),
                    cursor: result.cursor,
                },
            };
        },
    });
}
//# sourceMappingURL=listOptions.js.map