import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { signOut } from '@/actions/admin';
import { usingPostgres } from '@/lib/db';
import './admin.css';

const TABS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="adminbody">
      <div className="stack">
        <header className="admin">
          <div className="wrap">
            <Link className="lg" href="/admin">
              <span className="seal">B</span>
              <span className="ttl">
                Jewellery Palace BJS
                <span>Super admin</span>
              </span>
            </Link>
            {session ? (
              <nav className="atabs">
                {TABS.map((tab) => (
                  <Link key={tab.href} href={tab.href}>{tab.label}</Link>
                ))}
              </nav>
            ) : null}
            <span className="sp" />
            {session ? (
              <div className="who">
                <span className="av">RB</span>
                <span>{session.email}</span>
                <form action={signOut} className="inline">
                  <button className="tbtn" type="submit" style={{ marginLeft: 10, borderColor: '#3B3229', background: 'none', color: '#9A8D7E' }}>
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link className="tbtn" href="/" style={{ borderColor: '#3B3229', background: 'none', color: '#9A8D7E' }}>
                Back to storefront
              </Link>
            )}
          </div>
        </header>
      </div>

      <div className="adminwrap">
        {session && !usingPostgres ? (
          <div className="wrap" style={{ paddingTop: 24 }}>
            <div className="envnote">
              <span>
                Running on the built-in store. Add <code>DATABASE_URL</code> to <code>.env.local</code>,
                then <code>npm run db:push &amp;&amp; npm run db:seed</code>, and every change here writes
                to Postgres instead. Nothing else in the code changes.
              </span>
            </div>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
