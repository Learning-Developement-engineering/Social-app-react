import { ContentTagger } from './content-tagger';
export declare class EmbedTagger extends ContentTagger {
    tagPrefix: string;
    isApplicable(): boolean;
    buildTags(): Promise<string[]>;
    getRecordValue(): Promise<Record<string, unknown> | undefined>;
}
//# sourceMappingURL=embed-tagger.d.ts.map