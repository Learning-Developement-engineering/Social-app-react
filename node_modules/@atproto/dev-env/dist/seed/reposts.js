"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basic_1 = __importDefault(require("./basic"));
exports.default = async (sc) => {
    await (0, basic_1.default)(sc);
    await sc.createAccount('eve', {
        email: 'eve@test.com',
        handle: 'eve.test',
        password: 'eve-pass',
    });
    await sc.repost(sc.dids.bob, sc.posts[sc.dids.alice][2].ref);
    await sc.repost(sc.dids.carol, sc.posts[sc.dids.alice][2].ref);
    await sc.repost(sc.dids.dan, sc.posts[sc.dids.alice][2].ref);
    await sc.repost(sc.dids.eve, sc.posts[sc.dids.alice][2].ref);
    await sc.repost(sc.dids.dan, sc.replies[sc.dids.bob][0].ref);
    await sc.repost(sc.dids.eve, sc.replies[sc.dids.bob][0].ref);
    return sc;
};
//# sourceMappingURL=reposts.js.map