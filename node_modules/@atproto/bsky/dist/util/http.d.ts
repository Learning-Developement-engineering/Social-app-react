import { IncomingMessage, ServerResponse } from 'node:http';
import { IncomingHttpHeaders } from 'undici/types/header';
type NextFunction = (err?: unknown) => void;
export type Middleware = (req: IncomingMessage, res: ServerResponse, next: NextFunction) => void;
export type ResponseData = {
    statusCode: number;
    headers: IncomingHttpHeaders;
};
export declare function proxyResponseHeaders(data: ResponseData, res: ServerResponse): void;
export declare function responseSignal(res: ServerResponse): AbortSignal;
export {};
//# sourceMappingURL=http.d.ts.map