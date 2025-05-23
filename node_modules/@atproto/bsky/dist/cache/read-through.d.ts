import { Redis } from '../redis';
export type CacheItem<T> = {
    val: T | null;
    updatedAt: number;
};
export type CacheOptions<T> = {
    staleTTL: number;
    maxTTL: number;
    fetchMethod: (key: string) => Promise<T | null>;
    fetchManyMethod?: (keys: string[]) => Promise<Record<string, T | null>>;
};
export declare class ReadThroughCache<T> {
    redis: Redis;
    opts: CacheOptions<T>;
    constructor(redis: Redis, opts: CacheOptions<T>);
    private _fetchMany;
    private fetchAndCache;
    private fetchAndCacheMany;
    get(key: string, opts?: {
        revalidate?: boolean;
    }): Promise<T | null>;
    getMany(keys: string[], opts?: {
        revalidate?: boolean;
    }): Promise<Record<string, T>>;
    set(key: string, val: T | null): Promise<void>;
    setMany(vals: Record<string, T | null>): Promise<void>;
    clearEntry(key: string): Promise<void>;
    isExpired(result: CacheItem<T>): boolean;
    isStale(result: CacheItem<T>): boolean;
}
//# sourceMappingURL=read-through.d.ts.map