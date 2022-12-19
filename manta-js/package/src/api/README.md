# Polkadot-JS Ledger Integration

To interface Polkadot-JS with the Manta Wallet API we implement the following two methods:

```rust
/// Pulls data from the ledger starting at `checkpoint`, returning the newest sender and
/// receiver data and the latest checkpoint.
async fn pull(checkpoint: Checkpoint) -> (Checkpoint, Vec<SenderData>, Vec<ReceiverData>)

/// Pushes a batch of transfers to the ledger.
async fn push(post: Vec<TransferPost>);
```
