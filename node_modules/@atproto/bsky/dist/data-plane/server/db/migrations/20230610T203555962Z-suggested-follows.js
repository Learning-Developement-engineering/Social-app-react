"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('suggested_follow')
        .addColumn('did', 'varchar', (col) => col.primaryKey())
        .addColumn('order', 'integer', (col) => col.notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable('suggested_follow').execute();
}
//# sourceMappingURL=20230610T203555962Z-suggested-follows.js.map