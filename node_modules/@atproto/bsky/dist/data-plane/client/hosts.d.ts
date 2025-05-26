import { Etcd3 } from 'etcd3';
/**
 * Interface for a reactive list of hosts, i.e. for use with the dataplane client.
 */
export interface HostList {
    get: () => Iterable<string>;
    onUpdate(handler: HostListHandler): void;
}
type HostListHandler = (hosts: Iterable<string>) => void;
/**
 * Maintains a reactive HostList based on a simple setter.
 */
export declare class BasicHostList implements HostList {
    private hosts;
    private handlers;
    constructor(hosts: Iterable<string>);
    get(): Iterable<string>;
    set(hosts: Iterable<string>): void;
    private update;
    onUpdate(handler: HostListHandler): void;
}
/**
 * Maintains a reactive HostList based on etcd key values under a given key prefix.
 * When fallback is provided, ensures that this fallback is used whenever no hosts are available.
 */
export declare class EtcdHostList implements HostList {
    private kv;
    private inner;
    private fallback;
    constructor(etcd: Etcd3, prefix: string, fallback?: string[]);
    connect(): Promise<void>;
    get(): Iterable<string>;
    private update;
    onUpdate(handler: HostListHandler): void;
}
export {};
//# sourceMappingURL=hosts.d.ts.map