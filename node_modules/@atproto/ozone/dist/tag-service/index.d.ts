import { ModerationService } from '../mod-service';
import { ModSubject } from '../mod-service/subject';
import { ModerationSubjectStatusRow } from '../mod-service/types';
export declare class TagService {
    private subject;
    protected subjectStatus: ModerationSubjectStatusRow | null;
    private taggerDid;
    private moderationService;
    private taggers;
    constructor(subject: ModSubject, subjectStatus: ModerationSubjectStatusRow | null, taggerDid: string, moderationService: ModerationService);
    evaluateForSubject(initialTags?: Iterable<string>): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map