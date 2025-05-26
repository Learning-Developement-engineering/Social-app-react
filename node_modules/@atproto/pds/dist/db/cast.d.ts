export type DateISO = `${string}T${string}Z`;
export declare function toDateISO(date: Date): DateISO;
export declare function fromDateISO(dateStr: DateISO): Date;
/**
 * Allows to ensure that {@link JsonEncoded} is not used with non-JSON
 * serializable values (e.g. {@link Date} or {@link Function}s).
 */
export type Encodable = string | number | boolean | null | readonly Encodable[] | {
    readonly [_ in string]?: Encodable;
};
export type JsonString<T extends Encodable> = T extends readonly unknown[] ? `[${string}]` : T extends object ? `{${string}}` : T extends string ? `"${string}"` : T extends number ? `${number}` : T extends boolean ? `true` | `false` : T extends null ? `null` : never;
declare const jsonEncodedType: unique symbol;
export type JsonEncoded<T extends Encodable = Encodable> = JsonString<T> & {
    [jsonEncodedType]: T;
};
export declare function toJson<T extends Encodable>(value: T): JsonEncoded<T>;
export declare function fromJson<T extends Encodable>(jsonStr: JsonEncoded<T>): T;
export {};
//# sourceMappingURL=cast.d.ts.map