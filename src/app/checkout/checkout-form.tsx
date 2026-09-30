'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { placeOrder, type CheckoutState } from '@/actions/checkout';

const INITIAL: CheckoutState = { errors: {}, values: {} };

function Field({
  name, label, placeholder, state, type = 'text', full = false,
}: {
  name: string; label: string; placeholder: string; state: CheckoutState; type?: string; full?: boolean;
}) {
  const error = state.errors[name];
  return (
    <div className={full ? 'field full' : 'field'}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={state.values[name] ?? ''}
        style={error ? { borderColor: 'var(--rose)' } : undefined}
        aria-invalid={error ? true : undefined}
      />
      {error ? <span className="err">{error}</span> : null}
    </div>
  );
}

function SubmitButton({ amount }: { amount: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn brass" type="submit" disabled={pending}>
      {pending ? 'Placing order…' : `Place order · ${amount}`}
    </button>
  );
}

export function CheckoutForm({ amount, bank }: {
  amount: string;
  bank: { upi: string; name: string; account: string; ifsc: string };
}) {
  const [state, formAction] = useActionState(placeOrder, INITIAL);
  const [receiptName, setReceiptName] = useState('');

  return (
    <form action={formAction} className="panel">
      <h3>Where should it go?</h3>
      <p className="sub">We confirm this address on WhatsApp before dispatch.</p>

      {state.errors.cart ? <div className="flash">{state.errors.cart}</div> : null}

      <div className="fgrid">
        <Field name="customerName" label="Full name" placeholder="Meera Raghavan" state={state} />
        <Field name="phone" label="Mobile number" placeholder="98xxx xxxxx" state={state} type="tel" />
        <Field name="email" label="Email" placeholder="meera@example.com" state={state} type="email" full />
        <Field name="address" label="Address" placeholder="Flat, building, street" state={state} full />
        <Field name="city" label="City" placeholder="Gurugram" state={state} />
        <Field name="pincode" label="PIN code" placeholder="122001" state={state} />
      </div>

      <h3 style={{ marginTop: 40 }}>Pay directly to the shop</h3>
      <p className="sub">Scan the code or transfer to the account below, then attach the receipt.</p>

      <div className="paybox">
        <div className="qr" aria-hidden="true">
          <PaymentCode />
        </div>
        <div style={{ minWidth: 0, width: '100%' }}>
          <div className="bankrow"><span>UPI ID</span><b>{bank.upi}</b></div>
          <div className="bankrow"><span>Account name</span><b>{bank.name}</b></div>
          <div className="bankrow"><span>Account</span><b>{bank.account}</b></div>
          <div className="bankrow"><span>IFSC</span><b>{bank.ifsc}</b></div>
          <div className="bankrow">
            <span>Amount</span>
            <b style={{ color: 'var(--brass-l)', fontSize: 17 }}>{amount}</b>
          </div>
        </div>
      </div>

      <label className={receiptName ? 'uploadfield has' : 'uploadfield'} htmlFor="receipt">
        <b>{receiptName ? 'Receipt attached' : 'Attach your payment receipt'}</b>
        <p>A screenshot of the UPI confirmation or the bank transfer reference. PNG, JPG or PDF.</p>
        {receiptName ? <p className="chosen">{receiptName}</p> : null}
        <input
          id="receipt"
          name="receipt"
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setReceiptName(e.target.files?.[0]?.name ?? '')}
        />
      </label>
      {state.errors.receipt ? <div className="flash" style={{ marginTop: 16 }}>{state.errors.receipt}</div> : null}

      <div className="field full" style={{ marginTop: 24 }}>
        <label htmlFor="paymentReference">Payment reference (optional)</label>
        <input
          id="paymentReference"
          name="paymentReference"
          placeholder="UPI transaction ID or UTR"
          defaultValue={state.values.paymentReference ?? ''}
        />
      </div>

      <div className="note" style={{ marginTop: 24 }}>
        <span>
          No return, no exchange. Hallmarked and made-to-order pieces are not returnable.
          Manufacturing defects are repaired or replaced within seven days, and resizing is free for
          the first year.
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
        <SubmitButton amount={amount} />
      </div>
    </form>
  );
}

/** Decorative payment code. Replace with the shop's real UPI QR before launch. */
function PaymentCode() {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const cells: React.ReactElement[] = [];
  const N = 25;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if ((x < 7 && y < 7) || (x > N - 8 && y < 7) || (x < 7 && y > N - 8)) continue;
      if (rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x * 4} y={y * 4} width={4} height={4} />);
    }
  }
  const eye = (x: number, y: number, k: string) => (
    <g key={k}>
      <rect x={x} y={y} width={28} height={28} />
      <rect x={x + 4} y={y + 4} width={20} height={20} fill="#fff" />
      <rect x={x + 8} y={y + 8} width={12} height={12} />
    </g>
  );
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="Payment QR code">
      <g fill="#1C1714">
        {cells}
        {eye(0, 0, 'tl')}
        {eye(72, 0, 'tr')}
        {eye(0, 72, 'bl')}
      </g>
    </svg>
  );
}
