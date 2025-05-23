import { Migrator } from 'kysely';
import { Pool as PgPool } from 'pg';
import TypedEmitter from 'typed-emitter';
import { DatabaseSchema } from './schema';
import { PgOptions } from './types';
export declare class Database {
    opts: PgOptions;
    pool: PgPool;
    db: DatabaseSchema;
    migrator: Migrator;
    txEvt: TxnEmitter;
    destroyed: boolean;
    constructor(opts: PgOptions, instances?: {
        db: DatabaseSchema;
        pool: PgPool;
    });
    get schema(): string | undefined;
    get isTransaction(): boolean;
    assertTransaction(): void;
    assertNotTransaction(): void;
    transaction<T>(fn: (db: Database) => Promise<T>): Promise<T>;
    onCommit(fn: () => void): void;
    close(): Promise<void>;
    migrateToOrThrow(migration: string): Promise<import("kysely").MigrationResult[]>;
    migrateToLatestOrThrow(): Promise<import("kysely").MigrationResult[]>;
}
export default Database;
type TxnEmitter = TypedEmitter<TxnEvents>;
type TxnEvents = {
    commit: () => void;
};
//# sourceMappingURL=index.d.ts.map