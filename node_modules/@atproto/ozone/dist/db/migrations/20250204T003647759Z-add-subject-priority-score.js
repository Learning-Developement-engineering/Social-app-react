"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('priorityScore', 'integer', (col) => col.notNull().defaultTo('0'))
        .execute();
    await db.schema
        .createIndex('moderation_subject_status_priority_score_index')
        .on('moderation_subject_status')
        .column('priorityScore')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('priorityScore')
        .execute();
}
//# sourceMappingURL=20250204T003647759Z-add-subject-priority-score.js.map