"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const lexicons_1 = require("../../lexicon/lexicons");
function default_1(server, ctx) {
    server.chat.bsky.moderation.getMessageContext({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ params, auth }) => {
            if (!ctx.chatAgent) {
                throw new xrpc_server_1.InvalidRequestError('No chat agent configured');
            }
            const maxWindowSize = auth.credentials.isModerator ? 5 : 0;
            const before = Math.min(maxWindowSize, params.before);
            const after = Math.min(maxWindowSize, params.after);
            // Ensure that the requested message was actually reported to prevent arbitrary lookups
            const found = await ctx.db.db
                .selectFrom('moderation_event')
                .select('id')
                .where('subjectMessageId', '=', params.messageId)
                // uses "moderation_event_message_id_idx" index
                .where('subjectMessageId', 'is not', null)
                .where('action', '=', 'tools.ozone.moderation.defs#modEventReport')
                .limit(1)
                .executeTakeFirst();
            if (!found) {
                throw new xrpc_server_1.InvalidRequestError('No report for requested message');
            }
            const res = await ctx.chatAgent.api.chat.bsky.moderation.getMessageContext({ ...params, before, after }, await ctx.chatAuth(lexicons_1.ids.ChatBskyModerationGetMessageContext));
            return {
                encoding: 'application/json',
                body: res.data,
            };
        },
    });
}
//# sourceMappingURL=getMessageContext.js.map