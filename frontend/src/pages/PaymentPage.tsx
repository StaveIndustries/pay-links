import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLink, type PaymentLink } from '../lib/api';
import { hasWallet, payLink } from '../lib/wallet';
import Loading from '../components/Loading';

// Public payment page: shows the link, connects wallet, pays, polls status.
export default function PaymentPage() {
  const { id } = useParams();
  const [link, setLink] = useState<PaymentLink | null>(null);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  async function load() {
    if (!id) return;
    try {
      setLink(await fetchLink(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Link not found.');
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 10_000); // re-check payment status
    return () => clearInterval(timer);
  }, [id]);

  async function onPay() {
    if (!link) return;
    setError('');
    setPaying(true);
    try {
      await payLink({
        destination: link.sellerWallet,
        amount: link.amount,
        assetCode: link.asset,
        memo: link.memo,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed.');
    } finally {
      setPaying(false);
    }
  }

  if (error && !link) return <p role="alert">{error}</p>;
  if (!link) return <Loading label="Loading payment link..." />;

  return (
    <div>
      <h1>Pay {link.amount} {link.asset}</h1>
      <p>{link.description}</p>
      <p>Status: <strong>{link.status}</strong></p>
      <p>Memo (added automatically): <code>{link.memo}</code></p>
      {link.status === 'waiting' && (
        hasWallet() ? (
          <button onClick={onPay} disabled={paying}>
            {paying ? 'Paying...' : `Pay with wallet`}
          </button>
        ) : (
          <p>Install a Freighter-compatible wallet to pay.</p>
        )
      )}
      {link.status === 'paid' && <p>Paid! {link.txHash && <>Tx: <code>{link.txHash}</code></>}</p>}
      {link.status === 'expired' && <p>This link has expired.</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
