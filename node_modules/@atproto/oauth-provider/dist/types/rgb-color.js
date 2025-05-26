"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgbColorSchema = void 0;
const zod_1 = require("zod");
const color_js_1 = require("../lib/util/color.js");
exports.rgbColorSchema = zod_1.z.string().transform((value, ctx) => {
    try {
        const parsed = (0, color_js_1.parseColor)(value);
        if ('a' in parsed && parsed.a !== undefined) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'Alpha values are not supported',
            });
        }
        return parsed;
    }
    catch (e) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: e instanceof Error ? e.message : 'Invalid color value',
        });
        return zod_1.z.NEVER;
    }
});
//# sourceMappingURL=rgb-color.js.map