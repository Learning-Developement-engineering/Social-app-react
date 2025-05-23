"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema.alterTable('label').addColumn('exp', 'varchar').execute();
}
async function down(db) {
    await db.schema.alterTable('label').dropColumn('exp').execute();
}
//# sourceMappingURL=20250207T174822012Z-add-label-exp.js.map