import { ServiceImpl } from '@connectrpc/connect';
import { IdResolver } from '@atproto/identity';
import { Service } from '../../../proto/bsky_connect';
import { Database } from '../db';
declare const _default: (_db: Database, idResolver: IdResolver) => Partial<ServiceImpl<typeof Service>>;
export default _default;
//# sourceMappingURL=identity.d.ts.map