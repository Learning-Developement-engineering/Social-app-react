"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema.alterTable('post').addColumn('tags', 'jsonb').execute();
}
async function down(db) {
    await db.schema.alterTable('post').dropColumn('tags').execute();
}
//# sourceMappingURL=20230920T213858047Z-add-tags-to-post.js.map