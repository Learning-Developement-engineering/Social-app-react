"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(db) {
    await db.schema
        .alterTable('post')
        .addColumn('violatesEmbeddingRules', 'boolean')
        .execute();
    await db.schema
        .alterTable('post')
        .addColumn('hasThreadGate', 'boolean')
        .execute();
    await db.schema
        .alterTable('post')
        .addColumn('hasPostGate', 'boolean')
        .execute();
}
async function down(db) {
    await db.schema
        .alterTable('post')
        .dropColumn('violatesEmbeddingRules')
        .execute();
    await db.schema.alterTable('post').dropColumn('hasThreadGate').execute();
    await db.schema.alterTable('post').dropColumn('hasPostGate').execute();
}
//# sourceMappingURL=20240808T224251220Z-post-gate-flags.js.map