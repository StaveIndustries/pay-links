// Mirror of backend/src/types.ts - keep the two in sync.
export type LinkStatus = 'waiting' | 'paid' | 'expired';

export interface PaymentLink {
  id: string;
  amount: string;
  asset: string;
  description: string;
  sellerWallet: string;
  memo: string;
  status: LinkStatus;
  createdAt: string;
  expiresAt: string;
  txHash: string | null;
}

const API = import.meta.env.VITE_API_URL ?? '';

async function asJson(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

/** Create a payment link. */
export async function createLink(input: {
  amount: string;
  asset: string;
  description: string;
  sellerWallet: string;
}): Promise<PaymentLink> {
  const res = await fetch(`${API}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return asJson(res);
}

/** Fetch one link (backend re-checks Horizon on each call). */
export async function fetchLink(id: string): Promise<PaymentLink> {
  const res = await fetch(`${API}/api/links/${id}`);
  return asJson(res);
}

/** All links, for the seller history page. */
export async function fetchLinks(): Promise<PaymentLink[]> {
  const res = await fetch(`${API}/api/links`);
  return asJson(res);
}
