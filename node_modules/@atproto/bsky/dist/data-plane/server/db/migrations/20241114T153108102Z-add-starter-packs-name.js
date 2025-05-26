"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const kysely_1 = require("kysely");
async function up(db) {
    await db.schema
        .alterTable('starter_pack')
        .addColumn('name', 'varchar')
        .execute();
    await db.schema // Supports starter pack search
        .createIndex(`starter_pack_name_tgrm_idx`)
        .on('starter_pack')
        .using('gist')
        .expression((0, kysely_1.sql) `"name" gist_trgm_ops`)
        .execute();
}
async function down(db) {
    await db.schema.alterTable('starter_pack').dropColumn('name').execute();
}
//# sourceMappingURL=20241114T153108102Z-add-starter-packs-name.js.map