// Shared payment-link types. Keep in sync with frontend/src/lib/types.ts.

/** Lifecycle of a payment link. */
export type LinkStatus = 'waiting' | 'paid' | 'expired';

export interface PaymentLink {
  /** Short public id used in /pay/:id URLs. */
  id: string;
  /** Amount owed in the link asset. */
  amount: string;
  /** Asset code: XLM or USDC (extensible). */
  asset: string;
  /** Seller description shown to the buyer. */
  description: string;
  /** Seller Stellar address (G...). */
  sellerWallet: string;
  /** Unique memo buyers must attach so we can match the payment. */
  memo: string;
  status: LinkStatus;
  /** ISO timestamp the link was created. */
  createdAt: string;
  /** ISO timestamp after which the link stops accepting payment. */
  expiresAt: string;
  /** Horizon transaction hash once paid, else null. */
  txHash: string | null;
}

export interface CreateLinkInput {
  amount: string;
  asset: string;
  description: string;
  sellerWallet: string;
  /** Optional lifetime in minutes (default 60). */
  expiresInMinutes?: number;
}
