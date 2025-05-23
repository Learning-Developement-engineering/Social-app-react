export type SubCtx<Parent extends object | void, Child extends object> = Child & Omit<Parent, keyof Child>;
export declare function subCtx<Parent extends object | void, Child extends object>(parent: Parent, child: Child): SubCtx<Parent, Child>;
//# sourceMappingURL=context.d.ts.map