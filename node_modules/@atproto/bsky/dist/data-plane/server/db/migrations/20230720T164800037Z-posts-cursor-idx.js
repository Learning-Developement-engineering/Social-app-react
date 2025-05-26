"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createIndex('post_creator_cursor_idx')
        .on('post')
        .columns(['creator', 'sortAt', 'cid'])
        .execute();
    await db.schema.dropIndex('post_creator_idx').execute();
}
async function down(db) {
    await db.schema
        .createIndex('post_creator_idx')
        .on('post')
        .column('creator')
        .execute();
    await db.schema.dropIndex('post_creator_cursor_idx').execute();
}
//# sourceMappingURL=20230720T164800037Z-posts-cursor-idx.js.map