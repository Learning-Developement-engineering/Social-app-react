"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunicationTemplateService = void 0;
class CommunicationTemplateService {
    constructor(db) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
    }
    static creator() {
        return (db) => new CommunicationTemplateService(db);
    }
    async list() {
        const list = await this.db.db
            .selectFrom('communication_template')
            .selectAll()
            .execute();
        return list;
    }
    async create({ name, contentMarkdown, subject, lang, disabled, updatedAt, createdAt, lastUpdatedBy, }) {
        const newTemplate = await this.db.db
            .insertInto('communication_template')
            .values({
            name,
            contentMarkdown,
            subject,
            lang,
            disabled,
            lastUpdatedBy,
            updatedAt: updatedAt || new Date(),
            createdAt: createdAt || new Date(),
        })
            .returningAll()
            .executeTakeFirstOrThrow();
        return newTemplate;
    }
    async update(id, { name, contentMarkdown, subject, disabled, lang, updatedAt, lastUpdatedBy, }) {
        const updatedTemplate = await this.db.db
            .updateTable('communication_template')
            .where('id', '=', id)
            .set({
            name,
            contentMarkdown,
            subject,
            lang,
            disabled,
            lastUpdatedBy,
            updatedAt: updatedAt || new Date(),
        })
            .returningAll()
            .executeTakeFirstOrThrow();
        return updatedTemplate;
    }
    async delete(id) {
        await this.db.db
            .deleteFrom('communication_template')
            .where('id', '=', id)
            .execute();
    }
    view(template) {
        return {
            id: `${template.id}`,
            name: template.name,
            contentMarkdown: template.contentMarkdown,
            disabled: template.disabled,
            lang: template.lang || undefined,
            subject: template.subject || undefined,
            createdAt: template.createdAt.toISOString(),
            updatedAt: template.updatedAt.toISOString(),
            lastUpdatedBy: template.lastUpdatedBy,
        };
    }
}
exports.CommunicationTemplateService = CommunicationTemplateService;
//# sourceMappingURL=template.js.map