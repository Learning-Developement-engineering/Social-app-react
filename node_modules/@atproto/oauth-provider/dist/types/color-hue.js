"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorHueSchema = void 0;
const zod_1 = require("zod");
exports.colorHueSchema = zod_1.z.number().min(0).max(360);
//# sourceMappingURL=color-hue.js.map