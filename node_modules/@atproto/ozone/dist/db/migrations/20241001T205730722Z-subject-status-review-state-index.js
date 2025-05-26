"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createIndex('moderation_subject_status_review_state_idx')
        .on('moderation_subject_status')
        .column('reviewState')
        .execute();
}
async function down(db) {
    await db.schema
        .dropIndex('moderation_subject_status_review_state_idx')
        .execute();
}
//# sourceMappingURL=20241001T205730722Z-subject-status-review-state-index.js.map