"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envToSecrets = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const envToSecrets = (env) => {
    (0, node_assert_1.default)(env.adminPassword);
    (0, node_assert_1.default)(env.signingKeyHex);
    return {
        adminPassword: env.adminPassword,
        signingKeyHex: env.signingKeyHex,
    };
};
exports.envToSecrets = envToSecrets;
//# sourceMappingURL=secrets.js.map