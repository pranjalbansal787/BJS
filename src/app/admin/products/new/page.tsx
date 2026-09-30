import Link from 'next/link';
import { ProductForm } from '@/components/product-form';
import { listCategories } from '@/lib/repo';

export const metadata = { title: 'Add a piece' };

export default async function NewProductPage() {
  const categories = await listCategories();
  return (
    <div className="wrap" style={{ paddingBlock: '34px 70px', maxWidth: 860 }}>
      <div className="crumb">
        <Link href="/admin/products">Products</Link><span>—</span><span>New</span>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
