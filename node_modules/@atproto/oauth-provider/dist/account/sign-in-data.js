"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInDataSchema = void 0;
const zod_1 = require("zod");
const locale_js_1 = require("../lib/util/locale.js");
const email_otp_js_1 = require("../types/email-otp.js");
const password_js_1 = require("../types/password.js");
exports.signInDataSchema = zod_1.z
    .object({
    locale: locale_js_1.localeSchema,
    username: zod_1.z.string(),
    password: zod_1.z.union([password_js_1.oldPasswordSchema, password_js_1.newPasswordSchema]),
    emailOtp: email_otp_js_1.emailOtpSchema.optional(),
})
    .strict();
//# sourceMappingURL=sign-in-data.js.map