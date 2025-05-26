import { Selectable } from 'kysely';
import AtpAgent from '@atproto/api';
import { Database } from '../db';
import { Member } from '../db/schema/member';
import { ProfileViewDetailed } from '../lexicon/types/app/bsky/actor/defs';
import { Member as TeamMember } from '../lexicon/types/tools/ozone/team/defs';
import { AuthHeaders } from '../mod-service/views';
export type TeamServiceCreator = (db: Database) => TeamService;
export declare class TeamService {
    db: Database;
    private appviewAgent;
    private appviewDid;
    private createAuthHeaders;
    constructor(db: Database, appviewAgent: AtpAgent, appviewDid: string, createAuthHeaders: (aud: string, method: string) => Promise<AuthHeaders>);
    static creator(appviewAgent: AtpAgent, appviewDid: string, createAuthHeaders: (aud: string, method: string) => Promise<AuthHeaders>): (db: Database) => TeamService;
    list({ cursor, limit, roles, disabled, q, }: {
        q?: string;
        cursor?: string;
        limit?: number;
        disabled?: boolean;
        roles?: string[];
    }): Promise<{
        members: Selectable<Member>[];
        cursor?: string;
    }>;
    create({ role, did, disabled, updatedAt, createdAt, lastUpdatedBy, }: Omit<Selectable<Member>, 'createdAt' | 'updatedAt'> & {
        createdAt?: Date;
        updatedAt?: Date;
    }): Promise<Selectable<Member>>;
    upsert({ role, did, lastUpdatedBy, }: Pick<Selectable<Member>, 'role' | 'did' | 'lastUpdatedBy'>): Promise<void>;
    update(did: string, updates: Partial<Pick<Selectable<Member>, 'role' | 'disabled' | 'lastUpdatedBy' | 'updatedAt'>>): Promise<Selectable<Member>>;
    delete(did: string): Promise<void>;
    assertCanDelete(did: string): Promise<void>;
    doesMemberExist(did: string): Promise<boolean>;
    getMember(did: string): Promise<Selectable<Member> | undefined>;
    getMemberRole(member?: Selectable<Member>): {
        isModerator: boolean;
        isAdmin: boolean;
        isTriage: boolean;
        isVerifier: boolean;
    };
    getProfiles(dids: string[]): Promise<Map<string, ProfileViewDetailed>>;
    syncMemberProfiles(): Promise<void>;
    view(members: Selectable<Member>[]): Promise<TeamMember[]>;
}
//# sourceMappingURL=index.d.ts.map