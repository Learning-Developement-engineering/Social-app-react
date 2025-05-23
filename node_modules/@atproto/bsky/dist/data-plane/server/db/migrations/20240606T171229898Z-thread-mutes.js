"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('thread_mute')
        .addColumn('rootUri', 'varchar', (col) => col.notNull())
        .addColumn('mutedByDid', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addPrimaryKeyConstraint('thread_mute_pkey', ['rootUri', 'mutedByDid'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('thread_mute').execute();
}
//# sourceMappingURL=20240606T171229898Z-thread-mutes.js.map