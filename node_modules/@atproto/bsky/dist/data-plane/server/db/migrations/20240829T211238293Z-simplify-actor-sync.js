"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema.alterTable('actor_sync').dropColumn('commitDataCid').execute();
    await db.schema.alterTable('actor_sync').dropColumn('rebaseCount').execute();
    await db.schema.alterTable('actor_sync').dropColumn('tooBigCount').execute();
    // Migration code
}
async function down(db) {
    await db.schema
        .alterTable('actor_sync')
        .addColumn('commitDataCid', 'varchar', (col) => col.notNull())
        .execute();
    await db.schema
        .alterTable('actor_sync')
        .addColumn('rebaseCount', 'integer', (col) => col.notNull())
        .execute();
    await db.schema
        .alterTable('actor_sync')
        .addColumn('tooBigCount', 'integer', (col) => col.notNull())
        .execute();
}
//# sourceMappingURL=20240829T211238293Z-simplify-actor-sync.js.map