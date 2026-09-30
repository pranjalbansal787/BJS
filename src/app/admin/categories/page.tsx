import { JewelArt } from '@/components/jewel-art';
import { removeCategory, saveCategory } from '@/actions/admin';
import { listCategories, listProducts } from '@/lib/repo';

export const metadata = { title: 'Categories' };
export const dynamic = 'force-dynamic';

const MOTIFS = ['necklace', 'bangle', 'earring', 'ring', 'pendant', 'set'];

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([listCategories(), listProducts()]);

  return (
    <div className="wrap" style={{ paddingBlock: '34px 70px' }}>
      <div style={{ marginBottom: 30 }}>
        <span className="lbl" style={{ color: 'var(--brass-d)' }}>Structure</span>
        <h2 style={{ fontSize: 32, marginTop: 12 }}>Categories</h2>
        <p style={{ color: 'var(--soft)', marginTop: 6 }}>
          Rename, add or remove categories yourself. They appear on the storefront the moment you save.
        </p>
      </div>

      {params.saved ? <div className="flash ok">Category saved.</div> : null}
      {params.deleted ? <div className="flash ok">Category removed.</div> : null}
      {params.error ? <div className="flash">A category needs a name.</div> : null}

      <div className="abox">
        <header>
          <div><h3>All categories</h3><p>{categories.length} live</p></div>
        </header>
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>Category</th><th>Description</th><th>Pieces</th><th /></tr>
            </thead>
            <tbody>
              {categories.map((c) => {
                const count = products.filter((p) => p.categoryId === c.id).length;
                return (
                  <tr key={c.id}>
                    <td>
                      <form action={saveCategory} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="position" value={c.position} />
                        <span className="thumb"><JewelArt motif={c.motif} tone="t1" alt={c.name} /></span>
                        <span style={{ minWidth: 150 }}>
                          <input name="name" defaultValue={c.name}
                            style={{ border: 0, borderBottom: '1px solid var(--line)', background: 'none', padding: '6px 0', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 15.5, width: '100%' }} />
                          <small style={{ color: 'var(--faint)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' }}>/{c.slug}</small>
                        </span>
                        <select name="motif" className="status" defaultValue={c.motif}>
                          {MOTIFS.map((m) => <option key={m} value={m}>{m[0].toUpperCase() + m.slice(1)}</option>)}
                        </select>
                        <input name="blurb" defaultValue={c.blurb} placeholder="Shown on the storefront"
                          style={{ border: 0, borderBottom: '1px solid var(--line)', background: 'none', padding: '6px 0', fontSize: 13, minWidth: 220 }} />
                        <button className="tbtn" type="submit">Save</button>
                      </form>
                    </td>
                    <td style={{ color: 'var(--soft)', maxWidth: 260 }}>{c.blurb}</td>
                    <td className="tnum">{count}</td>
                    <td>
                      <div className="rowacts">
                        <form action={removeCategory} className="inline">
                          <input type="hidden" name="id" value={c.id} />
                          <button className="tbtn danger" type="submit">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <form className="adminform" action={saveCategory} style={{ maxWidth: 640 }}>
        <h3>Add a category</h3>
        <p className="sub">It shows up in the storefront filters and the footer straight away.</p>
        <div className="fgrid">
          <div className="field full">
            <label htmlFor="new-name">Name</label>
            <input id="new-name" name="name" placeholder="Anklets" required />
          </div>
          <div className="field full">
            <label htmlFor="new-blurb">Short description</label>
            <input id="new-blurb" name="blurb" placeholder="Shown under the category on the storefront" />
          </div>
          <div className="field">
            <label htmlFor="new-motif">Icon</label>
            <select id="new-motif" name="motif" defaultValue="necklace">
              {MOTIFS.map((m) => <option key={m} value={m}>{m[0].toUpperCase() + m.slice(1)}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="new-position">Order</label>
            <input id="new-position" name="position" type="number" defaultValue={categories.length + 1} />
          </div>
        </div>
        <div className="formactions">
          <button className="btn brass sm" type="submit">Add category</button>
        </div>
      </form>
    </div>
  );
}
