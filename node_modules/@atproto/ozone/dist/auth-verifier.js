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
exports.parseBasicAuth = exports.getJwtStrFromReq = exports.AuthVerifier = void 0;
const ui8 = __importStar(require("uint8arrays"));
const xrpc_server_1 = require("@atproto/xrpc-server");
class AuthVerifier {
    constructor(idResolver, opts) {
        Object.defineProperty(this, "idResolver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: idResolver
        });
        Object.defineProperty(this, "serviceDid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "teamService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "adminPassword", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "modOrAdminToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (reqCtx) => {
                if (isBasicToken(reqCtx.req)) {
                    return this.adminToken(reqCtx);
                }
                else {
                    return this.moderator(reqCtx);
                }
            }
        });
        Object.defineProperty(this, "moderator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (reqCtx) => {
                const creds = await this.standard(reqCtx);
                if (!creds.credentials.isTriage && !creds.credentials.isVerifier) {
                    throw new xrpc_server_1.AuthRequiredError('not a moderator account');
                }
                return {
                    credentials: {
                        ...creds.credentials,
                        type: 'moderator',
                    },
                };
            }
        });
        Object.defineProperty(this, "standard", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (reqCtx) => {
                const getSigningKey = async (did, forceRefresh) => {
                    const atprotoData = await this.idResolver.did.resolveAtprotoData(did, forceRefresh);
                    return atprotoData.signingKey;
                };
                const jwtStr = (0, exports.getJwtStrFromReq)(reqCtx.req);
                if (!jwtStr) {
                    throw new xrpc_server_1.AuthRequiredError('missing jwt', 'MissingJwt');
                }
                const nsid = (0, xrpc_server_1.parseReqNsid)(reqCtx.req);
                const payload = await (0, xrpc_server_1.verifyJwt)(jwtStr, this.serviceDid, nsid, getSigningKey);
                const iss = payload.iss;
                const member = await this.teamService.getMember(iss);
                if (member?.disabled) {
                    throw new xrpc_server_1.AuthRequiredError('member is disabled', 'MemberDisabled');
                }
                const { isAdmin, isModerator, isTriage, isVerifier } = this.teamService.getMemberRole(member);
                return {
                    credentials: {
                        type: 'standard',
                        iss,
                        aud: payload.aud,
                        isAdmin,
                        isModerator,
                        isTriage,
                        isVerifier,
                    },
                };
            }
        });
        Object.defineProperty(this, "standardOptional", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (reqCtx) => {
                if (isBearerToken(reqCtx.req)) {
                    return this.standard(reqCtx);
                }
                return this.nullCreds();
            }
        });
        Object.defineProperty(this, "standardOptionalOrAdminToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (reqCtx) => {
                if (isBearerToken(reqCtx.req)) {
                    return this.standard(reqCtx);
                }
                else if (isBasicToken(reqCtx.req)) {
                    return this.adminToken(reqCtx);
                }
                else {
                    return this.nullCreds();
                }
            }
        });
        Object.defineProperty(this, "adminToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async (reqCtx) => {
                const parsed = (0, exports.parseBasicAuth)(reqCtx.req.headers.authorization ?? '');
                const { username, password } = parsed ?? {};
                if (username !== 'admin' || password !== this.adminPassword) {
                    throw new xrpc_server_1.AuthRequiredError();
                }
                return {
                    credentials: {
                        type: 'admin_token',
                        isAdmin: true,
                        isModerator: true,
                        isTriage: true,
                        isVerifier: true,
                    },
                };
            }
        });
        this.serviceDid = opts.serviceDid;
        this.adminPassword = opts.adminPassword;
        this.teamService = opts.teamService;
    }
    nullCreds() {
        return {
            credentials: {
                type: 'none',
                iss: null,
            },
        };
    }
}
exports.AuthVerifier = AuthVerifier;
const BEARER = 'Bearer ';
const BASIC = 'Basic ';
const isBearerToken = (req) => {
    return req.headers.authorization?.startsWith(BEARER) ?? false;
};
const isBasicToken = (req) => {
    return req.headers.authorization?.startsWith(BASIC) ?? false;
};
const getJwtStrFromReq = (req) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(BEARER)) {
        return null;
    }
    return authorization.slice(BEARER.length).trim();
};
exports.getJwtStrFromReq = getJwtStrFromReq;
const parseBasicAuth = (token) => {
    if (!token.startsWith(BASIC))
        return null;
    const b64 = token.slice(BASIC.length);
    let parsed;
    try {
        parsed = ui8.toString(ui8.fromString(b64, 'base64pad'), 'utf8').split(':');
    }
    catch (err) {
        return null;
    }
    const [username, password] = parsed;
    if (!username || !password)
        return null;
    return { username, password };
};
exports.parseBasicAuth = parseBasicAuth;
//# sourceMappingURL=auth-verifier.js.map