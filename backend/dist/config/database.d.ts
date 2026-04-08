import postgres from 'postgres';
declare const client: postgres.Sql<{}>;
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
};
export { client };
//# sourceMappingURL=database.d.ts.map