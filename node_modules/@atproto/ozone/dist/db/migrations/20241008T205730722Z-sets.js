"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    // Create the sets table
    await db.schema
        .createTable('set_detail')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('name', 'varchar', (col) => col.notNull().unique())
        .addColumn('description', 'varchar')
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
        .execute();
    // Create the set values table
    await db.schema
        .createTable('set_value')
        .addColumn('id', 'bigserial', (col) => col.primaryKey())
        .addColumn('setId', 'integer', (col) => col.notNull().references('set_detail.id'))
        .addColumn('value', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
        .execute();
    // Add indexes for better performance
    await db.schema
        .createIndex('set_detail_name_idx')
        .on('set_detail')
        .column('name')
        .execute();
    // Create a unique constraint on setId and value
    await db.schema
        .alterTable('set_value')
        .addUniqueConstraint('set_value_setid_value_unique', ['setId', 'value'])
        .execute();
    await db.schema
        .createIndex('set_value_setid_created_at_idx')
        .on('set_value')
        .columns(['setId', 'createdAt'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('set_value').execute();
    await db.schema.dropTable('set_detail').execute();
}
//# sourceMappingURL=20241008T205730722Z-sets.js.map