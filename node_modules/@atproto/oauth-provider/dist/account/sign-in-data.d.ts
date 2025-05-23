import { z } from 'zod';
export declare const signInDataSchema: z.ZodObject<{
    locale: z.ZodString;
    username: z.ZodString;
    password: z.ZodUnion<[z.ZodString, z.ZodString]>;
    emailOtp: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    locale: string;
    password: string;
    username: string;
    emailOtp?: string | undefined;
}, {
    locale: string;
    password: string;
    username: string;
    emailOtp?: string | undefined;
}>;
export type SignInData = z.output<typeof signInDataSchema>;
//# sourceMappingURL=sign-in-data.d.ts.map