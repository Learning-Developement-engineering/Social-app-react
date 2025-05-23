import { Code, PromiseClient } from '@connectrpc/connect';
import { Service } from '../../proto/bsky_connect';
import { HostList } from './hosts';
export * from './hosts';
export * from './util';
export type DataPlaneClient = PromiseClient<typeof Service>;
type HttpVersion = '1.1' | '2';
export declare const createDataPlaneClient: (hostList: HostList, opts: {
    httpVersion?: HttpVersion;
    rejectUnauthorized?: boolean;
}) => DataPlaneClient;
export { Code };
//# sourceMappingURL=index.d.ts.map