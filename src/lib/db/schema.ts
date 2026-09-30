import { pgTable, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  blurb: text('blurb').notNull().default(''),
  motif: text('motif').notNull().default('necklace'),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: text('category_id').notNull(),
  /** Stored in paise so money never touches a float. */
  priceMinor: integer('price_minor').notNull(),
  purity: text('purity').notNull().default('22KT'),
  metal: text('metal').notNull().default('Yellow Gold'),
  weight: text('weight').notNull().default(''),
  stones: text('stones').notNull().default('None'),
  description: text('description').notNull().default(''),
  imageUrl: text('image_url'),
  motif: text('motif').notNull().default('necklace'),
  tone: text('tone').notNull().default('t1'),
  stock: integer('stock').notNull().default(0),
  featured: boolean('featured').notNull().default(false),
  tag: text('tag'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type OrderItem = {
  productId: string;
  name: string;
  priceMinor: number;
  quantity: number;
  motif: string;
  tone: string;
  imageUrl: string | null;
};

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  reference: text('reference').notNull().unique(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull().default(''),
  address: text('address').notNull().default(''),
  city: text('city').notNull().default(''),
  pincode: text('pincode').notNull().default(''),
  items: jsonb('items').$type<OrderItem[]>().notNull(),
  totalMinor: integer('total_minor').notNull(),
  status: text('status').notNull().default('pending'),
  paymentMethod: text('payment_method').notNull().default('UPI'),
  paymentReference: text('payment_reference').notNull().default(''),
  receiptUrl: text('receipt_url'),
  receiptName: text('receipt_name').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
