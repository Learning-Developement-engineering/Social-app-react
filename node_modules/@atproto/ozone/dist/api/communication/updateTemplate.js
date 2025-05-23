"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const xrpc_server_1 = require("@atproto/xrpc-server");
const util_1 = require("../../communication-service/util");
function default_1(server, ctx) {
    server.tools.ozone.communication.updateTemplate({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { id, updatedBy, ...template } = input.body;
            if (!access.isModerator) {
                throw new xrpc_server_1.AuthRequiredError('Must be a moderator to update a communication template');
            }
            // Once auth starts providing us with the caller's DID, we can get rid of this check
            if (!updatedBy) {
                throw new xrpc_server_1.InvalidRequestError('updatedBy field is required');
            }
            if (!Object.keys(template).length) {
                throw new xrpc_server_1.InvalidRequestError('Missing update data in request body');
            }
            const communicationTemplate = ctx.communicationTemplateService(db);
            try {
                const updatedTemplate = await communicationTemplate.update(Number(id), {
                    ...template,
                    lastUpdatedBy: updatedBy,
                });
                return {
                    encoding: 'application/json',
                    body: communicationTemplate.view(updatedTemplate),
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
//# sourceMappingURL=updateTemplate.js.map