import { IdResolver } from '@atproto/identity';
import { TestBsky } from './bsky';
import { TestPds } from './pds';
import { DidAndKey } from './types';
export declare const mockNetworkUtilities: (pds: TestPds, bsky?: TestBsky) => void;
export declare const mockResolvers: (idResolver: IdResolver, pds: TestPds) => void;
export declare const mockMailer: (pds: TestPds) => void;
export declare const uniqueLockId: () => number;
export declare const createDidAndKey: (opts: {
    plcUrl: string;
    handle: string;
    pds: string;
}) => Promise<DidAndKey>;
//# sourceMappingURL=util.d.ts.map