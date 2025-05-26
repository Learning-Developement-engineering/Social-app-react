"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const lexicons_1 = require("../../lexicon/lexicons");
function default_1(server, ctx) {
    server.chat.bsky.moderation.getActorMetadata({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params }) => {
            if (!ctx.chatAgent) {
                throw new xrpc_server_1.InvalidRequestError('No chat agent configured');
            }
            const res = await ctx.chatAgent.api.chat.bsky.moderation.getActorMetadata(params, await ctx.chatAuth(lexicons_1.ids.ChatBskyModerationGetActorMetadata));
            return {
                encoding: 'application/json',
                body: res.data,
            };
        },
    });
}
//# sourceMappingURL=getActorMetadata.js.map