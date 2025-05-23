"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('moderation_action')
        .addColumn('durationInHours', 'integer')
        .execute();
    await db.schema
        .alterTable('moderation_action')
        .addColumn('expiresAt', 'varchar')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('moderation_action')
        .dropColumn('durationInHours')
        .execute();
    await db.schema
        .alterTable('moderation_action')
        .dropColumn('expiresAt')
        .execute();
}
//# sourceMappingURL=20230810T203349843Z-action-duration.js.map