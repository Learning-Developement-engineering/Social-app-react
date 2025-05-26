import { Selectable } from 'kysely';
import { Database } from '../db';
import { Member } from '../db/schema/member';
import { Setting, SettingScope } from '../db/schema/setting';
import { Option } from '../lexicon/types/tools/ozone/setting/defs';
export type SettingServiceCreator = (db: Database) => SettingService;
export declare class SettingService {
    db: Database;
    constructor(db: Database);
    static creator(): (db: Database) => SettingService;
    query({ limit, scope, did, cursor, prefix, keys, }: {
        limit: number;
        scope?: 'personal' | 'instance';
        did?: string;
        cursor?: string;
        prefix?: string;
        keys?: string[];
    }): Promise<{
        options: Selectable<Setting>[];
        cursor?: string;
    }>;
    upsert(option: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'> & {
        createdAt: Date;
        updatedAt: Date;
    }): Promise<void>;
    removeOptions(keys: string[], filters: {
        did?: string;
        scope: SettingScope;
        managerRole: Member['role'][];
    }): Promise<void>;
    view(setting: Selectable<Setting>): Option;
}
//# sourceMappingURL=service.d.ts.map