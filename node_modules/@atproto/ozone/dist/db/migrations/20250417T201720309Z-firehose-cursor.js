"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('firehose_cursor')
        .addColumn('service', 'text', (col) => col.primaryKey())
        .addColumn('cursor', 'bigint')
        .addColumn('updatedAt', 'text', (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable('firehose_cursor').execute();
}
//# sourceMappingURL=20250417T201720309Z-firehose-cursor.js.map