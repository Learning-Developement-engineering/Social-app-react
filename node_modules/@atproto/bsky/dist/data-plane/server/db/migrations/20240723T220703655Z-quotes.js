"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('quote')
        .addColumn('uri', 'varchar', (col) => col.primaryKey())
        .addColumn('cid', 'varchar', (col) => col.notNull())
        .addColumn('subject', 'varchar', (col) => col.notNull())
        .addColumn('subjectCid', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addColumn('indexedAt', 'varchar', (col) => col.notNull())
        .addColumn('sortAt', 'varchar', (col) => col
        .generatedAlwaysAs((0, kysely_1.sql) `least("createdAt", "indexedAt")`)
        .stored()
        .notNull())
        .execute();
    await db.schema
        .createIndex('quote_subject_cursor_idx')
        .on('quote')
        .columns(['subject', 'sortAt', 'cid'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('quote').execute();
}
//# sourceMappingURL=20240723T220703655Z-quotes.js.map