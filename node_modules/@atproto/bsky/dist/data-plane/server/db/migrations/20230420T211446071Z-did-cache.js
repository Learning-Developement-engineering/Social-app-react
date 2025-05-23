"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('did_cache')
        .addColumn('did', 'varchar', (col) => col.primaryKey())
        .addColumn('doc', 'jsonb', (col) => col.notNull())
        .addColumn('updatedAt', 'bigint', (col) => col.notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable('did_cache').execute();
}
//# sourceMappingURL=20230420T211446071Z-did-cache.js.map