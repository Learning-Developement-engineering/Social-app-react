"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .createTable('feed_generator')
        .addColumn('uri', 'varchar', (col) => col.primaryKey())
        .addColumn('cid', 'varchar', (col) => col.notNull())
        .addColumn('creator', 'varchar', (col) => col.notNull())
        .addColumn('feedDid', 'varchar', (col) => col.notNull())
        .addColumn('displayName', 'varchar')
        .addColumn('description', 'varchar')
        .addColumn('descriptionFacets', 'varchar')
        .addColumn('avatarCid', 'varchar')
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addColumn('indexedAt', 'varchar', (col) => col.notNull())
        .addColumn('sortAt', 'varchar', (col) => col
        .generatedAlwaysAs((0, kysely_1.sql) `least("createdAt", "indexedAt")`)
        .stored()
        .notNull())
        .execute();
    await db.schema
        .createIndex('feed_generator_creator_index')
        .on('feed_generator')
        .column('creator')
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('feed_generator_creator_index').execute();
    await db.schema.dropTable('feed_generator').execute();
}
//# sourceMappingURL=20230607T211442112Z-feed-generator-init.js.map