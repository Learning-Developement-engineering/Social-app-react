import { ModerationService } from '../mod-service';
import { ModSubject } from '../mod-service/subject';
import { ModerationSubjectStatusRow } from '../mod-service/types';
export declare abstract class ContentTagger {
    protected subject: ModSubject;
    protected subjectStatus: ModerationSubjectStatusRow | null;
    protected moderationService: ModerationService;
    constructor(subject: ModSubject, subjectStatus: ModerationSubjectStatusRow | null, moderationService: ModerationService);
    protected abstract tagPrefix: string;
    protected abstract isApplicable(): boolean;
    protected abstract buildTags(): Promise<string[]>;
    getTags(): Promise<string[]>;
    protected tagAlreadyExists(): boolean;
}
//# sourceMappingURL=content-tagger.d.ts.map