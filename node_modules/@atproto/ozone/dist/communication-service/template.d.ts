import { Selectable } from 'kysely';
import { Database } from '../db';
import { CommunicationTemplate } from '../db/schema/communication_template';
import { TemplateView } from '../lexicon/types/tools/ozone/communication/defs';
export type CommunicationTemplateServiceCreator = (db: Database) => CommunicationTemplateService;
export declare class CommunicationTemplateService {
    db: Database;
    constructor(db: Database);
    static creator(): (db: Database) => CommunicationTemplateService;
    list(): Promise<Selectable<CommunicationTemplate>[]>;
    create({ name, contentMarkdown, subject, lang, disabled, updatedAt, createdAt, lastUpdatedBy, }: Omit<Selectable<CommunicationTemplate>, 'id' | 'createdAt' | 'updatedAt'> & {
        createdAt?: Date;
        updatedAt?: Date;
    }): Promise<Selectable<CommunicationTemplate>>;
    update(id: number, { name, contentMarkdown, subject, disabled, lang, updatedAt, lastUpdatedBy, }: Partial<Omit<Selectable<CommunicationTemplate>, 'id' | 'createdAt'>>): Promise<Selectable<CommunicationTemplate>>;
    delete(id: number): Promise<void>;
    view(template: Selectable<CommunicationTemplate>): TemplateView;
}
//# sourceMappingURL=template.d.ts.map