"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetService = void 0;
const pagination_1 = require("../db/pagination");
class SetService {
    constructor(db) {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: db
        });
    }
    static creator() {
        return (db) => new SetService(db);
    }
    buildQueryForSetWithSize() {
        return this.db.db.selectFrom('set_detail as s').select([
            's.id',
            's.name',
            's.description',
            's.createdAt',
            's.updatedAt',
            (eb) => eb
                .selectFrom('set_value')
                .select((e) => e.fn.count('setId').as('count'))
                .whereRef('setId', '=', 's.id')
                .as('setSize'),
        ]);
    }
    async query({ limit, cursor, namePrefix, sortBy, sortDirection, }) {
        let qb = this.buildQueryForSetWithSize().limit(limit);
        if (namePrefix) {
            qb = qb.where('s.name', 'like', `${namePrefix}%`);
        }
        if (cursor) {
            if (sortBy === 'name') {
                qb = qb.where('s.name', sortDirection === 'asc' ? '>' : '<', cursor);
            }
            else {
                qb = qb.where(`s.${sortBy}`, sortDirection === 'asc' ? '>' : '<', new Date(cursor));
            }
        }
        qb = qb.orderBy(`s.${sortBy}`, sortDirection);
        const sets = await qb.execute();
        const lastItem = sets.at(-1);
        return {
            sets,
            cursor: lastItem
                ? sortBy === 'name'
                    ? lastItem?.name
                    : lastItem?.[sortBy].toISOString()
                : undefined,
        };
    }
    async getByName(name) {
        const query = this.db.db
            .selectFrom('set_detail')
            .selectAll()
            .where('name', '=', name);
        return await query.executeTakeFirst();
    }
    async getByNameWithSize(name) {
        return await this.buildQueryForSetWithSize()
            .where('s.name', '=', name)
            .executeTakeFirst();
    }
    async getSetWithValues({ name, limit, cursor, }) {
        const set = await this.getByNameWithSize(name);
        if (!set)
            return undefined;
        const { ref } = this.db.db.dynamic;
        const qb = this.db.db
            .selectFrom('set_value')
            .selectAll()
            .where('setId', '=', set.id);
        const keyset = new pagination_1.TimeIdKeyset(ref(`createdAt`), ref('id'));
        const paginatedBuilder = (0, pagination_1.paginate)(qb, {
            limit,
            cursor,
            keyset,
            direction: 'asc',
        });
        const result = await paginatedBuilder.execute();
        return {
            set,
            values: result.map((v) => v.value),
            cursor: keyset.packFromResult(result),
        };
    }
    async upsert({ name, description, }) {
        await this.db.db
            .insertInto('set_detail')
            .values({
            name,
            description,
            updatedAt: new Date(),
        })
            .onConflict((oc) => {
            // if description is provided as a string, even an empty one, update it
            // otherwise, just update the updatedAt timestamp
            return oc.column('name').doUpdateSet(typeof description === 'string'
                ? {
                    description,
                    updatedAt: new Date(),
                }
                : { updatedAt: new Date() });
        })
            .execute();
    }
    async addValues(setId, values) {
        await this.db.transaction(async (txn) => {
            const now = new Date();
            const query = txn.db
                .insertInto('set_value')
                .values(values.map((value) => ({
                setId,
                value,
                createdAt: now,
            })))
                .onConflict((oc) => oc.columns(['setId', 'value']).doNothing());
            await query.execute();
            // Update the set's updatedAt timestamp
            await txn.db
                .updateTable('set_detail')
                .set({ updatedAt: now })
                .where('id', '=', setId)
                .execute();
        });
    }
    async removeValues(setId, values) {
        if (values.length < 1) {
            return;
        }
        await this.db.transaction(async (txn) => {
            const query = txn.db
                .deleteFrom('set_value')
                .where('setId', '=', setId)
                .where('value', 'in', values);
            await query.execute();
            // Update the set's updatedAt timestamp
            await txn.db
                .updateTable('set_detail')
                .set({ updatedAt: new Date() })
                .where('id', '=', setId)
                .execute();
        });
    }
    async removeSet(setId) {
        await this.db.transaction(async (txn) => {
            await txn.db.deleteFrom('set_value').where('setId', '=', setId).execute();
            await txn.db.deleteFrom('set_detail').where('id', '=', setId).execute();
        });
    }
    view(set) {
        return {
            name: set.name,
            description: set.description || undefined,
            setSize: set.setSize,
            createdAt: set.createdAt.toISOString(),
            updatedAt: set.updatedAt.toISOString(),
        };
    }
}
exports.SetService = SetService;
//# sourceMappingURL=service.js.map