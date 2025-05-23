"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('moderation_event')
        .addColumn('addedTags', 'jsonb')
        .execute();
    await db.schema
        .alterTable('moderation_event')
        .addColumn('removedTags', 'jsonb')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('tags', 'jsonb')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('moderation_event')
        .dropColumn('addedTags')
        .execute();
    await db.schema
        .alterTable('moderation_event')
        .dropColumn('removedTags')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('tags')
        .execute();
}
//# sourceMappingURL=20240208T213404429Z-add-tags-column-to-moderation-subject.js.map