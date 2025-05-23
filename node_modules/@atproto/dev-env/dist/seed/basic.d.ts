import { TestNetwork } from '../network';
import { TestNetworkNoAppView } from '../network-no-appview';
import { SeedClient } from './client';
declare const _default: (sc: SeedClient<TestNetwork | TestNetworkNoAppView>, users?: boolean) => Promise<SeedClient<TestNetworkNoAppView | TestNetwork>>;
export default _default;
export declare const posts: {
    alice: string[];
    bob: string[];
    carol: string[];
    dan: string[];
};
export declare const replies: {
    alice: string[];
    bob: string[];
    carol: string[];
};
//# sourceMappingURL=basic.d.ts.map