import { AnyQb, DbRef } from './types';
export type Cursor = {
    primary: string;
    secondary: string;
};
export type LabeledResult = {
    primary: string | number;
    secondary: string | number;
};
/**
 * The GenericKeyset is an abstract class that sets-up the interface and partial implementation
 * of a keyset-paginated cursor with two parts. There are three types involved:
 *  - Result: a raw result (i.e. a row from the db) containing data that will make-up a cursor.
 *    - E.g. { createdAt: '2022-01-01T12:00:00Z', cid: 'bafyx' }
 *  - LabeledResult: a Result processed such that the "primary" and "secondary" parts of the cursor are labeled.
 *    - E.g. { primary: '2022-01-01T12:00:00Z', secondary: 'bafyx' }
 *  - Cursor: the two string parts that make-up the packed/string cursor.
 *    - E.g. packed cursor '1641038400000::bafyx' in parts { primary: '1641038400000', secondary: 'bafyx' }
 *
 * These types relate as such. Implementers define the relations marked with a *:
 *   Result -*-> LabeledResult <-*-> Cursor <--> packed/string cursor
 *                     ↳ SQL Condition
 */
export declare abstract class GenericKeyset<R, LR extends LabeledResult> {
    primary: DbRef;
    secondary: DbRef;
    constructor(primary: DbRef, secondary: DbRef);
    abstract labelResult(result: R): LR;
    abstract labeledResultToCursor(labeled: LR): Cursor;
    abstract cursorToLabeledResult(cursor: Cursor): LR;
    packFromResult(results: R | R[]): string | undefined;
    pack(labeled?: LR): string | undefined;
    unpack(cursorStr?: string): LR | undefined;
    packCursor(cursor?: Cursor): string | undefined;
    unpackCursor(cursorStr?: string): Cursor | undefined;
    getSql(labeled?: LR, direction?: 'asc' | 'desc', tryIndex?: boolean): import("kysely").RawBuilder<unknown> | undefined;
}
type StatusKeysetParam = {
    lastReviewedAt: string | null;
    lastReportedAt: string | null;
    id: number;
};
export declare class StatusKeyset extends GenericKeyset<StatusKeysetParam, Cursor> {
    labelResult(result: StatusKeysetParam): Cursor;
    labeledResultToCursor(labeled: Cursor): {
        primary: string;
        secondary: string;
    };
    cursorToLabeledResult(cursor: Cursor): {
        primary: string;
        secondary: string;
    };
    unpackCursor(cursorStr?: string): Cursor | undefined;
    getSql(labeled?: Cursor, direction?: 'asc' | 'desc'): import("kysely").RawBuilder<unknown> | undefined;
}
type TimeIdKeysetParam = {
    id: number;
    createdAt: string | Date;
};
type TimeIdResult = TimeIdKeysetParam;
export declare class TimeIdKeyset extends GenericKeyset<TimeIdKeysetParam, Cursor> {
    labelResult(result: TimeIdResult): Cursor;
    labeledResultToCursor(labeled: Cursor): {
        primary: string;
        secondary: string;
    };
    cursorToLabeledResult(cursor: Cursor): {
        primary: string;
        secondary: string;
    };
}
type CreatedAtUriKeysetParam = {
    createdAt: string;
    uri: string;
};
export declare class CreatedAtUriKeyset extends GenericKeyset<CreatedAtUriKeysetParam, Cursor> {
    labelResult(result: CreatedAtUriKeysetParam): Cursor;
    labeledResultToCursor(labeled: Cursor): {
        primary: string;
        secondary: string;
    };
    cursorToLabeledResult(cursor: Cursor): {
        primary: string;
        secondary: string;
    };
}
export declare const paginate: <QB extends AnyQb, K extends GenericKeyset<unknown, any>>(qb: QB, opts: {
    limit?: number;
    cursor?: string;
    direction?: "asc" | "desc";
    keyset: K;
    tryIndex?: boolean;
    nullsLast?: boolean;
}) => QB;
export {};
//# sourceMappingURL=pagination.d.ts.map