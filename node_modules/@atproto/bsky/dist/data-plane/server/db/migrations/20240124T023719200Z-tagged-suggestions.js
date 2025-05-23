"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('tagged_suggestion')
        .addColumn('tag', 'varchar', (col) => col.notNull())
        .addColumn('subject', 'varchar', (col) => col.notNull())
        .addColumn('subjectType', 'varchar', (col) => col.notNull())
        .addPrimaryKeyConstraint('tagged_suggestion_pkey', ['tag', 'subject'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('tagged_suggestion').execute();
}
//# sourceMappingURL=20240124T023719200Z-tagged-suggestions.js.map