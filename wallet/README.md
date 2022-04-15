## Installation
```
yarn install manta-wasm-wallet
yarn install manta-wasm-wallet-api
```

## Usage
```js

import Api from 'manta-wasm-wallet-api';

const example = async () => {
    const {
        Wallet,
        Signer,
        PolkadotJsLedger,
        Transaction,
        Asset,
        AssetId,
        ReceivingKeyRequest
    } = await import('manta-wasm-wallet');

    const wasmApi = new Api(polkadotJsApi, polkadotJsSigner);
    const signer = new Signer(MANTA_SIGNER_URL);
    const ledger = new PolkadotJsLedger(wasmApi);
    let wallet = new Wallet(ledger, signer);

    const handleTxRes = ({ status, events }) => {
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
    }
    wasmApi.setTxResHandler(txResHandler);
    
    const txJson = `{ "Mint": { "id": 8, "value": "111" }}`;
    const transaction = wasm.Transaction.from_string(txJson);
    wallet.post(transaction, null);
}

```