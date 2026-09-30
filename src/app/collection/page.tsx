import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { listCategories, listProducts } from '@/lib/repo';
import { formatInr } from '@/lib/format';
import type { ProductFilters } from '@/lib/repo';

export const metadata = { title: 'Collection' };

const METALS = ['Yellow Gold', 'Rose Gold', 'White Gold'];
const PURITIES = ['22KT', '18KT'];
const PRICE_CEILING = 900000;

type SearchParams = Record<string, string | string[] | undefined>;

function asList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

/** Rebuilds the querystring with one value toggled on or off. */
function toggleHref(params: SearchParams, key: string, value: string): string {
  const current = asList(params[key]);
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === key) continue;
    for (const item of asList(v)) qs.append(k, item);
  }
  for (const item of next) qs.append(key, item);
  const s = qs.toString();
  return s ? `/collection?${s}` : '/collection';
}

function withoutHref(params: SearchParams, key: string, value?: string): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    for (const item of asList(v)) {
      if (k === key && (value === undefined || item === value)) continue;
      qs.append(k, item);
    }
  }
  const s = qs.toString();
  return s ? `/collection?${s}` : '/collection';
}

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const categorySlugs = asList(params.category);
  const metals = asList(params.metal);
  const purities = asList(params.purity);
  const q = typeof params.q === 'string' ? params.q : '';
  const sortParam = typeof params.sort === 'string' ? params.sort : 'featured';
  const sort = (['featured', 'low', 'high', 'name'] as const).includes(sortParam as never)
    ? (sortParam as ProductFilters['sort'])
    : 'featured';
  const maxPrice = Number(params.max) || PRICE_CEILING;

  const filters: ProductFilters = {
    categorySlugs: categorySlugs.length ? categorySlugs : undefined,
    metals: metals.length ? metals : undefined,
    purities: purities.length ? purities : undefined,
    maxPriceMinor: maxPrice < PRICE_CEILING ? maxPrice * 100 : undefined,
    q: q || undefined,
    sort,
  };

  const [categories, results, everything] = await Promise.all([
    listCategories(),
    listProducts(filters),
    listProducts(),
  ]);

  const countFor = (predicate: (p: (typeof everything)[number]) => boolean) =>
    everything.filter(predicate).length;

  const chips: { label: string; href: string }[] = [
    ...categorySlugs.map((slug) => ({
      label: categories.find((c) => c.slug === slug)?.name ?? slug,
      href: toggleHref(params, 'category', slug),
    })),
    ...metals.map((m) => ({ label: m, href: toggleHref(params, 'metal', m) })),
    ...purities.map((p) => ({ label: p, href: toggleHref(params, 'purity', p) })),
  ];
  if (q) chips.push({ label: `“${q}”`, href: withoutHref(params, 'q') });
  if (maxPrice < PRICE_CEILING) {
    chips.push({ label: `Under ${formatInr(maxPrice * 100)}`, href: withoutHref(params, 'max') });
  }

  return (
    <>
      <SiteHeader active="/collection" />

      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span>—</span>
          <span>Collection</span>
        </div>
      </div>

      <section className="band tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">The collection</span>
              <h2>Every piece in the showcase</h2>
            </div>
          </div>

          <div className="catwrap">
            <aside className="filters">
              <form method="get" action="/collection">
                {metals.map((m) => <input key={m} type="hidden" name="metal" value={m} />)}
                {purities.map((p) => <input key={p} type="hidden" name="purity" value={p} />)}
                {categorySlugs.map((c) => <input key={c} type="hidden" name="category" value={c} />)}
                <div className="fgroup">
                  <h4>Search</h4>
                  <input type="search" name="q" defaultValue={q} placeholder="Jhumka, polki, kada" />
                </div>
                <div className="fgroup">
                  <h4>Budget</h4>
                  <input type="range" name="max" min={50000} max={PRICE_CEILING} step={10000} defaultValue={maxPrice} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--faint)' }} className="tnum">
                    <span>{formatInr(5000000)}</span>
                    <span>{maxPrice >= PRICE_CEILING ? 'No limit' : `Up to ${formatInr(maxPrice * 100)}`}</span>
                  </div>
                  <button className="btn ghost sm" type="submit" style={{ marginTop: 14, width: '100%' }}>
                    Apply
                  </button>
                </div>
              </form>

              <div className="fgroup">
                <h4>Category</h4>
                {categories.map((c) => (
                  <Link key={c.id} className="flabel" href={toggleHref(params, 'category', c.slug)}>
                    <label>
                      <input type="checkbox" readOnly checked={categorySlugs.includes(c.slug)} />
                      {c.name}
                      <span className="ct">{countFor((p) => p.categoryId === c.id)}</span>
                    </label>
                  </Link>
                ))}
              </div>

              <div className="fgroup">
                <h4>Metal</h4>
                {METALS.map((m) => (
                  <Link key={m} className="flabel" href={toggleHref(params, 'metal', m)}>
                    <label>
                      <input type="checkbox" readOnly checked={metals.includes(m)} />
                      {m}
                      <span className="ct">{countFor((p) => p.metal === m)}</span>
                    </label>
                  </Link>
                ))}
              </div>

              <div className="fgroup">
                <h4>Purity</h4>
                {PURITIES.map((k) => (
                  <Link key={k} className="flabel" href={toggleHref(params, 'purity', k)}>
                    <label>
                      <input type="checkbox" readOnly checked={purities.includes(k)} />
                      {k}
                      <span className="ct">{countFor((p) => p.purity === k)}</span>
                    </label>
                  </Link>
                ))}
              </div>
            </aside>

            <div>
              <div className="catbar">
                <span className="ct">
                  {results.length} of {everything.length} pieces
                </span>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    ['featured', 'Most asked for'],
                    ['low', 'Price, low to high'],
                    ['high', 'Price, high to low'],
                    ['name', 'Alphabetical'],
                  ].map(([value, label]) => (
                    <Link
                      key={value}
                      className="chip"
                      href={(() => {
                        const qs = new URLSearchParams();
                        for (const [k, v] of Object.entries(params)) {
                          if (k === 'sort') continue;
                          for (const item of asList(v)) qs.append(k, item);
                        }
                        if (value !== 'featured') qs.append('sort', value);
                        const s = qs.toString();
                        return s ? `/collection?${s}` : '/collection';
                      })()}
                      style={sort === value ? { borderColor: 'var(--brass)', color: 'var(--brass-d)' } : undefined}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {chips.length > 0 ? (
                <div className="chips">
                  {chips.map((chip) => (
                    <Link key={chip.label} className="chip" href={chip.href}>
                      {chip.label} ×
                    </Link>
                  ))}
                  <Link className="chip" href="/collection" style={{ borderColor: 'var(--brass)', color: 'var(--brass-d)' }}>
                    Clear all
                  </Link>
                </div>
              ) : null}

              {results.length > 0 ? (
                <div className="grid g3">
                  {results.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="empty">
                  <h3>Nothing matches those filters</h3>
                  <p>Try widening the budget or clearing a category.</p>
                  <Link className="btn ghost sm" href="/collection">Clear filters</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
