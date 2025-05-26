"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonb = void 0;
const kysely_1 = require("kysely");
const jsonb = (val) => {
    if (val === null)
        return (0, kysely_1.sql) `null`;
    return (0, kysely_1.sql) `${JSON.stringify(val)}::jsonb`;
};
exports.jsonb = jsonb;
//# sourceMappingURL=types.js.map