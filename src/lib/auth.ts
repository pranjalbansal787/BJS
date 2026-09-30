import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE = 'bjs_admin';
const SECRET = process.env.ADMIN_SESSION_SECRET || 'bjs-development-secret-change-me';
const MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = { email: string; issuedAt: number };

function b64url(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL || 'owner@jewellerypalacebjs.com';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'demo1234';
  return (
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
    safeEqual(password, expectedPassword)
  );
}

export async function createSession(email: string): Promise<void> {
  // The payload is base64url so it can never contain the separator; an email
  // full of dots was exactly what broke the naive version of this.
  const payload = b64url(JSON.stringify({ email, issuedAt: Date.now() } satisfies SessionPayload));
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;

  const separator = raw.lastIndexOf('.');
  if (separator <= 0) return null;

  const payload = raw.slice(0, separator);
  const signature = raw.slice(separator + 1);
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof decoded.email !== 'string' || typeof decoded.issuedAt !== 'number') return null;
    if (Date.now() - decoded.issuedAt > MAX_AGE_SECONDS * 1000) return null;
    return { email: decoded.email };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<{ email: string }> {
  const session = await getSession();
  if (!session) throw new Error('Your session has expired. Sign in again to continue.');
  return session;
}
