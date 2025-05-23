"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema.alterTable('post').addColumn('langs', 'jsonb').execute();
}
async function down(db) {
    await db.schema.alterTable('post').dropColumn('langs').execute();
}
//# sourceMappingURL=20230620T161134972Z-post-langs.js.map