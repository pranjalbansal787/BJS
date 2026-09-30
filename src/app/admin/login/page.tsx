'use client';

import { useActionState } from 'react';
import { signIn, type LoginState } from '@/actions/admin';

export default function AdminLoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <div className="wrap">
      <form className="login" action={formAction}>
        <span className="lbl">Shop login</span>
        <h2>Sign in to the portal</h2>
        <p className="sub">The control centre for the store: categories, products and orders.</p>

        {state.error ? <div className="flash">{state.error}</div> : null}

        <div className="field" style={{ marginBottom: 22 }}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue="owner@jewellerypalacebjs.com" required />
        </div>
        <div className="field" style={{ marginBottom: 30 }}>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" defaultValue="demo1234" required />
        </div>
        <button className="btn brass" type="submit" style={{ width: '100%' }}>Sign in</button>
        <p style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 20, textAlign: 'center' }}>
          Credentials come from ADMIN_EMAIL and ADMIN_PASSWORD in your environment.
        </p>
      </form>
    </div>
  );
}
