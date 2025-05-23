"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('mute_op')
        .addColumn('id', 'bigserial', (col) => col.primaryKey())
        .addColumn('type', 'int2', (col) => col.notNull()) // integer enum: 0->add, 1->remove, 2->clear
        .addColumn('actorDid', 'varchar', (col) => col.notNull())
        .addColumn('subject', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo((0, kysely_1.sql) `CURRENT_TIMESTAMP`))
        .execute();
    await db.schema
        .createTable('mute_item')
        .addColumn('actorDid', 'varchar', (col) => col.notNull())
        .addColumn('subject', 'varchar', (col) => col.notNull())
        .addColumn('fromId', 'bigint', (col) => col.notNull())
        .addPrimaryKeyConstraint('mute_item_pkey', ['actorDid', 'subject'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('mute_item').execute();
    await db.schema.dropTable('mute_op').execute();
}
//# sourceMappingURL=20240108T220751294Z-init.js.map