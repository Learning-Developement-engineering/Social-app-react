import { Pool as PgPool } from 'pg';
export type PgOptions = {
    url: string;
    pool?: PgPool;
    schema?: string;
    poolSize?: number;
    poolMaxUses?: number;
    poolIdleTimeoutMs?: number;
};
//# sourceMappingURL=types.d.ts.map