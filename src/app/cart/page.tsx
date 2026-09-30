import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { JewelArt } from '@/components/jewel-art';
import { removeCartLine, updateCartLine } from '@/actions/cart';
import { getCart } from '@/lib/cart';
import { formatInr } from '@/lib/format';

export const metadata = { title: 'Your cart' };

export default async function CartPage() {
  const { entries, totalMinor, count } = await getCart();

  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link>
          <span>—</span>
          <span>Cart</span>
        </div>

        {entries.length === 0 ? (
          <div className="empty" style={{ marginBottom: 90 }}>
            <h3>Your cart is empty</h3>
            <p>Add a piece from the collection and it will show up here.</p>
            <Link className="btn ghost sm" href="/collection">Browse the collection</Link>
          </div>
        ) : (
          <div className="cogrid">
            <div className="panel">
              <h3>Your cart</h3>
              <p className="sub">{count} piece{count > 1 ? 's' : ''} held for you.</p>

              {entries.map((entry) => (
                <div className="citem" key={entry.product.id}>
                  <span className="media">
                    <JewelArt
                      motif={entry.product.motif}
                      tone={entry.product.tone}
                      imageUrl={entry.product.imageUrl}
                      alt={entry.product.name}
                    />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="nm">
                      <Link href={`/product/${entry.product.slug}`}>{entry.product.name}</Link>
                    </div>
                    <div className="mt">
                      {entry.product.purity} · {entry.product.weight || entry.product.metal}
                    </div>
                    <div className="row">
                      <div className="qty">
                        <form action={updateCartLine}>
                          <input type="hidden" name="productId" value={entry.product.id} />
                          <input type="hidden" name="delta" value="-1" />
                          <button type="submit" aria-label="Reduce quantity">−</button>
                        </form>
                        <span className="tnum">{entry.quantity}</span>
                        <form action={updateCartLine}>
                          <input type="hidden" name="productId" value={entry.product.id} />
                          <input type="hidden" name="delta" value="1" />
                          <button type="submit" aria-label="Increase quantity">+</button>
                        </form>
                      </div>
                      <span className="tnum" style={{ fontSize: 14 }}>{formatInr(entry.lineTotalMinor)}</span>
                    </div>
                    <form action={removeCartLine}>
                      <input type="hidden" name="productId" value={entry.product.id} />
                      <button className="link" type="submit" style={{ marginTop: 10, fontSize: '9.5px', color: 'var(--faint)' }}>
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>

            <aside className="osum">
              <h4>Order summary</h4>
              <div className="sumrow"><span>Subtotal</span><span className="tnum">{formatInr(totalMinor)}</span></div>
              <div className="sumrow"><span>Insured delivery</span><span style={{ color: 'var(--ok)' }}>Free</span></div>
              <div className="sumrow big"><span>Total</span><span className="tnum">{formatInr(totalMinor)}</span></div>
              <Link className="btn brass" href="/checkout" style={{ width: '100%', marginTop: 18 }}>
                Proceed to checkout
              </Link>
              <div className="note">
                <span>Pay by UPI or bank transfer at the next step. No gateway fee is added.</span>
              </div>
            </aside>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
