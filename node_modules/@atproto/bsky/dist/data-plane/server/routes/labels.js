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
const kysely_1 = require("kysely");
const ui8 = __importStar(require("uint8arrays"));
const common_1 = require("@atproto/common");
exports.default = (db) => ({
    async getLabels(req) {
        const { subjects, issuers } = req;
        if (subjects.length === 0 || issuers.length === 0) {
            return { labels: [] };
        }
        const res = await db.db
            .selectFrom('label')
            .where('uri', 'in', subjects)
            .where('src', 'in', issuers)
            .where((qb) => qb.where('exp', 'is', null).orWhere((0, kysely_1.sql) `exp::timestamp > now()`))
            .selectAll()
            .execute();
        const labelsBySubject = new Map();
        res.forEach((l) => {
            const labels = labelsBySubject.get(l.uri) ?? [];
            labels.push(l);
            labelsBySubject.set(l.uri, labels);
        });
        // intentionally duplicate label results, appview frontend should be defensive to this
        const labels = subjects.flatMap((sub) => {
            const labelsForSub = labelsBySubject.get(sub) ?? [];
            return labelsForSub.map((l) => {
                const formatted = (0, common_1.noUndefinedVals)({
                    ...l,
                    exp: l.exp === null ? undefined : l.exp,
                    cid: l.cid === '' ? undefined : l.cid,
                    neg: l.neg === true ? true : undefined,
                });
                return ui8.fromString(JSON.stringify(formatted), 'utf8');
            });
        });
        return { labels };
    },
    async getAllLabelers() {
        throw new Error('not implemented');
    },
});
//# sourceMappingURL=labels.js.map