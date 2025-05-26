import { Code, ConnectError, Interceptor, PromiseClient } from '@connectrpc/connect';
import { ConnectTransportOptions } from '@connectrpc/connect-node';
import { Service } from './proto/courier_connect';
export type CourierClient = PromiseClient<typeof Service>;
export declare const createCourierClient: (opts: ConnectTransportOptions) => CourierClient;
export { Code };
export declare const isCourierError: (err: unknown, code?: Code) => err is ConnectError;
export declare const authWithApiKey: (apiKey: string) => Interceptor;
//# sourceMappingURL=courier.d.ts.map