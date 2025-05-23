"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('setting')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('key', 'text', (col) => col.notNull())
        .addColumn('did', 'text', (col) => col.notNull())
        .addColumn('value', 'jsonb', (col) => col.notNull())
        .addColumn('description', 'text')
        .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
        .addColumn('managerRole', 'text')
        .addColumn('scope', 'text', (col) => col.notNull())
        .addColumn('createdBy', 'text', (col) => col.notNull())
        .addColumn('lastUpdatedBy', 'text', (col) => col.notNull())
        .addUniqueConstraint('setting_did_scope_key_idx', ['did', 'scope', 'key'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('setting').execute();
}
//# sourceMappingURL=20241018T205730722Z-setting.js.map