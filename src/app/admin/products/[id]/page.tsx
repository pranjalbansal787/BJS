import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/product-form';
import { getProductById, listCategories } from '@/lib/repo';

export const metadata = { title: 'Edit piece' };
export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), listCategories()]);
  if (!product) notFound();

  return (
    <div className="wrap" style={{ paddingBlock: '34px 70px', maxWidth: 860 }}>
      <div className="crumb">
        <Link href="/admin/products">Products</Link><span>—</span><span>{product.name}</span>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
