"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbedTagger = void 0;
const api_1 = require("@atproto/api");
const lexicons_1 = require("../lexicon/lexicons");
const logger_1 = require("../logger");
const content_tagger_1 = require("./content-tagger");
class EmbedTagger extends content_tagger_1.ContentTagger {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tagPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'embed:'
        });
    }
    isApplicable() {
        return (!!this.subjectStatus &&
            !this.tagAlreadyExists() &&
            this.subject.isRecord() &&
            this.subject.parsedUri.collection === lexicons_1.ids.AppBskyFeedPost);
    }
    async buildTags() {
        try {
            const recordValue = await this.getRecordValue();
            if (!recordValue) {
                return [];
            }
            const tags = [];
            const result = api_1.AppBskyFeedPost.validateRecord(recordValue);
            if (result.success) {
                const embedContent = api_1.AppBskyEmbedRecordWithMedia.isMain(result.value.embed)
                    ? result.value.embed.media
                    : result.value.embed;
                if (api_1.AppBskyEmbedImages.isMain(embedContent)) {
                    tags.push(`${this.tagPrefix}image`);
                }
                if (api_1.AppBskyEmbedVideo.isMain(embedContent)) {
                    tags.push(`${this.tagPrefix}video`);
                }
                if (api_1.AppBskyEmbedExternal.isMain(embedContent)) {
                    tags.push(`${this.tagPrefix}external`);
                }
            }
            return tags;
        }
        catch (err) {
            logger_1.langLogger.error({ subject: this.subject, err }, 'Error getting record langs');
            return [];
        }
    }
    async getRecordValue() {
        if (!this.subject.isRecord()) {
            return undefined;
        }
        const recordByUri = await this.moderationService.views.fetchRecords([
            this.subject,
        ]);
        const record = recordByUri.get(this.subject.uri);
        return record?.value;
    }
}
exports.EmbedTagger = EmbedTagger;
//# sourceMappingURL=embed-tagger.js.map