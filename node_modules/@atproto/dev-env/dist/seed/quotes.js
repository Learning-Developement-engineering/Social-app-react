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
    await sc.post(sc.dids.eve, 'qUoTe 1', undefined, undefined, sc.posts[sc.dids.alice][0].ref);
    await sc.post(sc.dids.eve, 'qUoTe 2', undefined, undefined, sc.posts[sc.dids.alice][0].ref);
    await sc.post(sc.dids.eve, 'qUoTe 3', undefined, undefined, sc.replies[sc.dids.bob][0].ref);
    const carolPost = await sc.post(sc.dids.carol, 'post');
    await sc.post(sc.dids.eve, 'qUoTe 4', undefined, undefined, carolPost.ref);
    const spamPosts = [];
    for (let i = 0; i < 5; i++) {
        spamPosts.push(sc.post(sc.dids.eve, `MASSIVE QUOTE SPAM ${i + 1}`, undefined, undefined, sc.posts[sc.dids.alice][1].ref));
    }
    await Promise.all(spamPosts);
    return sc;
};
//# sourceMappingURL=quotes.js.map