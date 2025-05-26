import { Kysely, Migration, MigrationProvider } from 'kysely';
export declare class CtxMigrationProvider<T> implements MigrationProvider {
    private migrations;
    private ctx;
    constructor(migrations: Record<string, CtxMigration<T>>, ctx: T);
    getMigrations(): Promise<Record<string, Migration>>;
}
export interface CtxMigration<T> {
    up(db: Kysely<unknown>, ctx: T): Promise<void>;
    down?(db: Kysely<unknown>, ctx: T): Promise<void>;
}
//# sourceMappingURL=provider.d.ts.map