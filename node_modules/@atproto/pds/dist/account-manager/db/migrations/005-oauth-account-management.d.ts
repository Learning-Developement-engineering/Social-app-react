import { Kysely } from 'kysely';
import { ClientId, DeviceId } from '@atproto/oauth-provider';
import { DateISO, JsonEncoded } from '../../../db';
export declare function up(db: Kysely<{
    account: {
        did: string;
    };
    device_account: {
        did: string;
        deviceId: DeviceId;
        remember: 0 | 1;
        authenticatedAt: string;
        authorizedClients: JsonEncoded<ClientId[]>;
    };
    account_device: {
        did: string;
        deviceId: DeviceId;
        createdAt: DateISO;
        updatedAt: DateISO;
    };
}>): Promise<void>;
export declare function down(db: Kysely<unknown>): Promise<void>;
//# sourceMappingURL=005-oauth-account-management.d.ts.map