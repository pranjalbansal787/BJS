import Link from 'next/link';
import { saveProduct } from '@/actions/admin';
import { minorToRupees } from '@/lib/format';
import type { Category, Product } from '@/lib/repo';

const MOTIFS = ['necklace', 'bangle', 'earring', 'ring', 'pendant', 'set'];
const TONES: [string, string][] = [['t1', 'Champagne'], ['t2', 'Blush'], ['t3', 'Stone']];

export function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const isNew = !product;
  return (
    <form className="adminform" action={saveProduct}>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <h3>{isNew ? 'Add a piece' : 'Edit piece'}</h3>
      <p className="sub">Saved changes appear on the storefront immediately.</p>

      <div className="fgrid">
        <div className="field full">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" defaultValue={product?.name ?? ''} placeholder="Kundan Rani Haar" required />
        </div>

        <div className="field">
          <label htmlFor="categoryId">Category</label>
          <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? categories[0]?.id ?? ''}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="price">Price (₹)</label>
          <input id="price" name="price" type="number" min={0} step={100}
            defaultValue={product ? minorToRupees(product.priceMinor) : 100000} required />
        </div>

        <div className="field">
          <label htmlFor="purity">Purity</label>
          <select id="purity" name="purity" defaultValue={product?.purity ?? '22KT'}>
            <option>22KT</option><option>18KT</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="metal">Metal</label>
          <select id="metal" name="metal" defaultValue={product?.metal ?? 'Yellow Gold'}>
            <option>Yellow Gold</option><option>Rose Gold</option><option>White Gold</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="weight">Weight</label>
          <input id="weight" name="weight" defaultValue={product?.weight ?? ''} placeholder="12.6 g" />
        </div>

        <div className="field">
          <label htmlFor="stock">Stock</label>
          <input id="stock" name="stock" type="number" min={0} defaultValue={product?.stock ?? 5} />
        </div>

        <div className="field full">
          <label htmlFor="stones">Stones</label>
          <input id="stones" name="stones" defaultValue={product?.stones ?? 'None'} placeholder="Uncut polki 3.2 ct" />
        </div>

        <div className="field full">
          <label htmlFor="imageUrl">Photograph URL (optional)</label>
          <input id="imageUrl" name="imageUrl" defaultValue={product?.imageUrl ?? ''}
            placeholder="https://… — leave blank to use the generated artwork" />
        </div>

        <div className="field">
          <label htmlFor="motif">Placeholder artwork</label>
          <select id="motif" name="motif" defaultValue={product?.motif ?? 'necklace'}>
            {MOTIFS.map((m) => <option key={m} value={m}>{m[0].toUpperCase() + m.slice(1)}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="tone">Backdrop</label>
          <select id="tone" name="tone" defaultValue={product?.tone ?? 't1'}>
            {TONES.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="tag">Badge (optional)</label>
          <input id="tag" name="tag" defaultValue={product?.tag ?? ''} placeholder="Bridal" />
        </div>

        <div className="field">
          <label>Placement</label>
          <div className="checkrow">
            <input id="featured" name="featured" type="checkbox" defaultChecked={product?.featured ?? false} />
            <label htmlFor="featured" style={{ letterSpacing: 0, textTransform: 'none', fontSize: 14, color: 'var(--ink)' }}>
              Show on the home page
            </label>
          </div>
        </div>

        <div className="field full">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={product?.description ?? ''} />
        </div>
      </div>

      <div className="formactions">
        <Link className="btn ghost sm" href="/admin/products">Cancel</Link>
        <button className="btn brass sm" type="submit">{isNew ? 'Add to storefront' : 'Save changes'}</button>
      </div>
    </form>
  );
}
