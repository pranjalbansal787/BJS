import Link from 'next/link';
import { listCategories } from '@/lib/repo';

export async function SiteFooter() {
  const categories = await listCategories();
  const phone = process.env.NEXT_PUBLIC_SHOP_PHONE || '+91 98765 43210';
  return (
    <footer className="site">
      <div className="wrap">
        <div className="fgrid2">
          <div>
            <div className="bnm">Jewellery Palace BJS</div>
            <p className="desc">
              Goldsmiths in Gurugram since 1974. Hallmarked gold, weights on the invoice, and a
              counter you can walk into.
            </p>
            <p className="desc" style={{ marginTop: 16 }}>
              Sector 14 Market, Gurugram 122001
              <br />
              {phone}
              <br />
              11am to 8pm, closed Tuesday
            </p>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link href={`/collection?category=${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5>The shop</h5>
            <ul>
              <li><Link href="/story">Our story</Link></li>
              <li><Link href="/bridal">Bridal room</Link></li>
              <li><Link href="/collection">Full collection</Link></li>
              <li><Link href="/cart">Your cart</Link></li>
            </ul>
          </div>
          <div>
            <h5>Policies</h5>
            <ul>
              <li><Link href="/policies">No return, no exchange</Link></li>
              <li><Link href="/policies">Hallmark &amp; HUID</Link></li>
              <li><Link href="/policies">Buy-back terms</Link></li>
              <li><Link href="/admin">Shop login</Link></li>
            </ul>
          </div>
        </div>
        <div className="copy">
          <span>© {new Date().getFullYear()} Jewellery Palace BJS</span>
          <span>Built by NuForge Labs</span>
        </div>
      </div>
    </footer>
  );
}
