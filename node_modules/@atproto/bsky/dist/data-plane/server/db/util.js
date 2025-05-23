"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyDialect = exports.valuesList = exports.noMatch = exports.excluded = exports.countAll = exports.softDeleted = exports.notSoftDeletedClause = exports.actorWhereClause = void 0;
const kysely_1 = require("kysely");
const actorWhereClause = (actor) => {
    if (actor.startsWith('did:')) {
        return (0, kysely_1.sql) `"actor"."did" = ${actor}`;
    }
    else {
        return (0, kysely_1.sql) `"actor"."handle" = ${actor}`;
    }
};
exports.actorWhereClause = actorWhereClause;
// Applies to actor or record table
const notSoftDeletedClause = (alias) => {
    return (0, kysely_1.sql) `${alias}."takedownRef" is null`;
};
exports.notSoftDeletedClause = notSoftDeletedClause;
const softDeleted = (actorOrRecord) => {
    return actorOrRecord.takedownRef !== null;
};
exports.softDeleted = softDeleted;
exports.countAll = (0, kysely_1.sql) `count(*)`;
// For use with doUpdateSet()
const excluded = (db, col) => {
    return (0, kysely_1.sql) `${db.dynamic.ref(`excluded.${col}`)}`;
};
exports.excluded = excluded;
exports.noMatch = (0, kysely_1.sql) `1 = 0`;
// Can be useful for large where-in clauses, to get the db to use a hash lookup on the list
const valuesList = (vals) => {
    return (0, kysely_1.sql) `(values (${kysely_1.sql.join(vals, (0, kysely_1.sql) `), (`)}))`;
};
exports.valuesList = valuesList;
exports.dummyDialect = {
    createAdapter() {
        return new kysely_1.SqliteAdapter();
    },
    createDriver() {
        return new kysely_1.DummyDriver();
    },
    createIntrospector(db) {
        return new kysely_1.SqliteIntrospector(db);
    },
    createQueryCompiler() {
        return new kysely_1.SqliteQueryCompiler();
    },
};
//# sourceMappingURL=util.js.map