"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentTagger = void 0;
class ContentTagger {
    constructor(subject, subjectStatus, moderationService) {
        Object.defineProperty(this, "subject", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: subject
        });
        Object.defineProperty(this, "subjectStatus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: subjectStatus
        });
        Object.defineProperty(this, "moderationService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: moderationService
        });
    }
    async getTags() {
        if (!this.isApplicable()) {
            return [];
        }
        return this.buildTags();
    }
    tagAlreadyExists() {
        return Boolean(this.subjectStatus?.tags?.some((tag) => tag.startsWith(this.tagPrefix)));
    }
}
exports.ContentTagger = ContentTagger;
//# sourceMappingURL=content-tagger.js.map