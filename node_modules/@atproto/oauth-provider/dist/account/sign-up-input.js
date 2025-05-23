"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpInputSchema = void 0;
const zod_1 = require("zod");
const hcaptcha_js_1 = require("../lib/hcaptcha.js");
const locale_js_1 = require("../lib/util/locale.js");
const email_js_1 = require("../types/email.js");
const handle_js_1 = require("../types/handle.js");
const invite_code_js_1 = require("../types/invite-code.js");
const password_js_1 = require("../types/password.js");
exports.signUpInputSchema = zod_1.z
    .object({
    locale: locale_js_1.localeSchema,
    handle: handle_js_1.handleSchema,
    email: email_js_1.emailSchema,
    password: password_js_1.newPasswordSchema,
    inviteCode: invite_code_js_1.inviteCodeSchema.optional(),
    hcaptchaToken: hcaptcha_js_1.hcaptchaTokenSchema.optional(),
})
    .strict();
//# sourceMappingURL=sign-up-input.js.map