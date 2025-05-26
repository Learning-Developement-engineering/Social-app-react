import { DummyDriver, DynamicModule, ExpressionBuilder, RawBuilder, SelectQueryBuilder, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler } from 'kysely';
import { DatabaseSchema, DatabaseSchemaType } from './database-schema';
export declare const actorWhereClause: (actor: string) => RawBuilder<0 | 1>;
export declare const notSoftDeletedClause: (alias: DbRef) => RawBuilder<unknown>;
export declare const softDeleted: (actorOrRecord: {
    takedownRef: string | null;
}) => boolean;
export declare const countAll: RawBuilder<number>;
export declare const excluded: <T>(db: DatabaseSchema, col: any) => RawBuilder<T>;
export declare const noMatch: RawBuilder<unknown>;
export declare const valuesList: (vals: unknown[]) => RawBuilder<unknown>;
export declare const dummyDialect: {
    createAdapter(): SqliteAdapter;
    createDriver(): DummyDriver;
    createIntrospector(db: any): SqliteIntrospector;
    createQueryCompiler(): SqliteQueryCompiler;
};
export type DbRef = RawBuilder | ReturnType<DynamicModule['ref']>;
export type Subquery = ExpressionBuilder<DatabaseSchemaType, any>;
export type AnyQb = SelectQueryBuilder<any, any, any>;
//# sourceMappingURL=util.d.ts.map