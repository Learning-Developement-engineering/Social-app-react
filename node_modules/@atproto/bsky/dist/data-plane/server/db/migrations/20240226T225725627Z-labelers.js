"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('labeler')
        .addColumn('uri', 'varchar', (col) => col.primaryKey())
        .addColumn('cid', 'varchar', (col) => col.notNull())
        .addColumn('creator', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addColumn('indexedAt', 'varchar', (col) => col.notNull())
        .addColumn('sortAt', 'varchar', (col) => col
        .generatedAlwaysAs((0, kysely_1.sql) `least("createdAt", "indexedAt")`)
        .stored()
        .notNull())
        .execute();
    await db.schema
        .createIndex('labeler_order_by_idx')
        .on('labeler')
        .columns(['sortAt', 'cid'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('labeler').execute();
}
//# sourceMappingURL=20240226T225725627Z-labelers.js.map