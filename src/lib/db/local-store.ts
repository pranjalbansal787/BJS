import fs from 'node:fs';
import path from 'node:path';
import type { Category, Order, Product } from './schema';
import { seedCategories, seedOrders, seedProducts } from './seed-data';

/**
 * Zero-configuration store used when DATABASE_URL is not set.
 *
 * It keeps the catalogue in memory and mirrors it to data/store.json whenever
 * the filesystem is writable, so `npm run dev` survives a restart. On a
 * read-only serverless filesystem the mirror is skipped and the process falls
 * back to memory alone. Set DATABASE_URL and the whole module goes unused.
 */

type Snapshot = {
  categories: Category[];
  products: Product[];
  orders: Order[];
};

const STORE_PATH = path.join(process.cwd(), 'data', 'store.json');

function buildSeed(): Snapshot {
  const now = new Date();
  return {
    categories: seedCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      blurb: c.blurb ?? '',
      motif: c.motif ?? 'necklace',
      position: c.position ?? 0,
      createdAt: now,
    })),
    products: seedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      priceMinor: p.priceMinor,
      purity: p.purity ?? '22KT',
      metal: p.metal ?? 'Yellow Gold',
      weight: p.weight ?? '',
      stones: p.stones ?? 'None',
      description: p.description ?? '',
      imageUrl: p.imageUrl ?? null,
      motif: p.motif ?? 'necklace',
      tone: p.tone ?? 't1',
      stock: p.stock ?? 0,
      featured: p.featured ?? false,
      tag: p.tag ?? null,
      createdAt: now,
    })),
    orders: seedOrders.map((o) => ({
      id: o.id,
      reference: o.reference,
      customerName: o.customerName,
      phone: o.phone,
      email: o.email,
      address: o.address,
      city: o.city,
      pincode: o.pincode,
      items: o.items,
      totalMinor: o.totalMinor,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentReference: o.paymentReference,
      receiptUrl: null,
      receiptName: o.receiptName,
      createdAt: o.createdAt,
    })),
  };
}

function revive(raw: string): Snapshot {
  const parsed = JSON.parse(raw) as Snapshot;
  const toDate = <T extends { createdAt: unknown }>(row: T): T =>
    ({ ...row, createdAt: new Date(row.createdAt as string) });
  return {
    categories: parsed.categories.map(toDate),
    products: parsed.products.map(toDate),
    orders: parsed.orders.map(toDate),
  };
}

function load(): Snapshot {
  try {
    if (fs.existsSync(STORE_PATH)) return revive(fs.readFileSync(STORE_PATH, 'utf8'));
  } catch {
    // Unreadable or corrupt mirror: fall through to a fresh seed.
  }
  return buildSeed();
}

// Survives hot reloads in development, where module state is otherwise reset.
const globalForStore = globalThis as unknown as { __bjsStore?: Snapshot };
const snapshot: Snapshot = globalForStore.__bjsStore ?? load();
globalForStore.__bjsStore = snapshot;

export function persist(): void {
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(snapshot, null, 2));
  } catch {
    // Read-only filesystem (serverless). Memory remains the source of truth.
  }
}

export const store = snapshot;
