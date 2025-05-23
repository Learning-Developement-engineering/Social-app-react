"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const lexicon_1 = require("../../lexicon");
function default_1(server, ctx) {
    server.tools.ozone.server.getConfig({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ auth }) => {
            return {
                encoding: 'application/json',
                body: {
                    appview: {
                        url: ctx.cfg.appview.url,
                    },
                    blobDivert: {
                        url: ctx.cfg.blobDivert?.url,
                    },
                    pds: {
                        url: ctx.cfg.pds?.url,
                    },
                    chat: {
                        url: ctx.cfg.chat?.url,
                    },
                    viewer: {
                        role: auth.credentials.isAdmin
                            ? lexicon_1.TOOLS_OZONE_TEAM.DefsRoleAdmin
                            : auth.credentials.isModerator
                                ? lexicon_1.TOOLS_OZONE_TEAM.DefsRoleModerator
                                : lexicon_1.TOOLS_OZONE_TEAM.DefsRoleTriage,
                    },
                    verifierDid: ctx.cfg.verifier?.did || undefined,
                },
            };
        },
    });
}
//# sourceMappingURL=getConfig.js.map