import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { JewelArt } from '@/components/jewel-art';
import { addToCart } from '@/actions/cart';
import { getProductBySlug, listCategories, listProducts } from '@/lib/repo';
import { formatInr } from '@/lib/format';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Piece not found' };
  return { title: product.name, description: product.description.slice(0, 160) };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, all] = await Promise.all([listCategories(), listProducts()]);
  const category = categories.find((c) => c.id === product.categoryId);
  let related = all.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  if (related.length < 4) related = all.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <SiteHeader active="/collection" />

      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span>—</span>
          {category ? <Link href={`/collection?category=${category.slug}`}>{category.name}</Link> : <span>Collection</span>}
          <span>—</span>
          <span>{product.name}</span>
        </div>

        <div className="pdp">
          <div className="pgal">
            <div className="media">
              <JewelArt motif={product.motif} tone={product.tone} imageUrl={product.imageUrl} alt={product.name} />
            </div>
            <div className="thumbs">
              {[0, 1, 2].map((v) => (
                <span key={v} className="media" style={{ aspectRatio: '1', border: '1px solid var(--line)' }}>
                  <JewelArt motif={product.motif} tone={product.tone} variant={v} imageUrl={product.imageUrl} alt={product.name} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="lbl">{category?.name ?? 'Collection'}</span>
            <h1>{product.name}</h1>
            <div className="price tnum">
              {formatInr(product.priceMinor)}
              <small>Inclusive of taxes</small>
            </div>
            <p className="desc">{product.description}</p>

            <dl className="specs">
              <div><dt>Purity</dt><dd>{product.purity} · BIS 916</dd></div>
              <div><dt>Metal</dt><dd>{product.metal}</dd></div>
              <div><dt>Weight</dt><dd>{product.weight || '—'}</dd></div>
              <div><dt>Stones</dt><dd>{product.stones}</dd></div>
              <div>
                <dt>Availability</dt>
                <dd>{product.stock > 0 ? `In stock, ${product.stock} piece${product.stock > 1 ? 's' : ''}` : 'Made to order'}</dd>
              </div>
              <div><dt>Certification</dt><dd>Hallmark &amp; HUID</dd></div>
            </dl>

            <form action={addToCart} className="buyrow">
              <input type="hidden" name="productId" value={product.id} />
              <input type="hidden" name="quantity" value="1" />
              <button className="btn brass" type="submit" style={{ flex: 1, minWidth: 200 }}>
                Add to cart
              </button>
              <Link className="btn ghost" href="/collection" style={{ flex: 1, minWidth: 160 }}>
                Keep browsing
              </Link>
            </form>

            <div className="trustrow">
              <div>
                <svg viewBox="0 0 24 24"><path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" /><path d="m9 12 2 2 4-4" /></svg>
                Hallmarked
              </div>
              <div>
                <svg viewBox="0 0 24 24"><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
                Insured delivery
              </div>
              <div>
                <svg viewBox="0 0 24 24"><path d="M6 4h12l3 5-9 11L3 9l3-5z" /><path d="M3 9h18M9 4 6 9l6 11 6-11-3-5" /></svg>
                Lifetime polish
              </div>
            </div>

            <div className="acc">
              <details open>
                <summary>Delivery &amp; insurance</summary>
                <div className="body">
                  Dispatched within two working days of payment confirmation, by insured courier with
                  signature on delivery. Delivery across India is free above {formatInr(5000000)}, and the
                  tracking number reaches you on WhatsApp.
                </div>
              </details>
              <details>
                <summary>Returns &amp; exchange</summary>
                <div className="body">
                  <p>Sold on a no return, no exchange basis, as is standard for hallmarked and made-to-order jewellery.</p>
                  <ul>
                    <li>Manufacturing defects are repaired or replaced within seven days.</li>
                    <li>Buy-back against the day&rsquo;s rate at the showroom, with the original invoice.</li>
                    <li>Resizing of rings and bangles is free for the first year.</li>
                  </ul>
                </div>
              </details>
              <details>
                <summary>Certification</summary>
                <div className="body">
                  Every piece carries the BIS 916 hallmark, the assaying centre mark and a unique HUID.
                  Diamond pieces travel with an IGI certificate, and the invoice records gross weight,
                  net weight and stone weight separately.
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section className="band sand">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">You may also like</span>
              <h2>More from {category?.name ?? 'the showcase'}</h2>
            </div>
          </div>
          <div className="grid g4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
