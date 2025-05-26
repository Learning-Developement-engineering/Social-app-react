"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('moderation_subject_status')
        .addColumn('muteReportingUntil', 'varchar')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('moderation_subject_status')
        .dropColumn('muteReportingUntil')
        .execute();
}
//# sourceMappingURL=20240408T192432676Z-mute-reporting.js.map