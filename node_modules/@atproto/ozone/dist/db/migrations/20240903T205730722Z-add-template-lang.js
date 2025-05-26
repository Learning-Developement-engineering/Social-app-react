"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('communication_template')
        .addColumn('lang', 'varchar')
        .execute();
}
async function down(db) {
    await db.schema.alterTable('moderation_event').dropColumn('lang').execute();
}
//# sourceMappingURL=20240903T205730722Z-add-template-lang.js.map