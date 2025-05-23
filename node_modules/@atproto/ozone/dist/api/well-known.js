"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = void 0;
const express_1 = require("express");
const createRouter = (ctx) => {
    const router = (0, express_1.Router)();
    router.get('/.well-known/did.json', (_req, res) => {
        const hostname = ctx.cfg.service.publicUrl && new URL(ctx.cfg.service.publicUrl).hostname;
        if (!hostname || ctx.cfg.service.did !== `did:web:${hostname}`) {
            return res.sendStatus(404);
        }
        res.json({
            '@context': [
                'https://www.w3.org/ns/did/v1',
                'https://w3id.org/security/multikey/v1',
            ],
            id: ctx.cfg.service.did,
            verificationMethod: [
                {
                    id: `${ctx.cfg.service.did}#atproto_label`,
                    type: 'Multikey',
                    controller: ctx.cfg.service.did,
                    publicKeyMultibase: ctx.signingKey.did().replace('did:key:', ''),
                },
            ],
            service: [
                {
                    id: '#atproto_labeler',
                    type: 'AtprotoLabeler',
                    serviceEndpoint: `https://${hostname}`,
                },
            ],
        });
    });
    router.get('/.well-known/ozone-metadata.json', (_req, res) => {
        return res.json({
            did: ctx.cfg.service.did,
            url: ctx.cfg.service.publicUrl,
            publicKey: ctx.signingKey.did(),
        });
    });
    return router;
};
exports.createRouter = createRouter;
//# sourceMappingURL=well-known.js.map