"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPipeline = createPipeline;
exports.noRules = noRules;
function createPipeline(skeletonFn, hydrationFn, rulesFn, presentationFn) {
    return async (params, ctx) => {
        const skeleton = await skeletonFn({ ctx, params });
        const hydration = await hydrationFn({ ctx, params, skeleton });
        const appliedRules = rulesFn({ ctx, params, skeleton, hydration });
        return presentationFn({ ctx, params, skeleton: appliedRules, hydration });
    };
}
function noRules(input) {
    return input.skeleton;
}
//# sourceMappingURL=pipeline.js.map