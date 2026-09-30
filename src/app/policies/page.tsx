import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'Policies' };

export default function PoliciesPage() {
  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="crumb">
          <Link href="/">Home</Link><span>—</span><span>Policies</span>
        </div>
      </div>
      <section className="band tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="lbl">The fine print</span>
              <h2>Policies</h2>
            </div>
          </div>
          <div className="acc" style={{ maxWidth: '68ch' }}>
            <details open>
              <summary>No return, no exchange</summary>
              <div className="body">
                <p>Hallmarked and made-to-order jewellery is sold on a no return, no exchange basis.</p>
                <ul>
                  <li>Manufacturing defects are repaired or replaced within seven days of delivery.</li>
                  <li>Resizing of rings and bangles is free for the first year.</li>
                  <li>Buy-back against the day&rsquo;s rate is available at the showroom with the original invoice.</li>
                </ul>
              </div>
            </details>
            <details>
              <summary>Hallmark &amp; HUID</summary>
              <div className="body">
                Every piece carries the BIS 916 hallmark, the assaying centre mark and a unique HUID,
                which you can verify on the BIS Care app before paying. The invoice records gross
                weight, net weight and stone weight separately.
              </div>
            </details>
            <details>
              <summary>Payments</summary>
              <div className="body">
                Orders are prepaid by UPI or bank transfer directly to the shop account. No payment
                gateway sits in between, so nothing is deducted from the amount you send. An order is
                confirmed once the shop matches your receipt against the bank statement.
              </div>
            </details>
            <details>
              <summary>Delivery</summary>
              <div className="body">
                Dispatched within two working days of payment confirmation, by insured courier with
                signature on delivery. Delivery across India is free on orders above ₹50,000.
              </div>
            </details>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
