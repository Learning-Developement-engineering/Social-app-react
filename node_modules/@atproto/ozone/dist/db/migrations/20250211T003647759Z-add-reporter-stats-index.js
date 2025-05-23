"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await (0, kysely_1.sql) `
    CREATE INDEX "moderation_event_account_reports_idx"
    ON moderation_event("createdBy","subjectDid", "createdAt")
    WHERE "subjectUri" IS NULL
    AND "action" = 'tools.ozone.moderation.defs#modEventReport'
  `.execute(db);
    await (0, kysely_1.sql) `
    CREATE INDEX "moderation_event_record_reports_idx"
    ON moderation_event("createdBy","subjectDid","subjectUri", "createdAt")
    WHERE "subjectUri" IS NOT NULL
    AND "action" = 'tools.ozone.moderation.defs#modEventReport'
  `.execute(db);
    await (0, kysely_1.sql) `
    CREATE INDEX "moderation_event_account_actions_ids"
    ON moderation_event("subjectDid","action", "createdAt")
    WHERE "subjectUri" IS NULL
    AND "action" IN ( 'tools.ozone.moderation.defs#modEventTakedown', 'tools.ozone.moderation.defs#modEventLabel')
  `.execute(db);
    await (0, kysely_1.sql) `
    CREATE INDEX "moderation_event_record_actions_ids"
    ON moderation_event("subjectDid","subjectUri", "action", "createdAt")
    WHERE "subjectUri" IS NOT NULL
    AND "action" IN ( 'tools.ozone.moderation.defs#modEventTakedown', 'tools.ozone.moderation.defs#modEventLabel')
  `.execute(db);
}
async function down(db) {
    await db.schema.dropIndex('moderation_event_account_reports_idx').execute();
    await db.schema.dropIndex('moderation_event_record_reports_idx').execute();
    await db.schema.dropIndex('moderation_event_account_actions_ids').execute();
    await db.schema.dropIndex('moderation_event_record_actions_ids').execute();
}
//# sourceMappingURL=20250211T003647759Z-add-reporter-stats-index.js.map