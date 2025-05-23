import { ContentTagger } from './content-tagger';
export declare class LanguageTagger extends ContentTagger {
    tagPrefix: string;
    isApplicable(): boolean;
    buildTags(): Promise<string[]>;
    getTextFromRecord(recordValue: Record<string, unknown>): string | undefined;
    getRecordLang(): Promise<string[] | null>;
}
//# sourceMappingURL=language-tagger.d.ts.map