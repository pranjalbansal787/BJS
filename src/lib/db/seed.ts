/**
 * Seeds a real Postgres database. Requires DATABASE_URL and a schema already
 * pushed with `npm run db:push`.
 *
 *   npm run db:push && npm run db:seed
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories, orders, products } from './schema';
import { seedCategories, seedOrders, seedProducts } from './seed-data';

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error('DATABASE_URL is not set. The app runs on the built-in store until you add one.');
    process.exit(1);
  }

  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql);

  console.log('Clearing existing rows…');
  await db.delete(orders);
  await db.delete(products);
  await db.delete(categories);

  console.log(`Inserting ${seedCategories.length} categories…`);
  await db.insert(categories).values(seedCategories);

  console.log(`Inserting ${seedProducts.length} products…`);
  await db.insert(products).values(seedProducts);

  console.log(`Inserting ${seedOrders.length} sample orders…`);
  await db.insert(orders).values(seedOrders.map((o) => ({ ...o, receiptUrl: null })));

  await sql.end();
  console.log('Done. Sign in at /admin with ADMIN_EMAIL and ADMIN_PASSWORD.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
