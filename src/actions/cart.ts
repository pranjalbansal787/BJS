'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { readCart, writeCart } from '@/lib/cart';
import { getProductById } from '@/lib/repo';

export async function addToCart(formData: FormData) {
  const productId = String(formData.get('productId') ?? '');
  const quantity = Math.max(1, Math.min(99, Number(formData.get('quantity') ?? 1) || 1));

  const product = await getProductById(productId);
  if (!product) redirect('/collection');

  const lines = await readCart();
  const existing = lines.find((l) => l.productId === productId);
  if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
  else lines.push({ productId, quantity });

  await writeCart(lines);
  revalidatePath('/cart');
  redirect('/cart');
}

export async function updateCartLine(formData: FormData) {
  const productId = String(formData.get('productId') ?? '');
  const delta = Number(formData.get('delta') ?? 0) || 0;

  let lines = await readCart();
  const existing = lines.find((l) => l.productId === productId);
  if (existing) {
    existing.quantity += delta;
    if (existing.quantity < 1) lines = lines.filter((l) => l.productId !== productId);
  }

  await writeCart(lines);
  revalidatePath('/cart');
  revalidatePath('/checkout');
}

export async function removeCartLine(formData: FormData) {
  const productId = String(formData.get('productId') ?? '');
  const lines = (await readCart()).filter((l) => l.productId !== productId);
  await writeCart(lines);
  revalidatePath('/cart');
  revalidatePath('/checkout');
}
