'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSession, destroySession, requireSession, verifyCredentials } from '@/lib/auth';
import {
  createCategory, createProduct, deleteCategory, deleteProduct,
  slugify, updateCategory, updateOrderStatus, updateProduct,
} from '@/lib/repo';
import { rupeesToMinor } from '@/lib/format';

export type LoginState = { error?: string };

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  if (!verifyCredentials(email, password)) {
    return { error: 'That email and password do not match an account.' };
  }
  await createSession(email.trim().toLowerCase());
  redirect('/admin');
}

export async function signOut() {
  await destroySession();
  redirect('/admin/login');
}

function readProductForm(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  return {
    name,
    slug: slugify(String(formData.get('slug') ?? '') || name),
    categoryId: String(formData.get('categoryId') ?? ''),
    priceMinor: rupeesToMinor(String(formData.get('price') ?? '0')),
    purity: String(formData.get('purity') ?? '22KT'),
    metal: String(formData.get('metal') ?? 'Yellow Gold'),
    weight: String(formData.get('weight') ?? '').trim(),
    stones: String(formData.get('stones') ?? '').trim() || 'None',
    description: String(formData.get('description') ?? '').trim(),
    imageUrl: String(formData.get('imageUrl') ?? '').trim() || null,
    motif: String(formData.get('motif') ?? 'necklace'),
    tone: String(formData.get('tone') ?? 't1'),
    stock: Math.max(0, Number(formData.get('stock') ?? 0) || 0),
    featured: formData.get('featured') === 'on',
    tag: String(formData.get('tag') ?? '').trim() || null,
  };
}

export async function saveProduct(formData: FormData) {
  await requireSession();
  const id = String(formData.get('id') ?? '');
  const data = readProductForm(formData);
  if (!data.name || !data.categoryId) redirect('/admin/products?error=missing');

  if (id) await updateProduct(id, data);
  else await createProduct(data);

  revalidatePath('/admin/products');
  revalidatePath('/collection');
  revalidatePath('/');
  redirect('/admin/products?saved=1');
}

export async function removeProduct(formData: FormData) {
  await requireSession();
  await deleteProduct(String(formData.get('id') ?? ''));
  revalidatePath('/admin/products');
  revalidatePath('/collection');
  redirect('/admin/products?deleted=1');
}

export async function saveCategory(formData: FormData) {
  await requireSession();
  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  if (!name) redirect('/admin/categories?error=missing');

  const data = {
    name,
    slug: slugify(String(formData.get('slug') ?? '') || name),
    blurb: String(formData.get('blurb') ?? '').trim(),
    motif: String(formData.get('motif') ?? 'necklace'),
    position: Number(formData.get('position') ?? 99) || 99,
  };

  if (id) await updateCategory(id, data);
  else await createCategory(data);

  revalidatePath('/admin/categories');
  revalidatePath('/collection');
  revalidatePath('/');
  redirect('/admin/categories?saved=1');
}

export async function removeCategory(formData: FormData) {
  await requireSession();
  await deleteCategory(String(formData.get('id') ?? ''));
  revalidatePath('/admin/categories');
  revalidatePath('/collection');
  redirect('/admin/categories?deleted=1');
}

export async function setOrderStatus(formData: FormData) {
  await requireSession();
  await updateOrderStatus(String(formData.get('id') ?? ''), String(formData.get('status') ?? 'pending'));
  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}
