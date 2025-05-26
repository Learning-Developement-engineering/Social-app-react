"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('verification')
        .addColumn('uri', 'text', (col) => col.notNull().primaryKey())
        .addColumn('cid', 'text', (col) => col.notNull())
        .addColumn('issuer', 'text', (col) => col.notNull())
        .addColumn('subject', 'text', (col) => col.notNull())
        .addColumn('handle', 'text', (col) => col.notNull())
        .addColumn('displayName', 'text', (col) => col.notNull())
        .addColumn('revokeReason', 'text')
        .addColumn('revokedBy', 'text')
        .addColumn('revokedAt', 'text')
        .addColumn('createdAt', 'text', (col) => col.notNull())
        .addColumn('updatedAt', 'text', (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
        .execute();
    await db.schema
        .createIndex('verification_issuer_idx')
        .on('verification')
        .column('issuer')
        .execute();
    await db.schema
        .createIndex('verification_createdat_uri_idx')
        .on('verification')
        .columns(['createdAt', 'uri'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('verification').execute();
}
//# sourceMappingURL=20250415T201720309Z-verification.js.map