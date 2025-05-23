"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUi8Hex = parseUi8Hex;
exports.parseUi8Dec = parseUi8Dec;
exports.asUi8 = asUi8;
function parseUi8Hex(v) {
    return asUi8(parseInt(v, 16));
}
function parseUi8Dec(v) {
    return asUi8(parseInt(v, 10));
}
function asUi8(v) {
    if (v >= 0 && v <= 255 && Number.isInteger(v))
        return v;
    throw new TypeError(`Invalid value "${v}" (expected an integer between 0 and 255)`);
}
//# sourceMappingURL=ui8.js.map