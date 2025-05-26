"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('thread_gate')
        .addColumn('uri', 'varchar', (col) => col.primaryKey())
        .addColumn('cid', 'varchar', (col) => col.notNull())
        .addColumn('creator', 'varchar', (col) => col.notNull())
        .addColumn('postUri', 'varchar', (col) => col.notNull().unique())
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addColumn('indexedAt', 'varchar', (col) => col.notNull())
        .execute();
    await db.schema
        .alterTable('post')
        .addColumn('invalidReplyRoot', 'boolean')
        .execute();
    await db.schema
        .alterTable('post')
        .addColumn('violatesThreadGate', 'boolean')
        .execute();
}
async function down(db) {
    await db.schema.dropTable('thread_gate').execute();
    await db.schema.alterTable('post').dropColumn('invalidReplyRoot').execute();
    await db.schema.alterTable('post').dropColumn('violatesThreadGate').execute();
}
//# sourceMappingURL=20230906T222220386Z-thread-gating.js.map