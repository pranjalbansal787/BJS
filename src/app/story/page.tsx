import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { listProducts } from '@/lib/repo';
import Link from 'next/link';

export const metadata = { title: 'Our story' };

export default async function StoryPage() {
  const all = await listProducts();
  return (
    <>
      <SiteHeader active="/story" />
      <section className="band dark" style={{ paddingBlock: 96 }}>
        <div className="wrap">
          <div style={{ maxWidth: '60ch' }}>
            <span className="lbl" style={{ color: 'var(--brass-l)', display: 'block', marginBottom: 20 }}>Our story</span>
            <h2 style={{ fontSize: 'clamp(30px,4.6vw,50px)', lineHeight: 1.06, color: '#F6EEE2' }}>
              Three generations, one <em style={{ fontStyle: 'italic', color: 'var(--brass-l)' }}>address</em>.
            </h2>
            <p style={{ color: '#A29586', marginTop: 24, fontSize: 16 }}>
              Bharat Jewellers opened in Sector 14 in 1974 with two karigars and a single showcase.
              The workshop is still on the first floor, above the shop, and most of what you see
              downstairs was made twenty feet from where you are standing.
            </p>
            <p style={{ color: '#A29586', marginTop: 16, fontSize: 16 }}>
              We stayed small on purpose. It means the person who takes your order is usually the
              person who will weigh the piece, and the family that bought a wedding set from us in
              1991 brings their daughter in now.
            </p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="pillars">
            <article>
              <span className="num">I</span>
              <h3>The workshop upstairs</h3>
              <p>Eleven karigars, most of whom have been with us for over a decade. Polki setting, enamel and filigree are all done in house.</p>
            </article>
            <article>
              <span className="num">II</span>
              <h3>Bought back, always</h3>
              <p>Anything bought here can be exchanged or sold back against the day&rsquo;s rate, with the original invoice, for as long as we are open.</p>
            </article>
            <article>
              <span className="num">III</span>
              <h3>Open six days</h3>
              <p>Sector 14 Market, Gurugram. Eleven to eight, closed on Tuesday. Walk in, or call ahead for the bridal room.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="band sand">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">From the showcase</span>
              <h2>A few of our own favourites</h2>
            </div>
            <Link className="link" href="/collection">View collection</Link>
          </div>
          <div className="grid g4">
            {all.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
