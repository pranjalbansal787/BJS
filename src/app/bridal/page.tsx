import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { JewelArt } from '@/components/jewel-art';
import { getCategoryBySlug, listProducts } from '@/lib/repo';

export const metadata = { title: 'Bridal' };

export default async function BridalPage() {
  const category = await getCategoryBySlug('bridal-sets');
  const all = await listProducts();
  const sets = category ? all.filter((p) => p.categoryId === category.id) : all.slice(0, 3);

  return (
    <>
      <SiteHeader active="/bridal" />
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="lbl">Wedding season 2026</span>
            <h1>The bridal <em>trousseau</em>, planned with you.</h1>
            <p className="lede">
              Book a private appointment at the showroom and we will lay out the full set, match it
              to the outfit, and hold it until the date.
            </p>
            <div className="cta">
              <Link className="btn brass" href="/collection?category=bridal-sets">See bridal sets</Link>
              <Link className="btn onDark" href="/story">About the shop</Link>
            </div>
            <div className="assure">
              <div><b>3 weeks</b><span>Typical making time</span></div>
              <div><b>Private</b><span>Upstairs viewing room</span></div>
              <div><b>Altered</b><span>Length &amp; fit included</span></div>
            </div>
          </div>
          <div className="heroart">
            <div className="media"><JewelArt motif="set" tone="dark" variant={1} /></div>
            <div className="plate"><b>By appointment</b><span>Tuesday closed</span></div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">Bridal sets</span>
              <h2>Ready to wear, ready to alter</h2>
              <p>Each set can be altered in length, and the centre motif detached for lighter wear afterwards.</p>
            </div>
          </div>
          <div className="grid g3">
            {sets.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
