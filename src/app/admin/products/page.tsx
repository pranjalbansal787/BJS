import Link from 'next/link';
import { JewelArt } from '@/components/jewel-art';
import { removeProduct } from '@/actions/admin';
import { listCategories, listProducts } from '@/lib/repo';
import { formatInr } from '@/lib/format';

export const metadata = { title: 'Products' };
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? 'Uncategorised';

  return (
    <div className="wrap" style={{ paddingBlock: '34px 70px' }}>
      <div style={{ marginBottom: 30 }}>
        <span className="lbl" style={{ color: 'var(--brass-d)' }}>Catalogue</span>
        <h2 style={{ fontSize: 32, marginTop: 12 }}>Products</h2>
        <p style={{ color: 'var(--soft)', marginTop: 6 }}>
          Add a piece here and it appears on the storefront straight away.
        </p>
      </div>

      {params.saved ? <div className="flash ok">Saved. The storefront is updated.</div> : null}
      {params.deleted ? <div className="flash ok">Removed from the storefront.</div> : null}
      {params.error ? <div className="flash">A name and category are required.</div> : null}

      <div className="abox">
        <header>
          <div><h3>All pieces</h3><p>{products.length} live on the storefront</p></div>
          <Link className="btn brass sm" href="/admin/products/new">Add a piece</Link>
        </header>
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>Piece</th><th>Category</th><th>Purity</th><th>Weight</th><th>Price</th><th>Stock</th><th /></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="cellnm">
                      <span className="thumb"><JewelArt motif={p.motif} tone={p.tone} imageUrl={p.imageUrl} alt={p.name} /></span>
                      <span><b>{p.name}</b><small>{p.metal}</small></span>
                    </div>
                  </td>
                  <td>{categoryName(p.categoryId)}</td>
                  <td>{p.purity}</td>
                  <td>{p.weight || '—'}</td>
                  <td className="tnum"><b style={{ fontWeight: 600 }}>{formatInr(p.priceMinor)}</b></td>
                  <td>
                    <span className={`pill ${p.stock === 0 ? 'p-off' : p.stock <= 3 ? 'p-low' : 'p-live'}`}>
                      {p.stock === 0 ? 'Sold out' : `${p.stock} in stock`}
                    </span>
                  </td>
                  <td>
                    <div className="rowacts">
                      <Link className="tbtn" href={`/admin/products/${p.id}`}>Edit</Link>
                      <form action={removeProduct} className="inline">
                        <input type="hidden" name="id" value={p.id} />
                        <button className="tbtn danger" type="submit">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
