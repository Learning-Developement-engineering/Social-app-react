"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('profile')
        .addColumn('pinnedPost', 'varchar')
        .execute();
    await db.schema
        .alterTable('profile')
        .addColumn('pinnedPostCid', 'varchar')
        .execute();
}
async function down(db) {
    await db.schema.alterTable('profile').dropColumn('pinnedPost').execute();
    await db.schema.alterTable('profile').dropColumn('pinnedPostCid').execute();
}
//# sourceMappingURL=20240831T134810923Z-pinned-posts.js.map