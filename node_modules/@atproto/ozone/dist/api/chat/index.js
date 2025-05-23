"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const getActorMetadata_1 = __importDefault(require("./getActorMetadata"));
const getMessageContext_1 = __importDefault(require("./getMessageContext"));
function default_1(server, ctx) {
    (0, getActorMetadata_1.default)(server, ctx);
    (0, getMessageContext_1.default)(server, ctx);
    return server;
}
//# sourceMappingURL=index.js.map