import Link from 'next/link';
import { getCart } from '@/lib/cart';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/collection', label: 'Collection' },
  { href: '/bridal', label: 'Bridal' },
  { href: '/story', label: 'Our story' },
];

export async function SiteHeader({ active }: { active?: string }) {
  const { count } = await getCart();
  return (
    <div className="stack">
      <header className="store">
        <div className="wrap">
          <Link className="brand" href="/">
            <span className="seal">B</span>
            <span>
              <span className="nm">Jewellery Palace</span>
              <span className="sub">BJS · Est. 1974</span>
            </span>
          </Link>
          <span className="sp" />
          <nav className="main">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} data-on={active === item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hact">
            <Link className="iconbtn" href="/collection" aria-label="Search the collection">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.6-3.6" />
              </svg>
            </Link>
            <Link className="iconbtn" href="/cart" aria-label={`Cart, ${count} items`}>
              <svg viewBox="0 0 24 24">
                <path d="M6 7h12l1 13H5L6 7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {count > 0 ? <span className="cartcount">{count}</span> : null}
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
