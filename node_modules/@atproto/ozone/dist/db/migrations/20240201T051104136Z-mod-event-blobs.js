"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('moderation_event')
        .addColumn('subjectBlobCids', 'jsonb')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('moderation_event')
        .dropColumn('subjectBlobCids')
        .execute();
}
//# sourceMappingURL=20240201T051104136Z-mod-event-blobs.js.map