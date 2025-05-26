import { AssetRef } from '../../lib/html/build-document.js';
import { Middleware } from '../../lib/http/index.js';
export declare function parseAssetsManifest(manifestPath: string): {
    getAssets: (entryName: string) => {
        scripts: AssetRef[];
        styles: AssetRef[];
    } | null;
    assetsMiddleware: Middleware;
};
//# sourceMappingURL=assets-manifest.d.ts.map