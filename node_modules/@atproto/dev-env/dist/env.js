"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// NOTE: this file should be imported first, particularly before `@atproto/common` (for logging), to ensure that environment variables are respected in library code
const dotenv_1 = __importDefault(require("dotenv"));
const env = process.env.ENV;
if (env) {
    dotenv_1.default.config({ path: `./.${env}.env` });
}
else {
    dotenv_1.default.config();
}
//# sourceMappingURL=env.js.map