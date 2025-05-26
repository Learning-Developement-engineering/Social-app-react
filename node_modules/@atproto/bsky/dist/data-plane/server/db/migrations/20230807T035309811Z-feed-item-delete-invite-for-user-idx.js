"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    // supports post deletion
    await db.schema
        .createIndex('feed_item_post_uri_idx')
        .on('feed_item')
        .column('postUri')
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('feed_item_post_uri_idx').execute();
}
//# sourceMappingURL=20230807T035309811Z-feed-item-delete-invite-for-user-idx.js.map