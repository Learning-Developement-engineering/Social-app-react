"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('actor_block')
        .addColumn('uri', 'varchar', (col) => col.primaryKey())
        .addColumn('cid', 'varchar', (col) => col.notNull())
        .addColumn('creator', 'varchar', (col) => col.notNull())
        .addColumn('subjectDid', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addColumn('indexedAt', 'varchar', (col) => col.notNull())
        .addColumn('sortAt', 'varchar', (col) => col
        .generatedAlwaysAs((0, kysely_1.sql) `least("createdAt", "indexedAt")`)
        .stored()
        .notNull())
        .addUniqueConstraint('actor_block_unique_subject', [
        'creator',
        'subjectDid',
    ])
        .execute();
    await db.schema
        .createIndex('actor_block_subjectdid_idx')
        .on('actor_block')
        .column('subjectDid')
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('actor_block_subjectdid_idx').execute();
    await db.schema.dropTable('actor_block').execute();
}
//# sourceMappingURL=20230609T153623961Z-blocks.js.map