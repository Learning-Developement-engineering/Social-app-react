import { AtUri } from '@atproto/syntax';
import * as ChatBskyConvoDefs from '../lexicon/types/chat/bsky/convo/defs';
import { RepoRef } from '../lexicon/types/com/atproto/admin/defs';
import { InputSchema as ReportInput } from '../lexicon/types/com/atproto/moderation/createReport';
import * as ComAtprotoRepoStrongRef from '../lexicon/types/com/atproto/repo/strongRef';
import { InputSchema as ActionInput } from '../lexicon/types/tools/ozone/moderation/emitEvent';
import { $Typed } from '../lexicon/util';
import { ModerationEventRow, ModerationSubjectStatusRow } from './types';
type SubjectInput = ReportInput['subject'] | ActionInput['subject'];
type StrongRef = ComAtprotoRepoStrongRef.Main;
type MessageRef = ChatBskyConvoDefs.MessageRef;
export declare const subjectFromInput: (subject: SubjectInput, blobs?: string[]) => ModSubject;
export declare const subjectFromEventRow: (row: ModerationEventRow) => ModSubject;
export declare const subjectFromStatusRow: (row: ModerationSubjectStatusRow) => ModSubject;
type SubjectInfo = {
    subjectType: 'com.atproto.admin.defs#repoRef' | 'com.atproto.repo.strongRef' | 'chat.bsky.convo.defs#messageRef';
    subjectDid: string;
    subjectUri: string | null;
    subjectCid: string | null;
    subjectBlobCids: string[] | null;
    subjectMessageId: string | null;
    meta: Record<string, string | undefined> | null;
};
export interface ModSubject {
    did: string;
    recordPath: string | undefined;
    blobCids?: string[];
    isRepo(): this is RepoSubject;
    isRecord(): this is RecordSubject;
    isMessage(): this is MessageSubject;
    info(): SubjectInfo;
    lex(): $Typed<RepoRef> | $Typed<StrongRef> | $Typed<MessageRef>;
}
export declare class RepoSubject implements ModSubject {
    did: string;
    blobCids: undefined;
    recordPath: undefined;
    constructor(did: string);
    isRepo(): this is RepoSubject;
    isRecord(): this is RecordSubject;
    isMessage(): this is MessageSubject;
    info(): {
        subjectType: "com.atproto.admin.defs#repoRef";
        subjectDid: string;
        subjectUri: null;
        subjectCid: null;
        subjectBlobCids: null;
        subjectMessageId: null;
        meta: null;
    };
    lex(): $Typed<RepoRef>;
}
export declare class RecordSubject implements ModSubject {
    uri: string;
    cid: string;
    blobCids?: string[] | undefined;
    parsedUri: AtUri;
    did: string;
    recordPath: string;
    constructor(uri: string, cid: string, blobCids?: string[] | undefined);
    isRepo(): this is RepoSubject;
    isRecord(): this is RecordSubject;
    isMessage(): this is MessageSubject;
    info(): {
        subjectType: "com.atproto.repo.strongRef";
        subjectDid: string;
        subjectUri: string;
        subjectCid: string;
        subjectBlobCids: string[];
        subjectMessageId: null;
        meta: null;
    };
    lex(): $Typed<StrongRef>;
}
export declare class MessageSubject implements ModSubject {
    did: string;
    convoId: string;
    messageId: string;
    blobCids: undefined;
    recordPath: undefined;
    constructor(did: string, convoId: string, messageId: string);
    isRepo(): this is RepoSubject;
    isRecord(): this is RecordSubject;
    isMessage(): this is MessageSubject;
    info(): {
        subjectType: "chat.bsky.convo.defs#messageRef";
        subjectDid: string;
        subjectUri: null;
        subjectCid: null;
        subjectBlobCids: null;
        subjectMessageId: string;
        meta: {
            convoId: string | undefined;
        };
    };
    lex(): $Typed<MessageRef>;
}
export {};
//# sourceMappingURL=subject.d.ts.map