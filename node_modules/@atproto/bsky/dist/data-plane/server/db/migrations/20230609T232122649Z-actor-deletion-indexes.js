"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
// Indexes to support efficient actor deletion/unindexing
async function up(db) {
    await db.schema // Also supports record deletes
        .createIndex('duplicate_record_duplicate_of_idx')
        .on('duplicate_record')
        .column('duplicateOf')
        .execute();
    await db.schema
        .createIndex('like_creator_idx')
        .on('like')
        .column('creator')
        .execute();
    await db.schema
        .createIndex('notification_author_idx')
        .on('notification')
        .column('author')
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('notification_author_idx').execute();
    await db.schema.dropIndex('like_creator_idx').execute();
    await db.schema.dropIndex('duplicate_record_duplicate_of_idx').execute();
}
//# sourceMappingURL=20230609T232122649Z-actor-deletion-indexes.js.map