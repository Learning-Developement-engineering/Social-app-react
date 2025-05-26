"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDuplicateTemplateNameError = void 0;
// Postgresql will throw a specific error code with the constraint when trying to create a template with duplicate name
// see https://www.postgresql.org/docs/current/errcodes-appendix.html
const isDuplicateTemplateNameError = (err) => {
    return (err?.['code'] === '23505' &&
        err?.['constraint'] === 'communication_template_unique_name');
};
exports.isDuplicateTemplateNameError = isDuplicateTemplateNameError;
//# sourceMappingURL=util.js.map