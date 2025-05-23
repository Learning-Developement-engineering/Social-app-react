import { Etcd3, Watcher } from 'etcd3';
/**
 * A reactive map based on the keys and values stored within etcd under a given prefix.
 */
export declare class EtcdMap {
    private etcd;
    private prefix;
    inner: Map<string, VersionedValue>;
    watcher: Watcher;
    connecting: Promise<void> | undefined;
    handlers: ((self: EtcdMap) => void)[];
    constructor(etcd: Etcd3, prefix?: string);
    connect(): Promise<void>;
    get(key: string): string | null;
    values(): Generator<string, void, unknown>;
    onUpdate(handler: (self: EtcdMap) => void): void;
    private update;
    private apply;
}
type VersionedValue = {
    rev: number;
    value: string | null;
};
export {};
//# sourceMappingURL=etcd.d.ts.map