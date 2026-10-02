import { describe, expect, it } from 'vitest';
import {
  displayStatus,
  generateId,
  generateMemo,
  isMemo,
  isSupportedAsset,
  isValidAddress,
  isValidAmount,
  validateCreateInput,
} from '../src/validate.js';
import type { PaymentLink } from '../src/types.js';

const GOOD_WALLET = 'G' + 'A'.repeat(55);

describe('isValidAddress', () => {
  it('accepts a well-formed G address', () => {
    expect(isValidAddress(GOOD_WALLET)).toBe(true);
  });

  it('rejects short, empty, and non-G addresses', () => {
    expect(isValidAddress('')).toBe(false);
    expect(isValidAddress('GABC')).toBe(false);
    expect(isValidAddress('X' + 'A'.repeat(55))).toBe(false);
  });
});

describe('isValidAmount', () => {
  it('accepts positive numbers', () => {
    expect(isValidAmount('10')).toBe(true);
    expect(isValidAmount('0.5')).toBe(true);
  });

  it('rejects zero, negative, and junk', () => {
    expect(isValidAmount('0')).toBe(false);
    expect(isValidAmount('-5')).toBe(false);
    expect(isValidAmount('abc')).toBe(false);
    expect(isValidAmount('')).toBe(false);
  });
});

describe('assets and memos', () => {
  it('supports XLM and USDC case-insensitively', () => {
    expect(isSupportedAsset('xlm')).toBe(true);
    expect(isSupportedAsset('USDC')).toBe(true);
    expect(isSupportedAsset('BTC')).toBe(false);
  });

  it('generates unique memos in PL-xxxxxx format', () => {
    const a = generateMemo();
    const b = generateMemo();
    expect(isMemo(a)).toBe(true);
    expect(a).not.toBe(b);
  });

  it('generates unique link ids', () => {
    expect(generateId()).not.toBe(generateId());
  });
});

describe('validateCreateInput', () => {
  it('returns no errors for a good payload', () => {
    expect(
      validateCreateInput({
        amount: '25',
        asset: 'USDC',
        description: 'Coffee beans',
        sellerWallet: GOOD_WALLET,
      }),
    ).toEqual([]);
  });

  it('flags every bad field', () => {
    const errors = validateCreateInput({
      amount: '0',
      asset: 'BTC',
      description: '  ',
      sellerWallet: 'nope',
    });
    expect(errors.map((e) => e.field).sort()).toEqual([
      'amount',
      'asset',
      'description',
      'sellerWallet',
    ]);
  });
});

describe('displayStatus', () => {
  const base: PaymentLink = {
    id: 'abc123',
    amount: '5',
    asset: 'XLM',
    description: 'Test',
    sellerWallet: GOOD_WALLET,
    memo: 'PL-abc123',
    status: 'waiting',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    txHash: null,
  };

  it('keeps paid as paid', () => {
    expect(displayStatus({ ...base, status: 'paid' })).toBe('paid');
  });

  it('expires past-due waiting links', () => {
    const past = { ...base, expiresAt: new Date(Date.now() - 1000).toISOString() };
    expect(displayStatus(past)).toBe('expired');
  });
});
