"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('actor')
        .alterColumn('handle')
        .dropNotNull()
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('actor')
        .alterColumn('handle')
        .setNotNull()
        .execute();
}
//# sourceMappingURL=20230627T212437895Z-optional-handle.js.map