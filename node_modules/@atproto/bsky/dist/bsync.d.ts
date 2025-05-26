import { Code, ConnectError, Interceptor, PromiseClient } from '@connectrpc/connect';
import { ConnectTransportOptions } from '@connectrpc/connect-node';
import { Service } from './proto/bsync_connect';
export type BsyncClient = PromiseClient<typeof Service>;
export declare const createBsyncClient: (opts: ConnectTransportOptions) => BsyncClient;
export { Code };
export declare const isBsyncError: (err: unknown, code?: Code) => err is ConnectError;
export declare const authWithApiKey: (apiKey: string) => Interceptor;
//# sourceMappingURL=bsync.d.ts.map