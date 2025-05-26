"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('actor')
        .addColumn('upstreamStatus', 'varchar')
        .execute();
}
async function down(db) {
    await db.schema.alterTable('actor').dropColumn('upstreamStatus').execute();
}
//# sourceMappingURL=20240530T170337073Z-account-deactivation.js.map