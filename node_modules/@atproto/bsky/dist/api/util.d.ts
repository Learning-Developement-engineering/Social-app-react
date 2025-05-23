import { ParsedLabelers } from '../util';
export declare const BSKY_USER_AGENT = "BskyAppView";
export declare const ATPROTO_CONTENT_LABELERS = "Atproto-Content-Labelers";
export declare const ATPROTO_REPO_REV = "Atproto-Repo-Rev";
type ResHeaderOpts = {
    labelers: ParsedLabelers;
    repoRev: string | null;
};
export declare const resHeaders: (opts: Partial<ResHeaderOpts>) => Record<string, string>;
export declare const clearlyBadCursor: (cursor?: string) => boolean;
export {};
//# sourceMappingURL=util.d.ts.map