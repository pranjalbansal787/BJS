import { setOrderStatus } from '@/actions/admin';
import { listOrders, ORDER_STATUSES, statusMeta } from '@/lib/repo';
import { formatInr, formatDate } from '@/lib/format';

export const metadata = { title: 'Orders' };
export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  const pending = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="wrap" style={{ paddingBlock: '34px 70px' }}>
      <div style={{ marginBottom: 30 }}>
        <span className="lbl" style={{ color: 'var(--brass-d)' }}>Orders</span>
        <h2 style={{ fontSize: 32, marginTop: 12 }}>Every order in one place</h2>
        <p style={{ color: 'var(--soft)', marginTop: 6 }}>
          Open the receipt, match it against the bank statement, then move the order along.
        </p>
      </div>

      <div className="abox">
        <header>
          <div><h3>All orders</h3><p>{orders.length} total, {pending} awaiting check</p></div>
        </header>
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Receipt</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <b style={{ fontWeight: 600, letterSpacing: '.06em' }}>{o.reference}</b>
                    <br />
                    <small style={{ color: 'var(--faint)' }}>{formatDate(o.createdAt)}</small>
                  </td>
                  <td>
                    {o.customerName}
                    <br />
                    <small style={{ color: 'var(--faint)' }}>{o.phone} · {o.city}</small>
                  </td>
                  <td>
                    {o.items.map((item) => (
                      <div key={item.productId}>{item.name} ×{item.quantity}</div>
                    ))}
                  </td>
                  <td className="tnum">
                    {formatInr(o.totalMinor)}
                    <br />
                    <small style={{ color: 'var(--faint)' }}>{o.paymentMethod}</small>
                  </td>
                  <td>
                    {o.receiptUrl ? (
                      <a className="tbtn receiptlink" href={o.receiptUrl} target="_blank" rel="noreferrer">
                        View receipt
                      </a>
                    ) : (
                      <span style={{ color: 'var(--faint)', fontSize: 12 }}>
                        {o.receiptName || 'Not attached'}
                      </span>
                    )}
                    {o.paymentReference ? (
                      <div style={{ fontSize: 11, color: 'var(--faint)', marginTop: 5 }}>{o.paymentReference}</div>
                    ) : null}
                  </td>
                  <td>
                    <form action={setOrderStatus} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input type="hidden" name="id" value={o.id} />
                      <select className="status" name="status" defaultValue={o.status}>
                        {ORDER_STATUSES.map((s) => (
                          <option key={s.key} value={s.key}>{s.label}</option>
                        ))}
                      </select>
                      <button className="tbtn" type="submit">Update</button>
                    </form>
                    <div style={{ marginTop: 8 }}>
                      <span className={`pill p-${statusMeta(o.status).tone}`}>{statusMeta(o.status).label}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
