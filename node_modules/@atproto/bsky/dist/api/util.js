"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearlyBadCursor = exports.resHeaders = exports.ATPROTO_REPO_REV = exports.ATPROTO_CONTENT_LABELERS = exports.BSKY_USER_AGENT = void 0;
const util_1 = require("../util");
exports.BSKY_USER_AGENT = 'BskyAppView';
exports.ATPROTO_CONTENT_LABELERS = 'Atproto-Content-Labelers';
exports.ATPROTO_REPO_REV = 'Atproto-Repo-Rev';
const resHeaders = (opts) => {
    const headers = {};
    if (opts.labelers) {
        headers[exports.ATPROTO_CONTENT_LABELERS] = (0, util_1.formatLabelerHeader)(opts.labelers);
    }
    if (opts.repoRev) {
        headers[exports.ATPROTO_REPO_REV] = opts.repoRev;
    }
    return headers;
};
exports.resHeaders = resHeaders;
const clearlyBadCursor = (cursor) => {
    // hallmark of v1 cursor, highly unlikely in v2 cursors based on time or rkeys
    return !!cursor?.includes('::');
};
exports.clearlyBadCursor = clearlyBadCursor;
//# sourceMappingURL=util.js.map