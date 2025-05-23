"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createIndex('label_cts_idx')
        .on('label')
        .column('cts')
        .execute();
    await db.schema.dropIndex('feed_item_originator_idx').execute();
    await db.schema
        .createIndex('feed_item_originator_cursor_idx')
        .on('feed_item')
        .columns(['originatorDid', 'sortAt', 'cid'])
        .execute();
    await db.schema
        .createIndex('record_did_idx')
        .on('record')
        .column('did')
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('label_cts_idx').execute();
    await db.schema.dropIndex('feed_item_originator_cursor_idx').execute();
    await db.schema
        .createIndex('feed_item_originator_idx')
        .on('feed_item')
        .column('originatorDid')
        .execute();
    await db.schema.dropIndex('record_did_idx').execute();
}
//# sourceMappingURL=20230703T045536691Z-feed-and-label-indices.js.map