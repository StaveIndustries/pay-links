# Future Soroban escrow contract - interface stub (issues #10-12)

The escrow contract does not exist yet. This document defines the interface
the web app will call once it is built, so frontend and contract work can
proceed in parallel.

## Functions

- `create(link_id: String, seller: Address, amount: i128, asset: Address, expiry: u64)`
  Lock a payment intent. Returns the escrow id.
- `fund(escrow_id, buyer: Address)` - buyer deposits funds into escrow.
- `release(escrow_id)` - buyer confirms delivery; funds go to the seller.
- `refund(escrow_id, reason: String)` - refund the buyer (dispute path).

## Events

- `created { escrow_id, seller, amount }`
- `funded { escrow_id, buyer }`
- `released { escrow_id, seller }`
- `refunded { escrow_id, buyer, reason }`

## Notes for implementers (#10-12)

- Money is held by the contract until the buyer confirms delivery.
- Refund/dispute logic needs full tests (`cargo test`).
- The web app integration (create, fund, release, refund) calls the contract
  via the Stellar SDK after the buyer connects their wallet.
