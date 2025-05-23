import { OAuthTokenType } from '@atproto/oauth-types';
import { Code } from '../request/code.js';
/**
 * @note `iss` and `state` will be added from the
 * {@link AuthorizationResultRedirect} object.
 */
export type AuthorizationRedirectParameters = {
    code: Code;
    id_token?: string;
    access_token?: string;
    token_type?: OAuthTokenType;
    expires_in?: string;
} | {
    error: string;
    error_description?: string;
    error_uri?: string;
};
//# sourceMappingURL=authorization-redirect-parameters.d.ts.map