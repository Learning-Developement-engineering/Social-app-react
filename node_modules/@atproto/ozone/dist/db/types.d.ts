import { DynamicModule, RawBuilder, SelectQueryBuilder } from 'kysely';
import { Pool as PgPool } from 'pg';
export type DbRef = RawBuilder | ReturnType<DynamicModule['ref']>;
export type AnyQb = SelectQueryBuilder<any, any, any>;
export type PgOptions = {
    url: string;
    pool?: PgPool;
    schema?: string;
    poolSize?: number;
    poolMaxUses?: number;
    poolIdleTimeoutMs?: number;
};
export declare const jsonb: <T>(val: T) => RawBuilder<T>;
//# sourceMappingURL=types.d.ts.map