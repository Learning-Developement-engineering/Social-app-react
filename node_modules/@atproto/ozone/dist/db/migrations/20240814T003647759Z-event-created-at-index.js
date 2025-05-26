"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createIndex('moderation_event_created_at_idx')
        .on('moderation_event')
        .column('createdAt')
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('moderation_event_created_at_idx').execute();
}
//# sourceMappingURL=20240814T003647759Z-event-created-at-index.js.map