"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('communication_template')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('contentMarkdown', 'varchar', (col) => col.notNull())
        .addColumn('subject', 'varchar')
        .addColumn('disabled', 'boolean', (col) => col.defaultTo(false).notNull())
        .addColumn('createdAt', 'timestamptz')
        .addColumn('updatedAt', 'timestamptz')
        .addColumn('lastUpdatedBy', 'varchar', (col) => col.notNull())
        .addUniqueConstraint('communication_template_unique_name', [
        'name',
        'disabled',
    ])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('communication_template');
}
//# sourceMappingURL=20240116T085607200Z-communication-template.js.map