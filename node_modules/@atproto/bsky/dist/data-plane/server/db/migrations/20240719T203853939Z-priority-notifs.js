"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('actor_state')
        .addColumn('priorityNotifs', 'boolean', (col) => col.notNull().defaultTo(false))
        .execute();
    await db.schema
        .alterTable('actor_state')
        .addColumn('lastSeenPriorityNotifs', 'varchar')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('actor_state')
        .dropColumn('priorityNotifs')
        .execute();
    await db.schema
        .alterTable('actor_state')
        .dropColumn('lastSeenPriorityNotifs')
        .execute();
}
//# sourceMappingURL=20240719T203853939Z-priority-notifs.js.map