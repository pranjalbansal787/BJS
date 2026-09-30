import Link from 'next/link';
import { JewelArt } from '@/components/jewel-art';
import { getDashboard, statusMeta } from '@/lib/repo';
import { formatInr, formatDate } from '@/lib/format';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const d = await getDashboard();

  return (
    <div className="wrap" style={{ paddingBlock: '34px 70px' }}>
      <div style={{ marginBottom: 30 }}>
        <span className="lbl" style={{ color: 'var(--brass-d)' }}>Today</span>
        <h2 style={{ fontSize: 32, marginTop: 12 }}>Good morning, Rakesh.</h2>
        <p style={{ color: 'var(--soft)', marginTop: 6 }}>
          {d.pendingCount > 0
            ? `${d.pendingCount} payment${d.pendingCount > 1 ? 's' : ''} waiting for your confirmation.`
            : 'Every payment is verified. Nothing waiting.'}
        </p>
      </div>

      <div className="stats">
        <div className="stat"><div className="k">Orders</div><div className="v tnum">{d.orderCount}</div><div className="d">All time</div></div>
        <div className={d.pendingCount > 0 ? 'stat alert' : 'stat'}>
          <div className="k">Awaiting check</div><div className="v tnum">{d.pendingCount}</div><div className="d">Receipts to verify</div>
        </div>
        <div className="stat"><div className="k">Pieces live</div><div className="v tnum">{d.productCount}</div><div className="d">Across {d.categoryCount} categories</div></div>
        <div className="stat">
          <div className="k">Showcase value</div>
          <div className="v tnum" style={{ fontSize: 26 }}>{formatInr(d.stockValueMinor)}</div>
          <div className="d">Stock on hand</div>
        </div>
      </div>

      <div className="abox">
        <header>
          <div><h3>Recent orders</h3><p>Newest first</p></div>
          <Link className="tbtn" href="/admin/orders">Open orders</Link>
        </header>
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th /></tr>
            </thead>
            <tbody>
              {d.recentOrders.map((o) => (
                <tr key={o.id}>
                  <td><b style={{ fontWeight: 600, letterSpacing: '.06em' }}>{o.reference}</b><br /><small style={{ color: 'var(--faint)' }}>{formatDate(o.createdAt)}</small></td>
                  <td>{o.customerName}<br /><small style={{ color: 'var(--faint)' }}>{o.city}</small></td>
                  <td className="tnum">{o.items.length}</td>
                  <td className="tnum">{formatInr(o.totalMinor)}</td>
                  <td><span className={`pill p-${statusMeta(o.status).tone}`}>{statusMeta(o.status).label}</span></td>
                  <td><div className="rowacts"><Link className="tbtn" href="/admin/orders">Open</Link></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="abox">
        <header><div><h3>Running low</h3><p>Three pieces or fewer</p></div></header>
        <div className="tablewrap">
          <table>
            <thead><tr><th>Piece</th><th>In stock</th><th>Price</th><th /></tr></thead>
            <tbody>
              {d.lowStock.length > 0 ? d.lowStock.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="cellnm">
                      <span className="thumb"><JewelArt motif={p.motif} tone={p.tone} imageUrl={p.imageUrl} alt={p.name} /></span>
                      <span><b>{p.name}</b><small>{p.purity} · {p.weight}</small></span>
                    </div>
                  </td>
                  <td><span className="pill p-low">{p.stock} left</span></td>
                  <td className="tnum">{formatInr(p.priceMinor)}</td>
                  <td><div className="rowacts"><Link className="tbtn" href={`/admin/products/${p.id}`}>Edit</Link></div></td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ color: 'var(--faint)' }}>Everything is well stocked.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
