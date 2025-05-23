import { OzoneEnvironment } from './env';
export declare const envToSecrets: (env: OzoneEnvironment) => OzoneSecrets;
export type OzoneSecrets = {
    adminPassword: string;
    signingKeyHex: string;
};
//# sourceMappingURL=secrets.d.ts.map