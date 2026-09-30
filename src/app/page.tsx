import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product-card';
import { JewelArt } from '@/components/jewel-art';
import { listCategories, listProducts } from '@/lib/repo';

export default async function HomePage() {
  const [categories, all] = await Promise.all([listCategories(), listProducts()]);
  const featured = all.filter((p) => p.featured).slice(0, 4);
  const shelf = featured.length === 4 ? featured : all.slice(0, 4);
  const newest = [...all].reverse().slice(0, 4);

  return (
    <>
      <SiteHeader active="/" />

      <section className="hero">
        <div className="wrap">
          <div>
            <span className="lbl">Goldsmiths in Gurugram since 1974</span>
            <h1>
              Buy jewellery the way you would <em>in person</em>.
            </h1>
            <p className="lede">
              Fifty-two years of goldsmithing, now online. Hallmarked pieces, weights on the
              invoice, and a person at the other end of every order.
            </p>
            <div className="cta">
              <Link className="btn brass" href="/collection">Browse the collection</Link>
              <Link className="btn onDark" href="/bridal">Bridal sets</Link>
            </div>
            <div className="assure">
              <div><b>916</b><span>BIS hallmarked</span></div>
              <div><b>52</b><span>Years at one address</span></div>
              <div><b>Insured</b><span>Doorstep delivery</span></div>
              <div><b>Lifetime</b><span>Free polish &amp; fit</span></div>
            </div>
          </div>
          <div className="heroart">
            <div className="media">
              <JewelArt motif="necklace" tone="dark" />
            </div>
            <div className="plate">
              <b>Rajwada</b>
              <span>Polki necklace</span>
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">Shop by category</span>
              <h2>Where would you like to start?</h2>
            </div>
            <Link className="link" href="/collection">All {all.length} pieces</Link>
          </div>
          <div className="cats">
            {categories.slice(0, 3).map((c) => {
              const count = all.filter((p) => p.categoryId === c.id).length;
              return (
                <Link className="ccard" key={c.id} href={`/collection?category=${c.slug}`}>
                  <span className="media"><JewelArt motif={c.motif} tone="t1" alt={c.name} /></span>
                  <span className="cap">
                    <b>{c.name}</b>
                    <span>{count} pieces</span>
                  </span>
                  <p>{c.blurb}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="band sand">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">Most asked for</span>
              <h2>This season at the counter</h2>
              <p>The pieces customers come back for, and the ones we are asked to make again and again.</p>
            </div>
          </div>
          <div className="grid g4">
            {shelf.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="band dark">
        <div className="wrap">
          <div className="split">
            <div className="art">
              <span className="media"><JewelArt motif="set" tone="dark" variant={1} /></span>
            </div>
            <div className="txt">
              <span className="lbl">The bridal room</span>
              <h3>Book the showroom for an afternoon.</h3>
              <p>
                We close the upstairs room, lay the full trousseau out against the outfit, and hold
                whatever you choose until the wedding date. Most families come back three or four
                times before deciding.
              </p>
              <Link className="btn onDark" href="/bridal">See bridal sets</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">How we work</span>
              <h2>Nothing hidden in the price</h2>
            </div>
          </div>
          <div className="pillars">
            <article>
              <span className="num">I</span>
              <h3>Weighed and hallmarked</h3>
              <p>Gross and net weight printed on the invoice, the BIS 916 hallmark and a unique HUID stamped on every piece. You can check it on the BIS app before you pay.</p>
            </article>
            <article>
              <span className="num">II</span>
              <h3>One price, explained</h3>
              <p>Making charges are quoted before the piece is made, not discovered at the till. What is on the tag is what you pay.</p>
            </article>
            <article>
              <span className="num">III</span>
              <h3>Pay directly</h3>
              <p>Pay by UPI or bank transfer to the shop account. No gateway sits in between, so nothing is deducted from what you send.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="band sand">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">Recently added</span>
              <h2>New in the showcase</h2>
            </div>
            <Link className="link" href="/collection">View collection</Link>
          </div>
          <div className="grid g4">
            {newest.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
