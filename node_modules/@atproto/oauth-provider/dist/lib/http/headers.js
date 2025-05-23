"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendHeader = appendHeader;
function appendHeader(res, header, value) {
    const existing = res.getHeader(header);
    if (existing == null) {
        res.setHeader(header, value);
    }
    else {
        const arr = Array.isArray(existing) ? existing : [String(existing)];
        res.setHeader(header, arr.concat(value));
    }
}
//# sourceMappingURL=headers.js.map