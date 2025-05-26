import { Redis as RedisDriver } from 'ioredis';
export declare class Redis {
    driver: RedisDriver;
    namespace?: string;
    constructor(opts: RedisOptions);
    withNamespace(namespace: string): Redis;
    readStreams(streams: StreamRef[], opts: {
        count: number;
        blockMs?: number;
    }): Promise<StreamOutput[]>;
    addToStream(key: string, id: number | string, fields: [key: string, value: string | Buffer][]): Promise<void>;
    addMultiToStream(evts: {
        key: string;
        id: number | string;
        fields: [key: string, value: string | Buffer][];
    }[]): Promise<[error: Error | null, result: unknown][]>;
    trimStream(key: string, cursor: number | string): Promise<void>;
    streamLengths(keys: string[]): Promise<number[]>;
    get(key: string): Promise<string | null>;
    set(key: string, val: string | number, ttlMs?: number): Promise<void>;
    getMulti(keys: string[]): Promise<{}>;
    setMulti(vals: Record<string, string | number>, ttlMs?: number): Promise<void>;
    del(key: string): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    zremrangebyscore(key: string, min: number, max: number): Promise<number>;
    zcount(key: string, min: number, max: number): Promise<number>;
    zadd(key: string, score: number, member: number | string): Promise<number>;
    destroy(): Promise<void>;
    ns(key: string): string;
    rmns(key: string): string;
}
type StreamRef = {
    key: string;
    cursor: string | number;
};
type StreamOutput = {
    key: string;
    messages: {
        cursor: string;
        contents: Record<string, Buffer | undefined>;
    }[];
};
export type RedisOptions = ({
    driver: RedisDriver;
} | {
    host: string;
} | {
    sentinel: string;
    hosts: string[];
}) & {
    password?: string;
    namespace?: string;
    db?: number;
    commandTimeout?: number;
};
export declare function addressParts(addr: string, defaultPort?: number): {
    host: string;
    port: number;
};
export {};
//# sourceMappingURL=redis.d.ts.map