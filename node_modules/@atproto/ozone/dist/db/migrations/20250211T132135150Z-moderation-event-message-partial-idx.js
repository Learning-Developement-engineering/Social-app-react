"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
// support lookup for chat.bsky.moderation.getMessageContext
async function up(db) {
    // @NOTE: These queries should be run with the "CONCURRENTLY" option in
    // production to avoid locking the table. This is not supported by Kysely.
    await db.schema.dropIndex('moderation_event_message_id_index').execute();
    await db.schema
        .createIndex('moderation_event_message_id_idx')
        .on('moderation_event')
        // https://github.com/kysely-org/kysely/issues/302
        .expression((0, kysely_1.sql) `"subjectMessageId") WHERE ("subjectMessageId" IS NOT NULL AND "action" = 'tools.ozone.moderation.defs#modEventReport'`)
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('moderation_event_message_id_idx').execute();
    await db.schema
        .createIndex('moderation_event_message_id_index')
        .on('moderation_event')
        .column('subjectMessageId')
        .execute();
}
//# sourceMappingURL=20250211T132135150Z-moderation-event-message-partial-idx.js.map