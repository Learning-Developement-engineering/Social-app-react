import { type IncomingMessage } from 'node:http';
import { subsystemLogger } from '@atproto/common';
export declare const dbLogger: ReturnType<typeof subsystemLogger>;
export declare const seqLogger: ReturnType<typeof subsystemLogger>;
export declare const httpLogger: ReturnType<typeof subsystemLogger>;
export declare const langLogger: ReturnType<typeof subsystemLogger>;
export declare const verificationLogger: ReturnType<typeof subsystemLogger>;
export declare const loggerMiddleware: import("pino-http").HttpLogger<IncomingMessage, import("http").ServerResponse<IncomingMessage>, never>;
//# sourceMappingURL=logger.d.ts.map