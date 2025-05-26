"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('post_agg')
        .addColumn('quoteCount', 'bigint', (col) => col.notNull().defaultTo(0))
        .execute();
}
async function down(db) {
    await db.schema.alterTable('post_agg').dropColumn('quoteCount').execute();
}
//# sourceMappingURL=20240723T220700077Z-quotes-post-aggs.js.map