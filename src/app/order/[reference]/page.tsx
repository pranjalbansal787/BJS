import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { JewelArt } from '@/components/jewel-art';
import { getOrderByReference } from '@/lib/repo';
import { formatInr, formatDate } from '@/lib/format';

export const metadata = { title: 'Order confirmed' };

export default async function OrderPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const order = await getOrderByReference(reference);
  if (!order) notFound();

  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="conf">
          <div className="seal">
            <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h1>Thank you, {order.customerName.split(' ')[0]}.</h1>
          <p>
            Your receipt is with us. The shop will match it against the account and confirm on
            WhatsApp at {order.phone}, usually within a few working hours.
          </p>
          <div className="oid">{order.reference}</div>

          <div className="osum" style={{ textAlign: 'left', marginTop: 40, position: 'static' }}>
            <h4>What you ordered · {formatDate(order.createdAt)}</h4>
            {order.items.map((item) => (
              <div className="oline" key={item.productId}>
                <span className="media">
                  <JewelArt motif={item.motif} tone={item.tone} imageUrl={item.imageUrl} alt={item.name} />
                </span>
                <span className="nm">
                  {item.name}
                  <small>Qty {item.quantity}</small>
                </span>
                <span className="tnum">{formatInr(item.priceMinor * item.quantity)}</span>
              </div>
            ))}
            <div className="sumrow big"><span>Total paid</span><span className="tnum">{formatInr(order.totalMinor)}</span></div>
            <div className="note">
              <span>Delivering to {order.address}, {order.city} {order.pincode}.</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            <Link className="btn ghost" href="/collection">Continue browsing</Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
