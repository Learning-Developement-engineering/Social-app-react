"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('actor_sync')
        .addColumn('repoRev', 'varchar')
        .execute();
}
async function down(db) {
    await db.schema.alterTable('actor_sync').dropColumn('repoRev').execute();
}
//# sourceMappingURL=20230808T172902639Z-repo-rev.js.map