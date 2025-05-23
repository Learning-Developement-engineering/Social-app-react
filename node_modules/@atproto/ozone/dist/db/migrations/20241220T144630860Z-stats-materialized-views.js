"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
const defs_1 = require("../../lexicon/types/com/atproto/moderation/defs");
const defs_2 = require("../../lexicon/types/tools/ozone/moderation/defs");
async function up(db) {
    // Used by "tools.ozone.moderation.queryStatuses". Reduces query cost by two
    // order of magnitudes when sorting using "reportedRecordsCount" or
    // "takendownRecordsCount" and filtering by "reviewState".
    await db.schema
        .createIndex('moderation_subject_status_did_id_review_state_idx')
        .on('moderation_subject_status')
        .column('did')
        .expression((0, kysely_1.sql) `"id" ASC NULLS FIRST`)
        .column('reviewState')
        .execute();
    // ~6sec for 16M events
    await db.schema
        .createView('account_events_stats')
        .materialized()
        .ifNotExists()
        .as(db
        .selectFrom('moderation_event')
        .where('subjectType', '=', 'com.atproto.admin.defs#repoRef')
        .where('subjectUri', 'is', null)
        .select('subjectDid')
        .select([
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER(
              WHERE ${eb.ref('action')} = 'tools.ozone.moderation.defs#modEventTakedown'
              AND ${eb.ref('durationInHours')} IS NULL
            )`.as('takedownCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER(
              WHERE ${eb.ref('action')} = 'tools.ozone.moderation.defs#modEventTakedown'
              AND ${eb.ref('durationInHours')} IS NOT NULL
            )`.as('suspendCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER(
              WHERE ${eb.ref('action')} = 'tools.ozone.moderation.defs#modEventEscalate'
            )`.as('escalateCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER(
              WHERE ${eb.ref('action')} = 'tools.ozone.moderation.defs#modEventReport'
              AND ${eb.ref('meta')} ->> 'reportType' != ${defs_1.REASONAPPEAL}
            )`.as('reportCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER(
              WHERE ${eb.ref('action')} = 'tools.ozone.moderation.defs#modEventReport'
              AND ${eb.ref('meta')} ->> 'reportType' = ${defs_1.REASONAPPEAL}
            )`.as('appealCount'),
    ])
        .groupBy('subjectDid'))
        .execute();
    await db.schema
        .createIndex('account_events_stats_did_idx')
        .unique()
        .on('account_events_stats')
        .column('subjectDid')
        .execute();
    await db.schema
        .createIndex('account_events_stats_suspend_count_idx')
        .on('account_events_stats')
        .expression((0, kysely_1.sql) `"suspendCount" ASC NULLS FIRST`)
        .column('subjectDid')
        .execute();
    // ~50sec for 16M events
    await db.schema
        .createView('record_events_stats')
        .materialized()
        .ifNotExists()
        .as(db
        .selectFrom('moderation_event')
        .select([
        'subjectDid',
        'subjectUri',
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('action')} = 'tools.ozone.moderation.defs#modEventEscalate')`.as('escalateCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('action')} = 'tools.ozone.moderation.defs#modEventReport' AND ${eb.ref('meta')} ->> 'reportType' != 'com.atproto.moderation.defs#reasonAppeal')`.as('reportCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('action')} = 'tools.ozone.moderation.defs#modEventReport' AND ${eb.ref('meta')} ->> 'reportType' = 'com.atproto.moderation.defs#reasonAppeal')`.as('appealCount'),
    ])
        .where('subjectType', '=', 'com.atproto.repo.strongRef')
        .where('subjectUri', 'is not', null)
        .groupBy(['subjectDid', 'subjectUri']))
        .execute();
    await db.schema
        .createIndex('record_events_stats_uri_idx')
        .unique()
        .on('record_events_stats')
        .column('subjectUri')
        .execute();
    await db.schema
        .createIndex('record_events_stats_did_idx')
        .on('record_events_stats')
        .column('subjectDid')
        .execute();
    await db.schema
        .createView('account_record_events_stats')
        .materialized()
        .ifNotExists()
        .as(db
        .selectFrom('record_events_stats')
        .select([
        'subjectDid',
        (eb) => 
        // Casting to "bigint" because "numeric" gets casted to a string
        // by default by postgres-node.
        (0, kysely_1.sql) `SUM(${eb.ref('reportCount')})::bigint`.as('totalReports'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('reportCount')} > 0)`.as('reportedCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('escalateCount')} > 0)`.as('escalatedCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('appealCount')} > 0)`.as('appealedCount'),
    ])
        .groupBy('subjectDid'))
        .execute();
    await db.schema
        .createIndex('account_record_events_stats_did_idx')
        .unique()
        .on('account_record_events_stats')
        .column('subjectDid')
        .execute();
    await db.schema
        .createIndex('account_record_events_stats_reported_count_idx')
        .on('account_record_events_stats')
        .expression((0, kysely_1.sql) `"reportedCount" ASC NULLS FIRST`)
        .column('subjectDid')
        .execute();
    await db.schema
        .createView('account_record_status_stats')
        .materialized()
        .ifNotExists()
        .as(db
        .selectFrom('moderation_subject_status')
        .select('did')
        .select([
        (0, kysely_1.sql) `COUNT(*)`.as('subjectCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('reviewState')} IN (${defs_2.REVIEWOPEN}, ${defs_2.REVIEWESCALATED}))`.as('pendingCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('reviewState')} NOT IN (${defs_2.REVIEWOPEN}, ${defs_2.REVIEWESCALATED}))`.as('processedCount'),
        (eb) => (0, kysely_1.sql) `COUNT(*) FILTER (WHERE ${eb.ref('takendown')})`.as('takendownCount'),
    ])
        .where('recordPath', '!=', '')
        .groupBy('did'))
        .execute();
    await db.schema
        .createIndex('account_record_status_stats_did_idx')
        .unique()
        .on('account_record_status_stats')
        .column('did')
        .execute();
    await db.schema
        .createIndex('account_record_status_stats_takendown_count_idx')
        .on('account_record_status_stats')
        .expression((0, kysely_1.sql) `"takendownCount" ASC NULLS FIRST`)
        .column('did')
        .execute();
}
async function down(db) {
    db.schema.dropView('account_record_status_stats').materialized().execute();
    db.schema.dropView('account_record_events_stats').materialized().execute();
    db.schema.dropView('record_events_stats').materialized().execute();
    db.schema.dropView('account_events_stats').materialized().execute();
}
//# sourceMappingURL=20241220T144630860Z-stats-materialized-views.js.map