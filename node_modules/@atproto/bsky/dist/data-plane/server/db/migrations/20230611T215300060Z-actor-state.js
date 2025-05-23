"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('actor_state')
        .addColumn('did', 'varchar', (col) => col.primaryKey())
        .addColumn('lastSeenNotifs', 'varchar', (col) => col.notNull())
        .execute();
}
async function down(db) {
    await db.schema.dropTable('actor_state').execute();
}
//# sourceMappingURL=20230611T215300060Z-actor-state.js.map