# Manta Wallet JS-Binding

These packages implement a Javascript binding for the Manta Wallet API. See [`manta-rs`](https://github.com/manta-network/manta-rs) for more on this API.

## Usage

```javascript
import Api from '../api';

const example = async () => {
    const {
        Wallet,
        Signer,
        PolkadotJsLedger,
        Transaction,
        Asset,
        AssetId,
        ReceivingKeyRequest
    } = await import('./crate/pkg');

    const wasmApi = new Api(polkadotJsApi, polkadotJsSigner);
    const signer = new Signer(MANTA_SIGNER_URL);
    const ledger = new PolkadotJsLedger(wasmApi);
    let wallet = new Wallet(ledger, signer);

    wasmApi.setTxResHandler(({ status, events }) => {
        if (status.isFinalized) {
            for (const event of events) {
                if (api.events.utility.BatchInterrupted.is(event.event)) {
                    console.log('failure')
                    // handle failed tx here
                } else if (api.events.utility.BatchCompleted.is(event.event)) {
                    console.log('success')
                    // handle successful tx here
                }
            }
        }
    });
    
    const txJson = `{ "Mint": { "id": 8, "value": "111" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    wallet.post(transaction, null);
}
```