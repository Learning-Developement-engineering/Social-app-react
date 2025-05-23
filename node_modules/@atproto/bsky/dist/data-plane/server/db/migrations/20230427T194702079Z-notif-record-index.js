"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    // Supports record deletion
    await db.schema
        .createIndex('notification_record_idx')
        .on('notification')
        .column('recordUri')
        .execute();
}
async function down(db) {
    await db.schema.dropIndex('notification_record_idx').execute();
}
//# sourceMappingURL=20230427T194702079Z-notif-record-index.js.map