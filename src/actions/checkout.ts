'use server';

import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { redirect } from 'next/navigation';
import { getCart, writeCart } from '@/lib/cart';
import { createOrder } from '@/lib/repo';
import type { OrderItem } from '@/lib/repo';

export type CheckoutState = { errors: Record<string, string>; values: Record<string, string> };

const REQUIRED: Record<string, string> = {
  customerName: 'Please enter a name',
  phone: 'We need a number to confirm on WhatsApp',
  address: 'Please enter the address',
  city: 'Please enter the city',
  pincode: 'Please enter the PIN code',
};

/**
 * Receipts are written to public/uploads so the MVP runs with no object store.
 * On a read-only or ephemeral filesystem the upload is skipped and only the
 * filename is recorded; swap this for Supabase Storage before going live.
 */
async function storeReceipt(file: File | null): Promise<{ url: string | null; name: string }> {
  if (!file || file.size === 0) return { url: null, name: '' };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  try {
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}-${safeName}`;
    await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
    return { url: `/uploads/${filename}`, name: safeName };
  } catch {
    return { url: null, name: safeName };
  }
}

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values: Record<string, string> = {};
  for (const key of ['customerName', 'phone', 'email', 'address', 'city', 'pincode', 'paymentReference']) {
    values[key] = String(formData.get(key) ?? '').trim();
  }

  const errors: Record<string, string> = {};
  for (const [key, message] of Object.entries(REQUIRED)) {
    if (!values[key]) errors[key] = message;
  }
  if (values.pincode && !/^\d{6}$/.test(values.pincode)) errors.pincode = 'A PIN code is six digits';
  if (values.phone && values.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Enter a ten-digit mobile number';
  }

  const receiptFile = formData.get('receipt');
  const hasReceipt = receiptFile instanceof File && receiptFile.size > 0;
  if (!hasReceipt) errors.receipt = 'Attach the payment screenshot so we can verify it';

  const { entries } = await getCart();
  if (entries.length === 0) errors.cart = 'Your cart is empty';

  if (Object.keys(errors).length > 0) return { errors, values };

  const receipt = await storeReceipt(hasReceipt ? (receiptFile as File) : null);

  const items: OrderItem[] = entries.map((entry) => ({
    productId: entry.product.id,
    name: entry.product.name,
    priceMinor: entry.product.priceMinor,
    quantity: entry.quantity,
    motif: entry.product.motif,
    tone: entry.product.tone,
    imageUrl: entry.product.imageUrl,
  }));

  const order = await createOrder({
    customerName: values.customerName,
    phone: values.phone,
    email: values.email,
    address: values.address,
    city: values.city,
    pincode: values.pincode,
    items,
    paymentReference: values.paymentReference,
    receiptName: receipt.name,
    receiptUrl: receipt.url,
  });

  await writeCart([]);
  redirect(`/order/${order.reference}`);
}
