import { Selectable } from 'kysely';
import { Setting } from '../db/schema/setting';
export declare const settingValidators: Map<string, (setting: Partial<Selectable<Setting>>) => Promise<void>>;
//# sourceMappingURL=validators.d.ts.map