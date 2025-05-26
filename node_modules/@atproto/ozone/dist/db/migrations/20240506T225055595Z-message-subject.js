"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('moderation_event')
        .addColumn('subjectMessageId', 'varchar')
        .execute();
    // support lookup for chat.bsky.moderation.getMessageContext
    await db.schema
        .createIndex('moderation_event_message_id_index')
        .on('moderation_event')
        .column('subjectMessageId')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('moderation_event')
        .dropColumn('subjectMessageId')
        .execute();
}
//# sourceMappingURL=20240506T225055595Z-message-subject.js.map