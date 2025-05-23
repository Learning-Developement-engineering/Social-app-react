"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('verification')
        .addColumn('uri', 'varchar', (col) => col.notNull().primaryKey())
        .addColumn('cid', 'varchar', (col) => col.notNull())
        .addColumn('rkey', 'varchar', (col) => col.notNull())
        .addColumn('creator', 'varchar', (col) => col.notNull())
        .addColumn('subject', 'varchar', (col) => col.notNull())
        .addUniqueConstraint('verification_unique_subject_creator', [
        'subject',
        'creator',
    ])
        .addColumn('handle', 'varchar', (col) => col.notNull())
        .addColumn('displayName', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addColumn('indexedAt', 'varchar', (col) => col.notNull())
        .addColumn('sortedAt', 'varchar', (col) => col
        .generatedAlwaysAs((0, kysely_1.sql) `least("createdAt", "indexedAt")`)
        .stored()
        .notNull())
        .execute();
    await db.schema
        .alterTable('actor')
        .addColumn('trustedVerifier', 'boolean', (col) => col.notNull().defaultTo(false))
        .execute();
}
async function down(db) {
    await db.schema.alterTable('actor').dropColumn('trustedVerifier').execute();
    await db.schema.dropTable('verification').execute();
}
//# sourceMappingURL=20250404T163421487Z-verifications.js.map