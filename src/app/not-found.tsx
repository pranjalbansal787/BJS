import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="conf">
        <h1>We could not find that page</h1>
        <p>The piece may have been sold, or the link may be out of date.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          <Link className="btn brass" href="/collection">Browse the collection</Link>
          <Link className="btn ghost" href="/">Back to the home page</Link>
        </div>
      </div>
    </div>
  );
}
