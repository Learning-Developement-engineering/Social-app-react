"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema.alterTable('label').addColumn('exp', 'varchar').execute();
    await db.schema
        .alterTable('label')
        .addColumn('sig', (0, kysely_1.sql) `bytea`)
        .execute();
    await db.schema
        .alterTable('label')
        .addColumn('signingKeyId', 'integer')
        .execute();
    await db.schema
        .createTable('signing_key')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('key', 'varchar', (col) => col.notNull().unique())
        .execute();
}
async function down(db) {
    await db.schema.dropTable('signing_key');
    await db.schema.alterTable('label').dropColumn('exp').execute();
    await db.schema.alterTable('label').dropColumn('sig').execute();
    await db.schema.alterTable('label').dropColumn('signingKey').execute();
}
//# sourceMappingURL=20240228T003647759Z-add-label-sigs.js.map