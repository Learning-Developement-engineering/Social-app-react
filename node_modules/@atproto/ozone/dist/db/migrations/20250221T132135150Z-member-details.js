"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema.alterTable('member').addColumn('handle', 'text').execute();
    await db.schema
        .alterTable('member')
        .addColumn('displayName', 'text')
        .execute();
}
async function down(db) {
    await db.schema.alterTable('member').dropColumn('handle').execute();
    await db.schema.alterTable('member').dropColumn('displayName').execute();
}
//# sourceMappingURL=20250221T132135150Z-member-details.js.map