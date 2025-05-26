"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const logger_1 = require("../logger");
const embed_tagger_1 = require("./embed-tagger");
const language_tagger_1 = require("./language-tagger");
class TagService {
    constructor(subject, subjectStatus, taggerDid, moderationService) {
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
        Object.defineProperty(this, "taggerDid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: taggerDid
        });
        Object.defineProperty(this, "moderationService", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: moderationService
        });
        Object.defineProperty(this, "taggers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.taggers = [
            new language_tagger_1.LanguageTagger(subject, subjectStatus, moderationService),
            new embed_tagger_1.EmbedTagger(subject, subjectStatus, moderationService),
            // Add more taggers as needed
        ];
    }
    // Allow the caller to seed the initial tags
    async evaluateForSubject(initialTags) {
        try {
            const tags = new Set(initialTags);
            await Promise.all(this.taggers.map(async (tagger) => {
                try {
                    const newTags = await tagger.getTags();
                    for (const newTag of newTags) {
                        tags.add(newTag);
                    }
                }
                catch (e) {
                    // Don't let one tagger error stop the rest from running
                    logger_1.langLogger.error({ subject: this.subject, err: e }, 'Error applying tagger');
                }
            }));
            // Ensure that before inserting new tags, we discard any tag that may
            // have been evaluated to be added but is already present in the subject
            if (this.subjectStatus?.tags?.length) {
                for (const tag of this.subjectStatus.tags) {
                    tags.delete(tag);
                }
            }
            if (tags.size) {
                await this.moderationService.logEvent({
                    event: {
                        $type: 'tools.ozone.moderation.defs#modEventTag',
                        add: [...tags],
                        remove: [],
                    },
                    subject: this.subject,
                    createdBy: this.taggerDid,
                });
            }
        }
        catch (err) {
            logger_1.langLogger.error({ subject: this.subject, err }, 'Error tagging subject');
        }
    }
}
exports.TagService = TagService;
//# sourceMappingURL=index.js.map