"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema.dropTable('post_hierarchy').execute();
    // recreate index that calculates e.g. "replyCount", turning it into a covering index
    // for uri so that recursive query for post descendents can use an index-only scan.
    await db.schema.dropIndex('post_replyparent_idx').execute();
    await (0, kysely_1.sql) `create index "post_replyparent_idx" on "post" ("replyParent") include ("uri")`.execute(db);
}
async function down(db) {
    await db.schema
        .createTable('post_hierarchy')
        .addColumn('uri', 'varchar', (col) => col.notNull())
        .addColumn('ancestorUri', 'varchar', (col) => col.notNull())
        .addColumn('depth', 'integer', (col) => col.notNull())
        .addPrimaryKeyConstraint('post_hierarchy_pkey', ['uri', 'ancestorUri'])
        .execute();
    await db.schema
        .createIndex('post_hierarchy_ancestoruri_idx')
        .on('post_hierarchy')
        .column('ancestorUri')
        .execute();
    await db.schema.dropIndex('post_replyparent_idx').execute();
    await db.schema
        .createIndex('post_replyparent_idx')
        .on('post')
        .column('replyParent')
        .execute();
}
//# sourceMappingURL=20230629T220835893Z-remove-post-hierarchy.js.map