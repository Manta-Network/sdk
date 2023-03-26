# Polkadot-JS Ledger Integration

To interface Polkadot-JS with the Manta Wallet API we implement the following two methods:

```rust
/// Pulls data from the ledger starting at `checkpoint`, returning the newest sender and
/// receiver data and the latest checkpoint.
async fn pull(checkpoint: Checkpoint) -> (Checkpoint, Vec<SenderData>, Vec<ReceiverData>)

/// Pulls data from the ledger starting at `checkpoint`, this is for new account
async fn initial_pull(checkpoint: Checkpoint) -> (any)
```
