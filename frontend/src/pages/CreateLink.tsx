import { useState } from 'react';
import { createLink } from '../lib/api';

// Seller form: amount, asset, description, seller wallet.
export default function CreateLink() {
  const [amount, setAmount] = useState('');
  const [asset, setAsset] = useState('XLM');
  const [description, setDescription] = useState('');
  const [sellerWallet, setSellerWallet] = useState('');
  const [error, setError] = useState('');
  const [createdId, setCreatedId] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const link = await createLink({ amount, asset, description, sellerWallet });
      setCreatedId(link.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create link.');
    }
  }

  return (
    <div>
      <h1>Create a payment link</h1>
      <form onSubmit={onSubmit}>
        <label>
          Amount
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="25" />
        </label>
        <label>
          Asset
          <select value={asset} onChange={(e) => setAsset(e.target.value)}>
            <option value="XLM">XLM</option>
            <option value="USDC">USDC</option>
          </select>
        </label>
        <label>
          Description
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Coffee beans" />
        </label>
        <label>
          Seller wallet (G...)
          <input value={sellerWallet} onChange={(e) => setSellerWallet(e.target.value)} placeholder="G..." />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit">Create link</button>
      </form>
      {createdId && (
        <p>
          Share this link: <a href={`/pay/${createdId}`}>{`${window.location.origin}/pay/${createdId}`}</a>
        </p>
      )}
    </div>
  );
}
