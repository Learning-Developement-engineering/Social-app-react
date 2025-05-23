import { Client as PlcClient } from '@did-plc/lib';
import * as plc from '@did-plc/server';
import { PlcConfig } from './types';
export declare class TestPlc {
    url: string;
    port: number;
    server: plc.PlcServer;
    constructor(url: string, port: number, server: plc.PlcServer);
    static create(cfg: PlcConfig): Promise<TestPlc>;
    get ctx(): plc.AppContext;
    getClient(): PlcClient;
    close(): Promise<void>;
}
//# sourceMappingURL=plc.d.ts.map