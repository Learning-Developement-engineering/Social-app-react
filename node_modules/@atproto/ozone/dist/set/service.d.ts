import { Selectable } from 'kysely';
import { Database } from '../db';
import { SetDetail } from '../db/schema/ozone_set';
import { SetView } from '../lexicon/types/tools/ozone/set/defs';
export type SetServiceCreator = (db: Database) => SetService;
export declare class SetService {
    db: Database;
    constructor(db: Database);
    static creator(): (db: Database) => SetService;
    buildQueryForSetWithSize(): import("kysely/dist/cjs/parser/select-parser").QueryBuilderWithSelection<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "s", {}, "s.id" | "s.createdAt" | "s.updatedAt" | "s.name" | "s.description" | ((eb: import("kysely").ExpressionBuilder<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "s">) => import("kysely").AliasedQueryBuilder<import("kysely/dist/cjs/parser/table-parser").From<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "set_value">, import("kysely/dist/cjs/parser/table-parser").FromTables<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "s", "set_value">, import("kysely").Selection<import("kysely/dist/cjs/parser/table-parser").From<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "set_value">, import("kysely/dist/cjs/parser/table-parser").FromTables<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "s", "set_value">, (e: import("kysely").ExpressionBuilder<import("kysely/dist/cjs/parser/table-parser").From<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "set_value">, import("kysely/dist/cjs/parser/table-parser").FromTables<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "s", "set_value">>) => import("kysely").AliasedAggregateFunctionBuilder<import("kysely/dist/cjs/parser/table-parser").From<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "set_value">, import("kysely/dist/cjs/parser/table-parser").FromTables<import("kysely/dist/cjs/parser/table-parser").From<import("../db/schema").DatabaseSchemaType, "set_detail as s">, "s", "set_value">, number, "count">>, "setSize">)>;
    query({ limit, cursor, namePrefix, sortBy, sortDirection, }: {
        limit: number;
        cursor?: string;
        namePrefix?: string;
        sortBy: 'name' | 'createdAt' | 'updatedAt';
        sortDirection: 'asc' | 'desc';
    }): Promise<{
        sets: Selectable<SetDetail & {
            setSize: number;
        }>[];
        cursor?: string;
    }>;
    getByName(name: string): Promise<Selectable<SetDetail> | undefined>;
    getByNameWithSize(name: string): Promise<Selectable<SetDetail & {
        setSize: number;
    }> | undefined>;
    getSetWithValues({ name, limit, cursor, }: {
        name: string;
        limit: number;
        cursor?: string;
    }): Promise<{
        set: Selectable<SetDetail & {
            setSize: number;
        }>;
        values: string[];
        cursor?: string;
    } | undefined>;
    upsert({ name, description, }: Pick<SetDetail, 'name' | 'description'>): Promise<void>;
    addValues(setId: number, values: string[]): Promise<void>;
    removeValues(setId: number, values: string[]): Promise<void>;
    removeSet(setId: number): Promise<void>;
    view(set: Selectable<SetDetail> & {
        setSize: number;
    }): SetView;
}
//# sourceMappingURL=service.d.ts.map