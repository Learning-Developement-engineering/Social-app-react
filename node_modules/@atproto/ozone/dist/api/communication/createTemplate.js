"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const util_1 = require("../../communication-service/util");
function default_1(server, ctx) {
    server.tools.ozone.communication.createTemplate({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { createdBy, lang, ...template } = input.body;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a moderator to create a communication template');
            }
            // Once auth starts providing us with the caller's DID, we can get rid of this check
            if (!createdBy) {
                throw new xrpc_server_1.InvalidRequestError('createdBy field is required');
            }
            const communicationTemplate = ctx.communicationTemplateService(db);
            try {
                const newTemplate = await communicationTemplate.create({
                    ...template,
                    // We are not using ?? here because we want to use null instead of potentially empty string
                    lang: lang || null,
                    disabled: false,
                    lastUpdatedBy: createdBy,
                });
                return {
                    encoding: 'application/json',
                    body: communicationTemplate.view(newTemplate),
                };
            }
            catch (err) {
                if ((0, util_1.isDuplicateTemplateNameError)(err)) {
                    throw new xrpc_server_1.InvalidRequestError(`${template.name} already exists. Please choose a different name.`, 'DuplicateTemplateName');
                }
                throw err;
            }
        },
    });
}
//# sourceMappingURL=createTemplate.js.map