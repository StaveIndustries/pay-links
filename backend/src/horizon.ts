import { Horizon, Memo } from '@stellar/stellar-sdk';
import { PaymentLink } from './types.js';

// Horizon base URL, e.g. https://horizon-testnet.stellar.org
function server(): Horizon.Server {
  const url = process.env.HORIZON_URL ?? 'https://horizon-testnet.stellar.org';
  return new Horizon.Server(url);
}

/** A Horizon payment matching amount + asset + memo for a link. */
export interface MatchedPayment {
  txHash: string;
}

/**
 * Look for a payment to the seller wallet matching the link amount, asset
 * and memo. Returns the first match or null.
 */
export async function findMatchingPayment(link: PaymentLink): Promise<MatchedPayment | null> {
  const payments = await server()
    .payments()
    .forAccount(link.sellerWallet)
    .order('desc')
    .limit(20)
    .call();

  for (const record of payments.records) {
    if (record.type !== 'payment' && record.type !== 'path_payment_strict_receive') continue;
    const payment = record as Horizon.HorizonApi.PaymentOperationResponse;
    if (payment.asset_type === 'native' ? link.asset !== 'XLM' : payment.asset_code !== link.asset) continue;
    if (payment.amount !== link.amount) continue;
    // Memo lives on the transaction, not the operation - fetch it by hash.
    const tx = await server()
      .transactions()
      .transaction(payment.transaction_hash)
      .call();
    const memo = tx.memo_type === 'text' ? (tx.memo as string) : '';
    if (memo === link.memo) {
      return { txHash: tx.hash };
    }
  }
  return null;
}

/** Memo helper re-export for routes (kept here so Horizon logic stays together). */
export { Memo };
