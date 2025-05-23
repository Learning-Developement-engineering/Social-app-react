"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobDiverter = void 0;
const promises_1 = require("node:stream/promises");
const cid_1 = require("multiformats/cid");
const undici = __importStar(require("undici"));
const common_1 = require("@atproto/common");
const xrpc_1 = require("@atproto/xrpc");
const util_1 = require("../util");
class BlobDiverter {
    constructor(db, services) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
        Object.defineProperty(this, "serviceConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "idResolver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.serviceConfig = services.serviceConfig;
        this.idResolver = services.idResolver;
    }
    /**
     * @throws {XRPCError} so that retryHttp can handle retries
     */
    async getBlob(options) {
        const blobUrl = getBlobUrl(options);
        const blobResponse = await undici
            .request(blobUrl, {
            headersTimeout: 10e3,
            bodyTimeout: 30e3,
        })
            .catch((err) => {
            throw asXrpcClientError(err, `Error fetching blob ${options.cid}`);
        });
        if (blobResponse.statusCode !== 200) {
            await blobResponse.body.dump();
            throw new xrpc_1.XRPCError(blobResponse.statusCode, undefined, `Error downloading blob ${options.cid}`);
        }
        try {
            const type = blobResponse.headers['content-type'];
            const encoding = blobResponse.headers['content-encoding'];
            const verifier = new common_1.VerifyCidTransform(cid_1.CID.parse(options.cid));
            void (0, promises_1.pipeline)([
                blobResponse.body,
                ...(0, common_1.createDecoders)(encoding),
                verifier,
            ]).catch((_err) => { });
            return {
                type: typeof type === 'string' ? type : 'application/octet-stream',
                stream: verifier,
            };
        }
        catch (err) {
            // Typically un-supported content encoding
            await blobResponse.body.dump();
            throw err;
        }
    }
    /**
     * @throws {XRPCError} so that retryHttp can handle retries
     */
    async uploadBlob(blob, report) {
        const uploadUrl = reportBlobUrl(this.serviceConfig.url, report);
        const result = await undici
            .request(uploadUrl, {
            method: 'POST',
            body: blob.stream,
            headersTimeout: 30e3,
            bodyTimeout: 10e3,
            headers: {
                Authorization: basicAuth('admin', this.serviceConfig.adminPassword),
                'content-type': blob.type,
            },
        })
            .catch((err) => {
            throw asXrpcClientError(err, `Error uploading blob ${report.did}`);
        });
        if (result.statusCode !== 200) {
            await result.body.dump();
            throw new xrpc_1.XRPCError(result.statusCode, undefined, `Error uploading blob ${report.did}`);
        }
        await (0, promises_1.finished)(result.body.resume());
    }
    async uploadBlobOnService({ subjectDid: did, subjectUri: uri, subjectBlobCids, }) {
        const didDoc = await this.idResolver.did.resolve(did);
        if (!didDoc)
            throw new Error('Error resolving DID');
        const pds = (0, common_1.getPdsEndpoint)(didDoc);
        if (!pds)
            throw new Error('Error resolving PDS');
        await (0, common_1.allFulfilled)(subjectBlobCids.map((cid) => (0, util_1.retryHttp)(async () => {
            // attempt to download and upload within the same retry block since
            // the blob stream is not reusable
            const blob = await this.getBlob({ pds, cid, did });
            return this.uploadBlob(blob, { did, uri });
        }))).catch((err) => {
            throw new xrpc_1.XRPCError(xrpc_1.ResponseType.UpstreamFailure, undefined, 'Failed to process blobs', undefined, { cause: err });
        });
    }
}
exports.BlobDiverter = BlobDiverter;
const basicAuth = (username, password) => {
    return 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
};
function getBlobUrl({ pds, did, cid }) {
    const url = new URL(`/xrpc/com.atproto.sync.getBlob`, pds);
    url.searchParams.set('did', did);
    url.searchParams.set('cid', cid);
    return url;
}
function reportBlobUrl(service, { did, uri }) {
    const url = new URL(`/xrpc/com.atproto.unspecced.reportBlob`, service);
    url.searchParams.set('did', did);
    if (uri != null)
        url.searchParams.set('uri', uri);
    return url;
}
function asXrpcClientError(err, message) {
    return new xrpc_1.XRPCError(xrpc_1.ResponseType.Unknown, undefined, message, undefined, {
        cause: err,
    });
}
//# sourceMappingURL=blob-diverter.js.map