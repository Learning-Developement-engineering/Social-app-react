"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSchema = void 0;
const zod_1 = require("zod");
const syntax_1 = require("@atproto/syntax");
exports.handleSchema = zod_1.z
    .string()
    // @NOTE: We only check against validity towards ATProto's syntax. Additional
    // rules may be imposed by the store implementation.
    .superRefine((value, ctx) => {
    try {
        (0, syntax_1.ensureValidHandle)(value);
    }
    catch (err) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: err instanceof Error ? err.message : 'Invalid handle',
        });
    }
})
    .transform(syntax_1.normalizeHandle);
//# sourceMappingURL=handle.js.map