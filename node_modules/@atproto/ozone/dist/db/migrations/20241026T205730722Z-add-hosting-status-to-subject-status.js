"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('hostingStatus', 'varchar', (col) => col.notNull().defaultTo('unknown'))
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('hostingDeletedAt', 'varchar')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('hostingUpdatedAt', 'varchar')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('hostingCreatedAt', 'varchar')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('hostingDeactivatedAt', 'varchar')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('hostingReactivatedAt', 'varchar')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('hostingStatus')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('hostingDeletedAt')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('hostingUpdatedAt')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('hostingCreatedAt')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('hostingDeactivatedAt')
        .execute();
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('hostingReactivatedAt')
        .execute();
}
//# sourceMappingURL=20241026T205730722Z-add-hosting-status-to-subject-status.js.map