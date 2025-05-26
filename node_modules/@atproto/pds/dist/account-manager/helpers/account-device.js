"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertQB = upsertQB;
exports.selectQB = selectQB;
exports.removeQB = removeQB;
const node_assert_1 = __importDefault(require("node:assert"));
const db_1 = require("../../db");
const account_1 = require("./account");
function upsertQB(db, deviceId, did) {
    const now = new Date();
    return db.db
        .insertInto('account_device')
        .values({
        did,
        deviceId,
        createdAt: (0, db_1.toDateISO)(now),
        updatedAt: (0, db_1.toDateISO)(now),
    })
        .onConflict((oc) => 
    // uses pk
    oc.columns(['deviceId', 'did']).doUpdateSet({
        updatedAt: (0, db_1.toDateISO)(now),
    }));
}
function selectQB(db, filter) {
    (0, node_assert_1.default)(filter.sub != null || filter.deviceId != null, 'Either sub or deviceId must be provided');
    return ((0, account_1.selectAccountQB)(db, { includeDeactivated: true })
        // note: query planner should use "account_device_pk" index
        .innerJoin('account_device', 'account_device.did', 'actor.did')
        .select([
        'account_device.deviceId',
        'account_device.createdAt as adCreatedAt',
        'account_device.updatedAt as adUpdatedAt',
    ])
        .innerJoin('device', 'device.id', 'account_device.deviceId')
        .select([
        'device.sessionId',
        'device.userAgent',
        'device.ipAddress',
        'device.lastSeenAt',
    ])
        .if(filter.sub != null, (qb) => qb.where('actor.did', '=', filter.sub))
        .if(filter.deviceId != null, (qb) => qb.where('account_device.deviceId', '=', filter.deviceId)));
}
function removeQB(db, deviceId, did) {
    return db.db
        .deleteFrom('account_device')
        .where('deviceId', '=', deviceId)
        .where('did', '=', did);
}
//# sourceMappingURL=account-device.js.map