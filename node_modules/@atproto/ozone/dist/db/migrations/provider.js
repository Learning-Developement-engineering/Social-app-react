"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxMigrationProvider = void 0;
// Passes a context argument to migrations. We use this to thread the dialect into migrations
class CtxMigrationProvider {
    constructor(migrations, ctx) {
        Object.defineProperty(this, "migrations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: migrations
        });
        Object.defineProperty(this, "ctx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ctx
        });
    }
    async getMigrations() {
        const ctxMigrations = {};
        Object.entries(this.migrations).forEach(([name, migration]) => {
            ctxMigrations[name] = {
                up: async (db) => await migration.up(db, this.ctx),
                down: async (db) => await migration.down?.(db, this.ctx),
            };
        });
        return ctxMigrations;
    }
}
exports.CtxMigrationProvider = CtxMigrationProvider;
//# sourceMappingURL=provider.js.map