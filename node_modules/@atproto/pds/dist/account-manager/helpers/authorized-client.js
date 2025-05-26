"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsert = upsert;
exports.getAuthorizedClients = getAuthorizedClients;
exports.getAuthorizedClientsMulti = getAuthorizedClientsMulti;
const db_1 = require("../../db");
async function upsert(db, did, clientId, data) {
    const now = new Date();
    return db.db
        .insertInto('authorized_client')
        .values({
        did,
        clientId,
        createdAt: (0, db_1.toDateISO)(now),
        updatedAt: (0, db_1.toDateISO)(now),
        data: (0, db_1.toJson)(data),
    })
        .onConflict((oc) => 
    // uses "authorized_client_pk" idx
    oc.columns(['did', 'clientId']).doUpdateSet({
        updatedAt: (0, db_1.toDateISO)(now),
        data: (0, db_1.toJson)(data),
    }))
        .executeTakeFirst();
}
async function getAuthorizedClients(db, did) {
    return (await getAuthorizedClientsMulti(db, [did])).get(did);
}
async function getAuthorizedClientsMulti(db, dids) {
    // Using a Map will ensure unicity of dids (through unicity of keys)
    const map = new Map(Array.from(dids, (did) => [did, new Map()]));
    if (map.size) {
        const found = await db.db
            .selectFrom('authorized_client')
            .select('did')
            .select('clientId')
            .select('data')
            // uses "authorized_client_pk"
            .where('did', 'in', [...map.keys()])
            .execute();
        for (const { did, clientId, data } of found) {
            map.get(did).set(clientId, (0, db_1.fromJson)(data));
        }
    }
    return map;
}
//# sourceMappingURL=authorized-client.js.map