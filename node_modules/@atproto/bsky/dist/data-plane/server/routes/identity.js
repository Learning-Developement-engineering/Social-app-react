"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protobuf_1 = require("@bufbuild/protobuf");
const connect_1 = require("@connectrpc/connect");
const identity_1 = require("@atproto/identity");
exports.default = (_db, idResolver) => ({
    async getIdentityByDid(req) {
        const doc = await idResolver.did.resolve(req.did);
        if (!doc) {
            throw new connect_1.ConnectError('identity not found', connect_1.Code.NotFound);
        }
        return getResultFromDoc(doc);
    },
    async getIdentityByHandle(req) {
        const did = await idResolver.handle.resolve(req.handle);
        if (!did) {
            throw new connect_1.ConnectError('identity not found', connect_1.Code.NotFound);
        }
        const doc = await idResolver.did.resolve(did);
        if (!doc || did !== (0, identity_1.getDid)(doc)) {
            throw new connect_1.ConnectError('identity not found', connect_1.Code.NotFound);
        }
        return getResultFromDoc(doc);
    },
});
const getResultFromDoc = (doc) => {
    const keys = {};
    doc.verificationMethod?.forEach((method) => {
        const id = method.id.split('#').at(1);
        if (!id)
            return;
        keys[id] = {
            Type: method.type,
            PublicKeyMultibase: method.publicKeyMultibase || '',
        };
    });
    const services = {};
    doc.service?.forEach((service) => {
        const id = service.id.split('#').at(1);
        if (!id)
            return;
        if (typeof service.serviceEndpoint !== 'string')
            return;
        services[id] = {
            Type: service.type,
            URL: service.serviceEndpoint,
        };
    });
    return {
        did: (0, identity_1.getDid)(doc),
        handle: (0, identity_1.getHandle)(doc),
        keys: Buffer.from(JSON.stringify(keys)),
        services: Buffer.from(JSON.stringify(services)),
        updated: protobuf_1.Timestamp.fromDate(new Date()),
    };
};
//# sourceMappingURL=identity.js.map