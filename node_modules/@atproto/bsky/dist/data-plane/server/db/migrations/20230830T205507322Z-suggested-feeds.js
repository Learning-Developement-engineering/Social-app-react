"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('suggested_feed')
        .addColumn('uri', 'varchar', (col) => col.primaryKey())
        .addColumn('order', 'integer', (col) => col.notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable('suggested_feed').execute();
}
//# sourceMappingURL=20230830T205507322Z-suggested-feeds.js.map