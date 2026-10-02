import * as StellarSdk from '@stellar/stellar-sdk';

// Minimal Freighter integration. Freighter injects window.freighterApi;
// we guard everything so the app still renders without a wallet.
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    freighterApi?: any;
  }
}

function freighter() {
  const api = window.freighterApi;
  if (!api) throw new Error('Freighter wallet not found. Install it to pay.');
  return api;
}

/** True when a Freighter-compatible wallet is installed. */
export function hasWallet(): boolean {
  return typeof window !== 'undefined' && !!window.freighterApi;
}

/** Request the user's public key from the wallet. */
export async function getPublicKey(): Promise<string> {
  return freighter().getPublicKey();
}

/**
 * Build, sign (via Freighter), and submit a payment for a link.
 * Amount/asset/memo come from the link so the backend can match it.
 */
export async function payLink(opts: {
  destination: string;
  amount: string;
  assetCode: string;
  memo: string;
}): Promise<string> {
  const api = freighter();
  const horizonUrl =
    import.meta.env.VITE_HORIZON_URL ?? 'https://horizon-testnet.stellar.org';
  const server = new StellarSdk.Horizon.Server(horizonUrl);

  const sourceKey = await api.getPublicKey();
  const source = await server.loadAccount(sourceKey);

  const asset =
    opts.assetCode === 'XLM'
      ? StellarSdk.Asset.native()
      : new StellarSdk.Asset(opts.assetCode, opts.destination);

  const tx = new StellarSdk.TransactionBuilder(source, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase:
      import.meta.env.VITE_NETWORK_PASSPHRASE ?? StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: opts.destination,
        asset,
        amount: opts.amount,
      }),
    )
    .addMemo(StellarSdk.Memo.text(opts.memo))
    .setTimeout(120)
    .build();

  const signedXdr = await api.signTransaction(tx.toXDR(), {
    networkPassphrase:
      import.meta.env.VITE_NETWORK_PASSPHRASE ?? StellarSdk.Networks.TESTNET,
  });
  const signed = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr.signedTxXdr,
    import.meta.env.VITE_NETWORK_PASSPHRASE ?? StellarSdk.Networks.TESTNET,
  );
  const result = await server.submitTransaction(signed);
  return result.hash;
}
