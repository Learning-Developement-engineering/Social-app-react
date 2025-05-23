import { AuthorizedClientData, AuthorizedClients, ClientId, Sub } from '@atproto/oauth-provider';
import { AccountDb } from '../db';
export declare function upsert(db: AccountDb, did: string, clientId: ClientId, data: AuthorizedClientData): Promise<import("kysely").InsertResult>;
export declare function getAuthorizedClients(db: AccountDb, did: string): Promise<AuthorizedClients>;
export declare function getAuthorizedClientsMulti(db: AccountDb, dids: Iterable<string>): Promise<Map<Sub, AuthorizedClients>>;
//# sourceMappingURL=authorized-client.d.ts.map