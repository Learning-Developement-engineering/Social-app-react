"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const outbox_1 = require("../../sequencer/outbox");
function default_1(server, ctx) {
    server.com.atproto.label.subscribeLabels(async function* ({ params, signal, }) {
        const { cursor } = params;
        const outbox = new outbox_1.Outbox(ctx.sequencer);
        if (cursor !== undefined) {
            const curr = await ctx.sequencer.curr();
            if (cursor > (curr ?? 0)) {
                throw new xrpc_server_1.InvalidRequestError('Cursor in the future.', 'FutureCursor');
            }
        }
        for await (const evt of outbox.events(cursor, signal)) {
            yield { $type: '#labels', ...evt };
        }
    });
}
//# sourceMappingURL=subscribeLabels.js.map