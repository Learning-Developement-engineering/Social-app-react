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
exports.MessageSubject = exports.RecordSubject = exports.RepoSubject = exports.subjectFromStatusRow = exports.subjectFromEventRow = exports.subjectFromInput = void 0;
const syntax_1 = require("@atproto/syntax");
const xrpc_server_1 = require("@atproto/xrpc-server");
const ChatBskyConvoDefs = __importStar(require("../lexicon/types/chat/bsky/convo/defs"));
const defs_1 = require("../lexicon/types/com/atproto/admin/defs");
const ComAtprotoRepoStrongRef = __importStar(require("../lexicon/types/com/atproto/repo/strongRef"));
const util_1 = require("../lexicon/util");
const isStrongRef = (0, util_1.asPredicate)(ComAtprotoRepoStrongRef.validateMain);
const isValidMessageRef = (0, util_1.asPredicate)(ChatBskyConvoDefs.validateMessageRef);
const isMessageRefWithoutConvoId = (subject) => subject != null &&
    typeof subject === 'object' &&
    isValidMessageRef({ convoId: '', ...subject });
const subjectFromInput = (subject, blobs) => {
    if ((0, defs_1.isRepoRef)(subject)) {
        if (blobs && blobs.length > 0) {
            throw new xrpc_server_1.InvalidRequestError('Blobs do not apply to repo subjects');
        }
        return new RepoSubject(subject.did);
    }
    if (isStrongRef(subject)) {
        return new RecordSubject(subject.uri, subject.cid, blobs);
    }
    // @NOTE #messageRef is not a report input for com.atproto.moderation.createReport.
    // we are taking advantage of the open union in order for bsky.chat to interoperate here.
    if (isValidMessageRef(subject)) {
        return new MessageSubject(subject.did, subject.convoId, subject.messageId);
    }
    // @TODO we should start to require subject.convoId is a string in order to properly validate
    // the #messageRef. temporarily allowing it to be optional as a stopgap for rollout.
    // The next "if" can be removed once convoId is consistently provided.
    if (isMessageRefWithoutConvoId(subject)) {
        return new MessageSubject(subject.did, subject.convoId ?? '', subject.messageId);
    }
    throw new xrpc_server_1.InvalidRequestError('Invalid subject');
};
exports.subjectFromInput = subjectFromInput;
const subjectFromEventRow = (row) => {
    if (row.subjectType === 'com.atproto.repo.strongRef' &&
        row.subjectUri &&
        row.subjectCid) {
        return new RecordSubject(row.subjectUri, row.subjectCid, row.subjectBlobCids ?? []);
    }
    else if (row.subjectType === 'chat.bsky.convo.defs#messageRef' &&
        row.subjectMessageId) {
        const convoId = typeof row.meta?.['convoId'] === 'string' ? row.meta['convoId'] : '';
        return new MessageSubject(row.subjectDid, convoId, row.subjectMessageId);
    }
    else {
        return new RepoSubject(row.subjectDid);
    }
};
exports.subjectFromEventRow = subjectFromEventRow;
const subjectFromStatusRow = (row) => {
    if (row.recordPath && row.recordCid) {
        // Not too intuitive but the recordpath is basically <collection>/<rkey>
        // which is what the last 2 params of .make() arguments are
        const uri = syntax_1.AtUri.make(row.did, ...row.recordPath.split('/')).toString();
        return new RecordSubject(uri.toString(), row.recordCid, row.blobCids ?? []);
    }
    else {
        return new RepoSubject(row.did);
    }
};
exports.subjectFromStatusRow = subjectFromStatusRow;
class RepoSubject {
    constructor(did) {
        Object.defineProperty(this, "did", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: did
        });
        Object.defineProperty(this, "blobCids", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "recordPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
    }
    isRepo() {
        return true;
    }
    isRecord() {
        return false;
    }
    isMessage() {
        return false;
    }
    info() {
        return {
            subjectType: 'com.atproto.admin.defs#repoRef',
            subjectDid: this.did,
            subjectUri: null,
            subjectCid: null,
            subjectBlobCids: null,
            subjectMessageId: null,
            meta: null,
        };
    }
    lex() {
        return {
            $type: 'com.atproto.admin.defs#repoRef',
            did: this.did,
        };
    }
}
exports.RepoSubject = RepoSubject;
class RecordSubject {
    constructor(uri, cid, blobCids) {
        Object.defineProperty(this, "uri", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: uri
        });
        Object.defineProperty(this, "cid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cid
        });
        Object.defineProperty(this, "blobCids", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: blobCids
        });
        Object.defineProperty(this, "parsedUri", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "did", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "recordPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.parsedUri = new syntax_1.AtUri(uri);
        this.did = this.parsedUri.hostname;
        this.recordPath = `${this.parsedUri.collection}/${this.parsedUri.rkey}`;
    }
    isRepo() {
        return false;
    }
    isRecord() {
        return true;
    }
    isMessage() {
        return false;
    }
    info() {
        return {
            subjectType: 'com.atproto.repo.strongRef',
            subjectDid: this.did,
            subjectUri: this.uri,
            subjectCid: this.cid,
            subjectBlobCids: this.blobCids ?? [],
            subjectMessageId: null,
            meta: null,
        };
    }
    lex() {
        return {
            $type: 'com.atproto.repo.strongRef',
            uri: this.uri,
            cid: this.cid,
        };
    }
}
exports.RecordSubject = RecordSubject;
class MessageSubject {
    constructor(did, convoId, messageId) {
        Object.defineProperty(this, "did", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: did
        });
        Object.defineProperty(this, "convoId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: convoId
        });
        Object.defineProperty(this, "messageId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: messageId
        });
        Object.defineProperty(this, "blobCids", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
        Object.defineProperty(this, "recordPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: undefined
        });
    }
    isRepo() {
        return false;
    }
    isRecord() {
        return false;
    }
    isMessage() {
        return true;
    }
    info() {
        return {
            subjectType: 'chat.bsky.convo.defs#messageRef',
            subjectDid: this.did,
            subjectUri: null,
            subjectCid: null,
            subjectBlobCids: null,
            subjectMessageId: this.messageId,
            meta: { convoId: this.convoId || undefined },
        };
    }
    lex() {
        return {
            $type: 'chat.bsky.convo.defs#messageRef',
            did: this.did,
            convoId: this.convoId,
            messageId: this.messageId,
        };
    }
}
exports.MessageSubject = MessageSubject;
//# sourceMappingURL=subject.js.map