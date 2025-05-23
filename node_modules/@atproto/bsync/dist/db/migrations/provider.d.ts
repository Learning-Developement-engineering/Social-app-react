import { Migration, MigrationProvider } from 'kysely';
export declare class DbMigrationProvider implements MigrationProvider {
    private migrations;
    constructor(migrations: Record<string, Migration>);
    getMigrations(): Promise<Record<string, Migration>>;
}
//# sourceMappingURL=provider.d.ts.map