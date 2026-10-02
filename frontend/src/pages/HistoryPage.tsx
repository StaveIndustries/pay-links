import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLinks, type PaymentLink } from '../lib/api';
import Loading from '../components/Loading';

// Seller payment history page.
export default function HistoryPage() {
  const [links, setLinks] = useState<PaymentLink[] | null>(null);

  useEffect(() => {
    fetchLinks().then(setLinks).catch(() => setLinks([]));
  }, []);

  if (!links) return <Loading label="Loading history..." />;

  if (links.length === 0) {
    return (
      <div>
        <h1>Payment history</h1>
        <p>No payment links yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Payment history</h1>
      <ul>
        {links.map((l) => (
          <li key={l.id}>
            <Link to={`/pay/${l.id}`}>{l.description}</Link> â€” {l.amount} {l.asset} â€” {l.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
