"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customizationSchema = void 0;
const zod_1 = require("zod");
const hcaptcha_js_1 = require("../lib/hcaptcha.js");
const branding_js_1 = require("./branding.js");
exports.customizationSchema = zod_1.z.object({
    /**
     * Available user domains that can be used to sign up. A non-empty array
     * is required to enable the sign-up feature.
     */
    availableUserDomains: zod_1.z.array(zod_1.z.string()).optional(),
    /**
     * UI customizations
     */
    branding: branding_js_1.brandingSchema.optional(),
    /**
     * Is an invite code required to sign up?
     */
    inviteCodeRequired: zod_1.z.boolean().optional(),
    /**
     * Enables hCaptcha during sign-up.
     */
    hcaptcha: hcaptcha_js_1.hcaptchaConfigSchema.optional(),
});
//# sourceMappingURL=customization.js.map