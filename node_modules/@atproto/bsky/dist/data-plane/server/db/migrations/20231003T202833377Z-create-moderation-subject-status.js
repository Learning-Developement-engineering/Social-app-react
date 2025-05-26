"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('moderation_event')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('action', 'varchar', (col) => col.notNull())
        .addColumn('subjectType', 'varchar', (col) => col.notNull())
        .addColumn('subjectDid', 'varchar', (col) => col.notNull())
        .addColumn('subjectUri', 'varchar')
        .addColumn('subjectCid', 'varchar')
        .addColumn('comment', 'text')
        .addColumn('meta', 'jsonb')
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addColumn('createdBy', 'varchar', (col) => col.notNull())
        .addColumn('reversedAt', 'varchar')
        .addColumn('reversedBy', 'varchar')
        .addColumn('durationInHours', 'integer')
        .addColumn('expiresAt', 'varchar')
        .addColumn('reversedReason', 'text')
        .addColumn('createLabelVals', 'varchar')
        .addColumn('negateLabelVals', 'varchar')
        .addColumn('legacyRefId', 'integer')
        .execute();
    await db.schema
        .createTable('moderation_subject_status')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        // Identifiers
        .addColumn('did', 'varchar', (col) => col.notNull())
        // Default to '' so that we can apply unique constraints on did and recordPath columns
        .addColumn('recordPath', 'varchar', (col) => col.notNull().defaultTo(''))
        .addColumn('blobCids', 'jsonb')
        .addColumn('recordCid', 'varchar')
        // human review team state
        .addColumn('reviewState', 'varchar', (col) => col.notNull())
        .addColumn('comment', 'varchar')
        .addColumn('muteUntil', 'varchar')
        .addColumn('lastReviewedAt', 'varchar')
        .addColumn('lastReviewedBy', 'varchar')
        // report state
        .addColumn('lastReportedAt', 'varchar')
        // visibility/intervention state
        .addColumn('takendown', 'boolean', (col) => col.defaultTo(false).notNull())
        .addColumn('suspendUntil', 'varchar')
        // timestamps
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addColumn('updatedAt', 'varchar', (col) => col.notNull())
        .addUniqueConstraint('moderation_status_unique_idx', ['did', 'recordPath'])
        .execute();
    await db.schema
        .createIndex('moderation_subject_status_blob_cids_idx')
        .on('moderation_subject_status')
        .using('gin')
        .column('blobCids')
        .execute();
    // Move foreign keys from moderation_action to moderation_event
    await db.schema
        .alterTable('record')
        .dropConstraint('record_takedown_id_fkey')
        .execute();
    await db.schema
        .alterTable('actor')
        .dropConstraint('actor_takedown_id_fkey')
        .execute();
    await db.schema
        .alterTable('actor')
        .addForeignKeyConstraint('actor_takedown_id_fkey', ['takedownId'], 'moderation_event', ['id'])
        .execute();
    await db.schema
        .alterTable('record')
        .addForeignKeyConstraint('record_takedown_id_fkey', ['takedownId'], 'moderation_event', ['id'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('moderation_event').execute();
    await db.schema.dropTable('moderation_subject_status').execute();
    // Revert foreign key constraints
    await db.schema
        .alterTable('record')
        .dropConstraint('record_takedown_id_fkey')
        .execute();
    await db.schema
        .alterTable('actor')
        .dropConstraint('actor_takedown_id_fkey')
        .execute();
    await db.schema
        .alterTable('actor')
        .addForeignKeyConstraint('actor_takedown_id_fkey', ['takedownId'], 'moderation_action', ['id'])
        .execute();
    await db.schema
        .alterTable('record')
        .addForeignKeyConstraint('record_takedown_id_fkey', ['takedownId'], 'moderation_action', ['id'])
        .execute();
}
//# sourceMappingURL=20231003T202833377Z-create-moderation-subject-status.js.map