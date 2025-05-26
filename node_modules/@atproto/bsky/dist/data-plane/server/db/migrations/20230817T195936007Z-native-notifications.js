"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('notification_push_token')
        .addColumn('did', 'varchar', (col) => col.notNull())
        .addColumn('platform', 'varchar', (col) => col.notNull())
        .addColumn('token', 'varchar', (col) => col.notNull())
        .addColumn('appId', 'varchar', (col) => col.notNull())
        .addPrimaryKeyConstraint('notification_push_token_pkey', ['did', 'token'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('notification_push_token').execute();
}
//# sourceMappingURL=20230817T195936007Z-native-notifications.js.map