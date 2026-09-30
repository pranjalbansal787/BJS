import { cookies } from 'next/headers';
import { getProductsByIds } from './repo';
import type { Product } from './db/schema';

const COOKIE = 'bjs_cart';

export type CartLine = { productId: string; quantity: number };
export type CartEntry = { product: Product; quantity: number; lineTotalMinor: number };

export async function readCart(): Promise<CartLine[]> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l): l is CartLine => typeof l?.productId === 'string' && Number.isFinite(l?.quantity))
      .map((l) => ({ productId: l.productId, quantity: Math.max(1, Math.min(99, Math.trunc(l.quantity))) }));
  } catch {
    return [];
  }
}

export async function writeCart(lines: CartLine[]): Promise<void> {
  const jar = await cookies();
  if (lines.length === 0) {
    jar.delete(COOKIE);
    return;
  }
  jar.set(COOKIE, encodeURIComponent(JSON.stringify(lines)), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
}

/** Resolves cart cookie lines against live products, dropping anything deleted. */
export async function getCart(): Promise<{ entries: CartEntry[]; totalMinor: number; count: number }> {
  const lines = await readCart();
  if (lines.length === 0) return { entries: [], totalMinor: 0, count: 0 };

  const productList = await getProductsByIds(lines.map((l) => l.productId));
  const byId = new Map(productList.map((p) => [p.id, p]));

  const entries: CartEntry[] = [];
  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) continue;
    entries.push({
      product,
      quantity: line.quantity,
      lineTotalMinor: product.priceMinor * line.quantity,
    });
  }

  return {
    entries,
    totalMinor: entries.reduce((sum, e) => sum + e.lineTotalMinor, 0),
    count: entries.reduce((sum, e) => sum + e.quantity, 0),
  };
}
