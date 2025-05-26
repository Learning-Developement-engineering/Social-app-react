import { z } from 'zod';
export declare const DEVICE_ID_LENGTH: number;
export declare const deviceIdSchema: z.ZodEffects<z.ZodString, `dev-${string}`, string>;
export type DeviceId = z.infer<typeof deviceIdSchema>;
export declare function isDeviceId(value: unknown): value is DeviceId;
export declare const generateDeviceId: () => Promise<DeviceId>;
//# sourceMappingURL=device-id.d.ts.map