export declare const envToCfg: (env: ServerEnvironment) => ServerConfig;
export type ServerConfig = {
    service: ServiceConfig;
    db: DatabaseConfig;
    auth: AuthConfig;
};
type ServiceConfig = {
    port: number;
    version?: string;
    longPollTimeoutMs: number;
};
type DatabaseConfig = {
    url: string;
    schema?: string;
    poolSize?: number;
    poolMaxUses?: number;
    poolIdleTimeoutMs?: number;
    migrate?: boolean;
};
type AuthConfig = {
    apiKeys: Set<string>;
};
export declare const readEnv: () => ServerEnvironment;
export type ServerEnvironment = {
    port?: number;
    version?: string;
    longPollTimeoutMs?: number;
    dbUrl?: string;
    dbSchema?: string;
    dbPoolSize?: number;
    dbPoolMaxUses?: number;
    dbPoolIdleTimeoutMs?: number;
    dbMigrate?: boolean;
    apiKeys: string[];
};
export {};
//# sourceMappingURL=config.d.ts.map