"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbMigrationProvider = void 0;
class DbMigrationProvider {
    constructor(migrations) {
        Object.defineProperty(this, "migrations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: migrations
        });
    }
    async getMigrations() {
        return this.migrations;
    }
}
exports.DbMigrationProvider = DbMigrationProvider;
//# sourceMappingURL=provider.js.map