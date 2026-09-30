import { and, asc, desc, eq, ilike, inArray, lte, or, sql } from 'drizzle-orm';
import { getDb, usingPostgres } from './db';
import { categories, orders, products } from './db/schema';
import type { Category, NewCategory, NewProduct, Order, OrderItem, Product } from './db/schema';
import { persist, store } from './db/local-store';

export type { Category, Order, OrderItem, Product };

export type ProductFilters = {
  categorySlugs?: string[];
  metals?: string[];
  purities?: string[];
  maxPriceMinor?: number;
  q?: string;
  sort?: 'featured' | 'low' | 'high' | 'name';
};

export const ORDER_STATUSES = [
  { key: 'pending', label: 'Payment under review', tone: 'wait' },
  { key: 'confirmed', label: 'Payment confirmed', tone: 'ok' },
  { key: 'packed', label: 'Packed & insured', tone: 'go' },
  { key: 'shipped', label: 'Out for delivery', tone: 'go' },
  { key: 'delivered', label: 'Delivered', tone: 'done' },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]['key'];

export function statusMeta(key: string) {
  return ORDER_STATUSES.find((s) => s.key === key) ?? ORDER_STATUSES[0];
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/* ------------------------------------------------------------------ *
 * Categories
 * ------------------------------------------------------------------ */

export async function listCategories(): Promise<Category[]> {
  const db = getDb();
  if (db) return db.select().from(categories).orderBy(asc(categories.position), asc(categories.name));
  return [...store.categories].sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = getDb();
  if (db) {
    const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return row ?? null;
  }
  return store.categories.find((c) => c.slug === slug) ?? null;
}

export async function createCategory(input: Omit<NewCategory, 'id' | 'slug'> & { slug?: string }): Promise<Category> {
  const row: Category = {
    id: newId('cat'),
    name: input.name,
    slug: input.slug || slugify(input.name),
    blurb: input.blurb ?? '',
    motif: input.motif ?? 'necklace',
    position: input.position ?? 99,
    createdAt: new Date(),
  };
  const db = getDb();
  if (db) {
    const [created] = await db.insert(categories).values(row).returning();
    return created;
  }
  store.categories.push(row);
  persist();
  return row;
}

export async function updateCategory(id: string, patch: Partial<NewCategory>): Promise<void> {
  const db = getDb();
  if (db) {
    await db.update(categories).set(patch).where(eq(categories.id, id));
    return;
  }
  const row = store.categories.find((c) => c.id === id);
  if (row) Object.assign(row, patch);
  persist();
}

export async function deleteCategory(id: string): Promise<void> {
  const db = getDb();
  if (db) {
    await db.update(products).set({ categoryId: '' }).where(eq(products.categoryId, id));
    await db.delete(categories).where(eq(categories.id, id));
    return;
  }
  store.products.forEach((p) => {
    if (p.categoryId === id) p.categoryId = '';
  });
  store.categories = store.categories.filter((c) => c.id !== id);
  persist();
}

/* ------------------------------------------------------------------ *
 * Products
 * ------------------------------------------------------------------ */

function sortProducts(rows: Product[], sort: ProductFilters['sort']): Product[] {
  const out = [...rows];
  if (sort === 'low') out.sort((a, b) => a.priceMinor - b.priceMinor);
  else if (sort === 'high') out.sort((a, b) => b.priceMinor - a.priceMinor);
  else if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name));
  else out.sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  return out;
}

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const cats = await listCategories();
  const categoryIds = filters.categorySlugs?.length
    ? cats.filter((c) => filters.categorySlugs!.includes(c.slug)).map((c) => c.id)
    : undefined;

  // A filter that matches no known category must return nothing, not everything.
  if (categoryIds && categoryIds.length === 0) return [];

  const db = getDb();
  if (db) {
    const clauses = [];
    if (categoryIds) clauses.push(inArray(products.categoryId, categoryIds));
    if (filters.metals?.length) clauses.push(inArray(products.metal, filters.metals));
    if (filters.purities?.length) clauses.push(inArray(products.purity, filters.purities));
    if (typeof filters.maxPriceMinor === 'number') clauses.push(lte(products.priceMinor, filters.maxPriceMinor));
    if (filters.q) {
      const needle = `%${filters.q}%`;
      clauses.push(or(ilike(products.name, needle), ilike(products.stones, needle), ilike(products.metal, needle)));
    }
    const rows = await db
      .select()
      .from(products)
      .where(clauses.length ? and(...clauses) : undefined);
    return sortProducts(rows, filters.sort);
  }

  const needle = filters.q?.toLowerCase();
  const rows = store.products.filter((p) => {
    if (categoryIds && !categoryIds.includes(p.categoryId)) return false;
    if (filters.metals?.length && !filters.metals.includes(p.metal)) return false;
    if (filters.purities?.length && !filters.purities.includes(p.purity)) return false;
    if (typeof filters.maxPriceMinor === 'number' && p.priceMinor > filters.maxPriceMinor) return false;
    if (needle) {
      const hay = `${p.name} ${p.metal} ${p.stones}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
  return sortProducts(rows, filters.sort);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDb();
  if (db) {
    const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return row ?? null;
  }
  return store.products.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = getDb();
  if (db) {
    const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return row ?? null;
  }
  return store.products.find((p) => p.id === id) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const db = getDb();
  if (db) return db.select().from(products).where(inArray(products.id, ids));
  return store.products.filter((p) => ids.includes(p.id));
}

export async function createProduct(input: Omit<NewProduct, 'id' | 'slug'> & { slug?: string }): Promise<Product> {
  const row: Product = {
    id: newId('prd'),
    name: input.name,
    slug: input.slug || slugify(input.name),
    categoryId: input.categoryId,
    priceMinor: input.priceMinor,
    purity: input.purity ?? '22KT',
    metal: input.metal ?? 'Yellow Gold',
    weight: input.weight ?? '',
    stones: input.stones ?? 'None',
    description: input.description ?? '',
    imageUrl: input.imageUrl ?? null,
    motif: input.motif ?? 'necklace',
    tone: input.tone ?? 't1',
    stock: input.stock ?? 0,
    featured: input.featured ?? false,
    tag: input.tag ?? null,
    createdAt: new Date(),
  };
  const db = getDb();
  if (db) {
    const [created] = await db.insert(products).values(row).returning();
    return created;
  }
  store.products.push(row);
  persist();
  return row;
}

export async function updateProduct(id: string, patch: Partial<NewProduct>): Promise<void> {
  const db = getDb();
  if (db) {
    await db.update(products).set(patch).where(eq(products.id, id));
    return;
  }
  const row = store.products.find((p) => p.id === id);
  if (row) Object.assign(row, patch);
  persist();
}

export async function deleteProduct(id: string): Promise<void> {
  const db = getDb();
  if (db) {
    await db.delete(products).where(eq(products.id, id));
    return;
  }
  store.products = store.products.filter((p) => p.id !== id);
  persist();
}

/* ------------------------------------------------------------------ *
 * Orders
 * ------------------------------------------------------------------ */

export async function listOrders(): Promise<Order[]> {
  const db = getDb();
  if (db) return db.select().from(orders).orderBy(desc(orders.createdAt));
  return [...store.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
  const db = getDb();
  if (db) {
    const [row] = await db.select().from(orders).where(eq(orders.reference, reference)).limit(1);
    return row ?? null;
  }
  return store.orders.find((o) => o.reference === reference) ?? null;
}

async function nextReference(): Promise<string> {
  const db = getDb();
  if (db) {
    const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
    return `BJS-${24817 + Number(row?.count ?? 0)}`;
  }
  return `BJS-${24817 + store.orders.length}`;
}

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderItem[];
  paymentReference: string;
  receiptName: string;
  receiptUrl: string | null;
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const totalMinor = input.items.reduce((sum, item) => sum + item.priceMinor * item.quantity, 0);
  const row: Order = {
    id: newId('ord'),
    reference: await nextReference(),
    customerName: input.customerName,
    phone: input.phone,
    email: input.email,
    address: input.address,
    city: input.city,
    pincode: input.pincode,
    items: input.items,
    totalMinor,
    status: 'pending',
    paymentMethod: 'UPI',
    paymentReference: input.paymentReference,
    receiptUrl: input.receiptUrl,
    receiptName: input.receiptName,
    createdAt: new Date(),
  };

  const db = getDb();
  if (db) {
    const [created] = await db.insert(orders).values(row).returning();
    for (const item of input.items) {
      await db
        .update(products)
        .set({ stock: sql`greatest(${products.stock} - ${item.quantity}, 0)` })
        .where(eq(products.id, item.productId));
    }
    return created;
  }

  store.orders.push(row);
  for (const item of input.items) {
    const product = store.products.find((p) => p.id === item.productId);
    if (product) product.stock = Math.max(0, product.stock - item.quantity);
  }
  persist();
  return row;
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const db = getDb();
  if (db) {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    return;
  }
  const row = store.orders.find((o) => o.id === id);
  if (row) row.status = status;
  persist();
}

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

export async function getDashboard() {
  const [allOrders, allProducts, allCategories] = await Promise.all([
    listOrders(),
    listProducts(),
    listCategories(),
  ]);
  return {
    orderCount: allOrders.length,
    pendingCount: allOrders.filter((o) => o.status === 'pending').length,
    productCount: allProducts.length,
    categoryCount: allCategories.length,
    stockValueMinor: allProducts.reduce((sum, p) => sum + p.priceMinor * p.stock, 0),
    recentOrders: allOrders.slice(0, 5),
    lowStock: allProducts.filter((p) => p.stock <= 3),
    usingPostgres,
  };
}
