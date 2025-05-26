"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    // postEmbedVideo
    await db.schema
        .createTable('post_embed_video')
        .addColumn('postUri', 'varchar', (col) => col.notNull())
        .addColumn('videoCid', 'varchar', (col) => col.notNull())
        .addColumn('alt', 'varchar')
        .addPrimaryKeyConstraint('post_embed_video_pkey', ['postUri'])
        .execute();
}
async function down(db) {
    // postEmbedVideo
    await db.schema.dropTable('post_embed_video').execute();
}
//# sourceMappingURL=20250116T222618297Z-post-embed-video.js.map