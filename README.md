# Pay Links

Create a payment link, share it, get paid in XLM or USDC on Stellar.

A seller fills a form (amount, asset, description, seller wallet) and gets a
public link like `/pay/abc123`. The buyer opens it, connects a Stellar wallet
(Freighter), pays, and both sides see the status: `waiting`, `paid`, `expired`.

## Structure

- `frontend/` â€” React (Vite) + TypeScript app: create-link form, payment page,
  status page, wallet connect, 404 + loading states.
- `backend/` â€” Node.js + Express + TypeScript API: link CRUD, payment status
  checks against Horizon. JSON-file store, no database needed to run.
- `contracts/` â€” `escrow-interface.md` stub describing the future Soroban
  escrow contract API (create, fund, release, refund). The contract itself is
  tracked in issues (#10-12).

## Quick start

```bash
# backend
cd backend && npm install && npm run dev   # http://localhost:3001

# frontend (new terminal)
cd frontend && npm install && npm run dev  # http://localhost:5173
```

Copy `.env.example` to `.env` in each folder first. Use Stellar testnet while
developing (`HORIZON_URL=https://horizon-testnet.stellar.org`).

## How payment matching works

Each link gets a unique memo. The backend polls Horizon for payments to the
seller wallet and marks the link `paid` when amount + asset + memo match.

## Contributing

See `CONTRIBUTING.md`. Run `npm test` in `backend/` before opening a PR.

## License

MIT â€” see `LICENSE`.
