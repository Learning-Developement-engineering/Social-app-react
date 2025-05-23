"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .createTable('mute')
        .addColumn('subjectDid', 'varchar', (col) => col.notNull())
        .addColumn('mutedByDid', 'varchar', (col) => col.notNull())
        .addColumn('createdAt', 'varchar', (col) => col.notNull())
        .addPrimaryKeyConstraint('mute_pkey', ['mutedByDid', 'subjectDid'])
        .execute();
}
async function down(db) {
    await db.schema.dropTable('mute').execute();
}
//# sourceMappingURL=20230608T205147239Z-mutes.js.map