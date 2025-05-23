"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('member')
        .addColumn('did', 'varchar', (col) => col.primaryKey())
        .addColumn('role', 'varchar', (col) => col.notNull())
        .addColumn('disabled', 'boolean', (col) => col.defaultTo(false).notNull())
        .addColumn('createdAt', 'timestamptz', (col) => col.notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.notNull())
        .addColumn('lastUpdatedBy', 'varchar', (col) => col.notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable('member');
}
//# sourceMappingURL=20240521T211332580Z-member.js.map