"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('post_agg')
        .addColumn('uri', 'varchar', (col) => col.primaryKey())
        .addColumn('likeCount', 'bigint', (col) => col.notNull().defaultTo(0))
        .addColumn('replyCount', 'bigint', (col) => col.notNull().defaultTo(0))
        .addColumn('repostCount', 'bigint', (col) => col.notNull().defaultTo(0))
        .execute();
    await db.schema
        .createTable('profile_agg')
        .addColumn('did', 'varchar', (col) => col.primaryKey())
        .addColumn('followersCount', 'bigint', (col) => col.notNull().defaultTo(0))
        .addColumn('followsCount', 'bigint', (col) => col.notNull().defaultTo(0))
        .addColumn('postsCount', 'bigint', (col) => col.notNull().defaultTo(0))
        .execute();
}
async function down(db) {
    await db.schema.dropTable('profile_agg').execute();
    await db.schema.dropTable('post_agg').execute();
}
//# sourceMappingURL=20230605T144730094Z-post-profile-aggs.js.map