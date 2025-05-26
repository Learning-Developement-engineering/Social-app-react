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
exports.createDidAndKey = exports.uniqueLockId = exports.mockMailer = exports.mockResolvers = exports.mockNetworkUtilities = void 0;
const plc = __importStar(require("@did-plc/lib"));
const undici_1 = require("undici");
const crypto_1 = require("@atproto/crypto");
const mockNetworkUtilities = (pds, bsky) => {
    (0, exports.mockResolvers)(pds.ctx.idResolver, pds);
    if (bsky) {
        (0, exports.mockResolvers)(bsky.ctx.idResolver, pds);
        (0, exports.mockResolvers)(bsky.dataplane.idResolver, pds);
    }
};
exports.mockNetworkUtilities = mockNetworkUtilities;
const mockResolvers = (idResolver, pds) => {
    // Map pds public url to its local url when resolving from plc
    const origResolveDid = idResolver.did.resolveNoCache;
    idResolver.did.resolveNoCache = async (did) => {
        const result = await origResolveDid.call(idResolver.did, did);
        const service = result?.service?.find((svc) => svc.id === '#atproto_pds');
        if (typeof service?.serviceEndpoint === 'string') {
            service.serviceEndpoint = service.serviceEndpoint.replace(pds.ctx.cfg.service.publicUrl, `http://localhost:${pds.port}`);
        }
        return result;
    };
    const origResolveHandleDns = idResolver.handle.resolveDns;
    idResolver.handle.resolve = async (handle) => {
        const isPdsHandle = pds.ctx.cfg.identity.serviceHandleDomains.some((domain) => handle.endsWith(domain));
        if (!isPdsHandle) {
            return origResolveHandleDns.call(idResolver.handle, handle);
        }
        const url = new URL(`/.well-known/atproto-did`, pds.url);
        try {
            const res = await (0, undici_1.request)(url, { headers: { host: handle } });
            if (res.statusCode !== 200) {
                await res.body.dump();
                return undefined;
            }
            return res.body.text();
        }
        catch (err) {
            return undefined;
        }
    };
};
exports.mockResolvers = mockResolvers;
const mockMailer = (pds) => {
    const mailer = pds.ctx.mailer;
    const _origSendMail = mailer.transporter.sendMail;
    mailer.transporter.sendMail = async (opts) => {
        const result = await _origSendMail.call(mailer.transporter, opts);
        console.log(`✉️ Email: ${JSON.stringify(result, null, 2)}`);
        return result;
    };
};
exports.mockMailer = mockMailer;
const usedLockIds = new Set();
const uniqueLockId = () => {
    let lockId;
    do {
        lockId = 1000 + Math.ceil(1000 * Math.random());
    } while (usedLockIds.has(lockId));
    usedLockIds.add(lockId);
    return lockId;
};
exports.uniqueLockId = uniqueLockId;
const createDidAndKey = async (opts) => {
    const { plcUrl, handle, pds } = opts;
    const key = await crypto_1.Secp256k1Keypair.create({ exportable: true });
    const did = await new plc.Client(plcUrl).createDid({
        signingKey: key.did(),
        rotationKeys: [key.did()],
        handle,
        pds,
        signer: key,
    });
    return {
        key,
        did,
    };
};
exports.createDidAndKey = createDidAndKey;
//# sourceMappingURL=util.js.map