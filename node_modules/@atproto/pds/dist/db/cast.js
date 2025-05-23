"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateISO = toDateISO;
exports.fromDateISO = fromDateISO;
exports.toJson = toJson;
exports.fromJson = fromJson;
function toDateISO(date) {
    return date.toISOString();
}
function fromDateISO(dateStr) {
    return new Date(dateStr);
}
function toJson(value) {
    const json = JSON.stringify(value);
    if (json === undefined)
        throw new TypeError('Input not JSONifyable');
    return json;
}
function fromJson(jsonStr) {
    try {
        return JSON.parse(jsonStr);
    }
    catch (cause) {
        throw new TypeError('Database contains invalid JSON', { cause });
    }
}
//# sourceMappingURL=cast.js.map