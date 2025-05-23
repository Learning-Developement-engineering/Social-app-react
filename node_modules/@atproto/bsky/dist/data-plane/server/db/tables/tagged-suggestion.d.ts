export declare const tableName = "tagged_suggestion";
export interface TaggedSuggestion {
    tag: string;
    subject: string;
    subjectType: string;
}
export type PartialDB = {
    [tableName]: TaggedSuggestion;
};
//# sourceMappingURL=tagged-suggestion.d.ts.map