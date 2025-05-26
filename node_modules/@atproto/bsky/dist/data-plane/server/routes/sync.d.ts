import { ServiceImpl } from '@connectrpc/connect';
import { Service } from '../../../proto/bsky_connect';
import { Database } from '../db';
declare const _default: (db: Database) => Partial<ServiceImpl<typeof Service>>;
export default _default;
//# sourceMappingURL=sync.d.ts.map