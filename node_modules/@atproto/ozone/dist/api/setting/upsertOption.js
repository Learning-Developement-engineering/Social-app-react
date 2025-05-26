"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const node_assert_1 = __importDefault(require("node:assert"));
const api_1 = require("@atproto/api");
const xrpc_server_1 = require("@atproto/xrpc-server");
const validators_1 = require("../../setting/validators");
function default_1(server, ctx) {
    server.tools.ozone.setting.upsertOption({
        auth: ctx.authVerifier.modOrAdminToken,
        handler: async ({ input, auth }) => {
            const access = auth.credentials;
            const db = ctx.db;
            const { key, value, description, managerRole, scope } = input.body;
            const serviceDid = ctx.cfg.service.did;
            let ownerDid = serviceDid;
            if (scope === 'personal' && access.type !== 'moderator') {
                throw new xrpc_server_1.AuthRequiredError('Must use moderator auth to create or update a personal setting');
            }
            // if the caller is using moderator auth and storing personal setting
            // use the caller's DID as the owner
            if (scope === 'personal' && access.type === 'moderator') {
                ownerDid = access.iss;
            }
            const now = new Date();
            const baseOption = {
                key,
                value,
                did: ownerDid,
                createdBy: ownerDid,
                lastUpdatedBy: ownerDid,
                description: description || '',
                createdAt: now,
                updatedAt: now,
            };
            const settingService = ctx.settingService(db);
            if (scope === 'personal') {
                await settingService.upsert({
                    ...baseOption,
                    scope: 'personal',
                    managerRole: null,
                });
            }
            else {
                const manageableRoles = getRolesForInstanceOption(access);
                const existingSetting = await getExistingSetting(settingService, ownerDid, key, 'instance');
                if (existingSetting?.managerRole &&
                    !manageableRoles.includes(existingSetting.managerRole)) {
                    throw new xrpc_server_1.AuthRequiredError(`Not permitted to update setting ${key}`);
                }
                const option = {
                    ...baseOption,
                    scope: 'instance',
                    managerRole: getManagerRole(managerRole),
                };
                if (validators_1.settingValidators.has(key)) {
                    await validators_1.settingValidators.get(key)?.(option);
                }
                await settingService.upsert(option);
            }
            const newOption = await getExistingSetting(settingService, ownerDid, key, scope);
            (0, node_assert_1.default)(newOption, 'Failed to get the updated setting');
            return {
                encoding: 'application/json',
                body: {
                    option: settingService.view(newOption),
                },
            };
        },
    });
}
const getExistingSetting = async (settingService, did, key, scope) => {
    const result = await settingService.query({
        scope: scope === 'personal' ? 'personal' : 'instance',
        keys: [key],
        limit: 1,
        did,
    });
    return result.options[0];
};
const getRolesForInstanceOption = (access) => {
    const fullPermission = [
        api_1.ToolsOzoneTeamDefs.ROLEADMIN,
        api_1.ToolsOzoneTeamDefs.ROLEMODERATOR,
        api_1.ToolsOzoneTeamDefs.ROLETRIAGE,
        api_1.ToolsOzoneTeamDefs.ROLEVERIFIER,
    ];
    if (access.type === 'admin_token') {
        return fullPermission;
    }
    if (access.isAdmin) {
        return fullPermission;
    }
    if (access.isModerator) {
        return [api_1.ToolsOzoneTeamDefs.ROLEMODERATOR, api_1.ToolsOzoneTeamDefs.ROLETRIAGE];
    }
    if (access.isVerifier) {
        return [api_1.ToolsOzoneTeamDefs.ROLEVERIFIER];
    }
    return [api_1.ToolsOzoneTeamDefs.ROLETRIAGE];
};
const getManagerRole = (role) => {
    let managerRole = null;
    if (role === api_1.ToolsOzoneTeamDefs.ROLEADMIN) {
        managerRole = api_1.ToolsOzoneTeamDefs.ROLEADMIN;
    }
    else if (role === api_1.ToolsOzoneTeamDefs.ROLEMODERATOR) {
        managerRole = api_1.ToolsOzoneTeamDefs.ROLEMODERATOR;
    }
    else if (role === api_1.ToolsOzoneTeamDefs.ROLETRIAGE) {
        managerRole = api_1.ToolsOzoneTeamDefs.ROLETRIAGE;
    }
    else if (role === api_1.ToolsOzoneTeamDefs.ROLEVERIFIER) {
        managerRole = api_1.ToolsOzoneTeamDefs.ROLEVERIFIER;
    }
    return managerRole;
};
//# sourceMappingURL=upsertOption.js.map