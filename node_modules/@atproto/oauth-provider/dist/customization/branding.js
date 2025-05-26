"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandingSchema = void 0;
const zod_1 = require("zod");
const colors_js_1 = require("./colors.js");
const links_js_1 = require("./links.js");
exports.brandingSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    logo: zod_1.z.string().url().optional(),
    colors: colors_js_1.colorsSchema.optional(),
    links: zod_1.z.array(links_js_1.linksSchema).optional(),
});
//# sourceMappingURL=branding.js.map