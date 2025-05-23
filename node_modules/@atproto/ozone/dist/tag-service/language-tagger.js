"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageTagger = void 0;
const api_1 = require("@atproto/api");
const logger_1 = require("../logger");
const content_tagger_1 = require("./content-tagger");
const language_data_1 = require("./language-data");
const ifString = (value) => typeof value === 'string' ? value : undefined;
const isStringProp = (obj, prop) => prop in obj ? ifString(obj[prop]) : undefined;
class LanguageTagger extends content_tagger_1.ContentTagger {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tagPrefix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'lang:'
        });
    }
    isApplicable() {
        return !!this.subjectStatus && !this.tagAlreadyExists();
    }
    async buildTags() {
        try {
            const recordLangs = await this.getRecordLang();
            return recordLangs
                ? recordLangs.map((lang) => `${this.tagPrefix}${lang}`)
                : [`${this.tagPrefix}und`];
        }
        catch (err) {
            logger_1.langLogger.error({ subject: this.subject, err }, 'Error getting record langs');
            return [];
        }
    }
    getTextFromRecord(recordValue) {
        let text;
        if (api_1.AppBskyGraphList.isRecord(recordValue)) {
            text =
                isStringProp(recordValue, 'description') ||
                    isStringProp(recordValue, 'name');
        }
        else if (api_1.AppBskyFeedGenerator.isRecord(recordValue) ||
            api_1.AppBskyActorProfile.isRecord(recordValue)) {
            text =
                isStringProp(recordValue, 'description') ||
                    isStringProp(recordValue, 'displayName');
        }
        else if (api_1.AppBskyFeedPost.isRecord(recordValue)) {
            text = isStringProp(recordValue, 'text');
        }
        return text?.trim();
    }
    async getRecordLang() {
        const langs = new Set();
        if (this.subject.isRepo() ||
            (this.subject.isRecord() &&
                this.subject.uri.endsWith('/app.bsky.actor.profile/self'))) {
            const feed = await this.moderationService.views.fetchAuthorFeed(this.subject.did);
            feed.forEach((item) => {
                const itemLangs = item.post.record['langs'];
                if (itemLangs?.length) {
                    // Pick the first fragment of the lang code so that instead of `en-US` and `en-GB` we get `en`
                    itemLangs.forEach((lang) => langs.add(lang.split('-')[0]));
                }
            });
        }
        if (this.subject.isRecord()) {
            const recordByUri = await this.moderationService.views.fetchRecords([
                this.subject,
            ]);
            const record = recordByUri.get(this.subject.uri);
            const recordLang = record?.value.langs;
            const recordText = record
                ? this.getTextFromRecord(record.value)
                : undefined;
            if (recordLang?.length) {
                recordLang
                    .map((lang) => lang.split('-')[0])
                    .forEach((lang) => langs.add(lang));
            }
            else if (recordText) {
                // 'lande' is an esm module, so we need to import it dynamically
                const { default: lande } = await Promise.resolve().then(() => __importStar(require('lande')));
                const detectedLanguages = lande(recordText);
                if (detectedLanguages.length) {
                    const langCode = (0, language_data_1.code3ToCode2)(detectedLanguages[0][0]);
                    if (langCode)
                        langs.add(langCode);
                }
            }
        }
        return langs.size > 0 ? Array.from(langs) : null;
    }
}
exports.LanguageTagger = LanguageTagger;
//# sourceMappingURL=language-tagger.js.map