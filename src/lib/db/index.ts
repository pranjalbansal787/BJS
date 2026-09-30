import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export const databaseUrl = process.env.DATABASE_URL?.trim() || '';

/** True once a Postgres connection string is configured. */
export const usingPostgres = databaseUrl.length > 0;

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __bjsSql?: ReturnType<typeof postgres>;
  __bjsDb?: Db;
};

export function getDb(): Db | null {
  if (!usingPostgres) return null;
  if (!globalForDb.__bjsDb) {
    const sql = globalForDb.__bjsSql ?? postgres(databaseUrl, { max: 5, prepare: false });
    globalForDb.__bjsSql = sql;
    globalForDb.__bjsDb = drizzle(sql, { schema });
  }
  return globalForDb.__bjsDb;
}

export { schema };
