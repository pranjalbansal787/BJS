import Link from 'next/link';
import { JewelArt } from './jewel-art';
import { formatInr } from '@/lib/format';
import type { Product } from '@/lib/repo';

export function ProductCard({ product }: { product: Product }) {
  const tag =
    product.stock === 0
      ? { label: 'Sold out', rose: true }
      : product.stock <= 2
        ? { label: `Last ${product.stock}`, rose: false }
        : product.tag
          ? { label: product.tag, rose: false }
          : null;

  return (
    <Link className="pcard" href={`/product/${product.slug}`}>
      <span className="media">
        <JewelArt motif={product.motif} tone={product.tone} imageUrl={product.imageUrl} alt={product.name} />
        {tag ? <span className={tag.rose ? 'tag rose' : 'tag'}>{tag.label}</span> : null}
      </span>
      <span className="nm">{product.name}</span>
      <span className="meta">
        {product.purity} · {product.metal}
        {product.weight ? ` · ${product.weight}` : ''}
      </span>
      <span className="pr tnum">{formatInr(product.priceMinor)}</span>
    </Link>
  );
}
