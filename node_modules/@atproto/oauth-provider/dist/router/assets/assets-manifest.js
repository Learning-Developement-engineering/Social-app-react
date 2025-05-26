"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAssetsManifest = parseAssetsManifest;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_stream_1 = require("node:stream");
const index_js_1 = require("../../lib/http/index.js");
const ASSETS_URL_PREFIX = '/@atproto/oauth-provider/~assets/';
function parseAssetsManifest(manifestPath) {
    // Using `require` instead of `JSON.parse(readFileSync())` so that node's
    // watch mode can pick up changes to the manifest file.
    // eslint-disable-next-line
    const manifest = require(manifestPath);
    const assets = new Map(Object.entries(manifest).map(([filename, { data, ...item }]) => {
        const buffer = data ? Buffer.from(data, 'base64') : null;
        const filepath = (0, node_path_1.join)(manifestPath, '..', filename);
        const stream = buffer
            ? () => node_stream_1.Readable.from(buffer)
            : () => (0, node_fs_1.createReadStream)(filepath);
        return [filename, { ...item, stream }];
    }));
    const assetsMiddleware = (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD')
            return next();
        if (!req.url?.startsWith(ASSETS_URL_PREFIX))
            return next();
        const filename = decodeURIComponent(req.url.slice(ASSETS_URL_PREFIX.length));
        if (!filename)
            return next();
        const asset = assets.get(filename);
        if (!asset)
            return next();
        try {
            // Allow "null" (ie. no header) to allow loading assets outside of a
            // fetch context (not from a web page).
            (0, index_js_1.validateFetchSite)(req, [null, 'none', 'cross-site', 'same-origin']);
            (0, index_js_1.validateFetchDest)(req, [null, 'document', 'style', 'script']);
        }
        catch (err) {
            return next(err);
        }
        if (req.headers['if-none-match'] === asset.sha256) {
            return void res.writeHead(304).end();
        }
        res.setHeader('ETag', asset.sha256);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        (0, index_js_1.writeStream)(res, asset.stream(), { contentType: asset.mime });
    };
    return {
        getAssets,
        assetsMiddleware,
    };
    function getAssets(entryName) {
        const scripts = getScripts(entryName);
        if (!scripts.length)
            return null;
        const styles = getStyles(entryName);
        return { scripts, styles };
    }
    function getScripts(entryName) {
        return Array.from(assets)
            .filter(([, asset]) => asset.type === 'chunk' && asset.isEntry && asset.name === entryName)
            .map(assetEntryUrl);
    }
    function getStyles(_entryName) {
        return Array.from(assets)
            .filter(([, asset]) => asset.mime === 'text/css')
            .map(assetEntryUrl);
    }
}
function assetEntryUrl([filename]) {
    return { url: assetUrl(filename) };
}
function assetUrl(filename) {
    return `${ASSETS_URL_PREFIX}${encodeURIComponent(filename)}`;
}
//# sourceMappingURL=assets-manifest.js.map