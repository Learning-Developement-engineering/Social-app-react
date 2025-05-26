"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    const ref = db.dynamic.ref;
    await (0, kysely_1.sql) `CREATE INDEX moderation_subject_status_sort_idx ON ${ref('moderation_subject_status')} (${ref('lastReportedAt')} DESC NULLS LAST, ${ref('id')} DESC NULLS LAST);`.execute(db);
    await (0, kysely_1.sql) `CREATE INDEX moderation_subject_status_unreviewed_sort_idx ON ${ref('moderation_subject_status')} (${ref('lastReportedAt')} DESC NULLS LAST, ${ref('id')} DESC NULLS LAST) WHERE ${ref('reviewState')} = 'tools.ozone.moderation.defs#reviewNone';`.execute(db);
}
async function down(db) {
    await db.schema.dropIndex('moderation_subject_status_sort_idx').execute();
    await db.schema
        .dropIndex('moderation_subject_status_unreviewed_sort_idx')
        .execute();
}
//# sourceMappingURL=20250404T201720309Z-subject-status-sort-idxs.js.map