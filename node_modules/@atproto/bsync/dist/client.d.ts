import { Interceptor, PromiseClient } from '@connectrpc/connect';
import { ConnectTransportOptions } from '@connectrpc/connect-node';
import { Service } from './proto/bsync_connect';
export type BsyncClient = PromiseClient<typeof Service>;
export declare const createClient: (opts: ConnectTransportOptions) => BsyncClient;
export declare const authWithApiKey: (apiKey: string) => Interceptor;
//# sourceMappingURL=client.d.ts.map