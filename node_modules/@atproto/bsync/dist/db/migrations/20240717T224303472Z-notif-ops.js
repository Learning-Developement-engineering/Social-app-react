"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('notif_op')
        .addColumn('id', 'bigserial', (col) => col.primaryKey())
        .addColumn('actorDid', 'varchar', (col) => col.notNull())
        .addColumn('priority', 'boolean')
        .addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema
        .createTable('notif_item')
        .addColumn('actorDid', 'varchar', (col) => col.primaryKey())
        .addColumn('priority', 'boolean', (col) => col.notNull())
        .addColumn('fromId', 'bigint', (col) => col.notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable('notif_item').execute();
    await db.schema.dropTable('notif_op').execute();
}
//# sourceMappingURL=20240717T224303472Z-notif-ops.js.map