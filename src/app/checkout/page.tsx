import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { JewelArt } from '@/components/jewel-art';
import { CheckoutForm } from './checkout-form';
import { getCart } from '@/lib/cart';
import { formatInr } from '@/lib/format';

export const metadata = { title: 'Checkout' };

export default async function CheckoutPage() {
  const { entries, totalMinor } = await getCart();

  if (entries.length === 0) {
    return (
      <>
        <SiteHeader />
        <div className="wrap">
          <div className="empty" style={{ marginBlock: 90 }}>
            <h3>Your cart is empty</h3>
            <p>Add a piece before checking out.</p>
            <Link className="btn ghost sm" href="/collection">Browse the collection</Link>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }

  const bank = {
    upi: process.env.NEXT_PUBLIC_UPI_ID || 'bjsjewellers@okhdfcbank',
    name: process.env.NEXT_PUBLIC_BANK_NAME || 'Bharat Jewellers',
    account: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '5011 2298 4471',
    ifsc: process.env.NEXT_PUBLIC_BANK_IFSC || 'HDFC0001427',
  };

  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link><span>—</span>
          <Link href="/cart">Cart</Link><span>—</span><span>Checkout</span>
        </div>

        <div className="cogrid">
          <CheckoutForm amount={formatInr(totalMinor)} bank={bank} />

          <aside className="osum">
            <h4>Order summary</h4>
            {entries.map((entry) => (
              <div className="oline" key={entry.product.id}>
                <span className="media">
                  <JewelArt
                    motif={entry.product.motif}
                    tone={entry.product.tone}
                    imageUrl={entry.product.imageUrl}
                    alt={entry.product.name}
                  />
                </span>
                <span className="nm">
                  {entry.product.name}
                  <small>Qty {entry.quantity}</small>
                </span>
                <span className="tnum">{formatInr(entry.lineTotalMinor)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--line)', marginTop: 16, paddingTop: 16 }}>
              <div className="sumrow"><span>Subtotal</span><span className="tnum">{formatInr(totalMinor)}</span></div>
              <div className="sumrow"><span>Insured delivery</span><span style={{ color: 'var(--ok)' }}>Free</span></div>
              <div className="sumrow big"><span>To pay</span><span className="tnum">{formatInr(totalMinor)}</span></div>
            </div>
            <div className="note">
              <span>Orders are confirmed once the shop matches your payment against the bank account, usually within a few working hours.</span>
            </div>
          </aside>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
