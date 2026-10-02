import { CreateLinkInput, LinkStatus, PaymentLink } from './types.js';

// Stellar StrKey: G + 55 base32 chars.
const ADDRESS_RE = /^G[A-Z2-7]{55}$/;

// Memo format: PL-<6 base36 chars>, always <= 28 chars (Horizon text memo limit).
const MEMO_RE = /^PL-[a-z0-9]{6}$/;

/** True when the address is a plausible Stellar public key. */
export function isValidAddress(address: string): boolean {
  return ADDRESS_RE.test(address.trim());
}

/** True when the amount is a positive number string. */
export function isValidAmount(amount: string): boolean {
  const n = Number(amount);
  return amount.trim() !== '' && Number.isFinite(n) && n > 0;
}

/** Supported assets for new links. */
export const SUPPORTED_ASSETS = ['XLM', 'USDC'] as const;

export function isSupportedAsset(asset: string): boolean {
  return (SUPPORTED_ASSETS as readonly string[]).includes(asset.toUpperCase());
}

/** Random 6-char id for link URLs (not the memo). */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** Unique memo buyers attach to the payment. */
export function generateMemo(): string {
  return `PL-${Math.random().toString(36).slice(2, 8)}`;
}

export interface ValidationError {
  field: string;
  message: string;
}

/** Validate a create-link payload. Returns a list of problems (empty = ok). */
export function validateCreateInput(input: CreateLinkInput): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!isValidAmount(input.amount ?? '')) {
    errors.push({ field: 'amount', message: 'Amount must be a positive number.' });
  }
  if (!isSupportedAsset(input.asset ?? '')) {
    errors.push({ field: 'asset', message: 'Asset must be one of: XLM, USDC.' });
  }
  if (!input.description || !input.description.trim()) {
    errors.push({ field: 'description', message: 'Description is required.' });
  }
  if (!isValidAddress(input.sellerWallet ?? '')) {
    errors.push({ field: 'sellerWallet', message: 'Seller wallet must be a valid Stellar address (G...).' });
  }
  return errors;
}

export function isMemo(value: string): boolean {
  return MEMO_RE.test(value);
}

/** Recompute the status for display: waiting links past expiry become expired. */
export function displayStatus(link: PaymentLink, now = new Date()): LinkStatus {
  if (link.status === 'paid') return 'paid';
  return new Date(link.expiresAt) <= now ? 'expired' : 'waiting';
}
