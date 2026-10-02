import { Router } from 'express';
import { CreateLinkInput, PaymentLink } from '../types.js';
import { generateId, generateMemo, validateCreateInput } from '../validate.js';
import { findMatchingPayment } from '../horizon.js';
import { getLink, listLinks, saveLink } from '../store.js';

export const linksRouter = Router();

// POST /api/links - create a payment link.
linksRouter.post('/', (req, res) => {
  const input = req.body as CreateLinkInput;
  const errors = validateCreateInput(input);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  const now = new Date();
  const minutes = input.expiresInMinutes ?? 60;
  const link: PaymentLink = {
    id: generateId(),
    amount: input.amount,
    asset: input.asset.toUpperCase(),
    description: input.description.trim(),
    sellerWallet: input.sellerWallet.trim(),
    memo: generateMemo(),
    status: 'waiting',
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + minutes * 60_000).toISOString(),
    txHash: null,
  };
  saveLink(link);
  return res.status(201).json(link);
});

// GET /api/links/:id - fetch one link (checks Horizon for new payments).
linksRouter.get('/:id', async (req, res) => {
  const link = getLink(req.params.id);
  if (!link) return res.status(404).json({ message: 'Link not found.' });
  if (link.status === 'waiting') {
    try {
      const match = await findMatchingPayment(link);
      if (match) {
        link.status = 'paid';
        link.txHash = match.txHash;
        saveLink(link);
      }
    } catch {
      // Horizon unreachable - return the stored state, don't fail the page.
    }
  }
  if (link.status === 'waiting' && new Date(link.expiresAt) <= new Date()) {
    link.status = 'expired';
    saveLink(link);
  }
  return res.json(link);
});

// GET /api/links - list links for the seller dashboard/history page.
linksRouter.get('/', (_req, res) => {
  return res.json(listLinks());
});
