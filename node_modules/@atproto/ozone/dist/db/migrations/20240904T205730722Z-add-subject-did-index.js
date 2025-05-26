"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createIndex('moderation_event_subject_did_idx')
        .on('moderation_event')
        .column('subjectDid')
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('moderation_event_subject_did_idx').execute();
}
//# sourceMappingURL=20240904T205730722Z-add-subject-did-index.js.map