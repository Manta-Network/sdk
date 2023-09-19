# How to mint zkSBT

There're two case to mint zkSBT now.
- Credentials from other blockchain, like zkBAB, zkGalxe etc.
- Directly mint SBT on Manta network.

## Manta zkSBT

1. Manta Wallet initialization, reference to: https://github.com/Manta-Network/sdk/blob/signer_extension/manta-js/docs/how-to-use-manta-private-wallet-in-dapp.md

2. reserve asest id before mint zkSBT.

```typescript
const reserverTx = await api.tx.mantaSbt.reserveSbt();
await reserveTx.signAndSend(polkadotAddress);
```

3. Query your reserve ids from on chain storage:

```typescript
const assetIdRange = await api.query.mantaSbt.reservedIds(polkadotAddress);
```

4. Mint zkSBT by your reserved asset id list.

``` typescript
const sbtInfoList = [
  { assetId: new BN(1) }
];
const { posts, transactionDatas } = await privateWallet.multiSbtPostBuild(sbtInfoList);
const batchesTx = [];
for(var post in posts) {
    const tx = api.tx.mantaSbt.toPrivate(post, metadata);
    batchesTx.push(tx);
}
await api.tx.utility.batch(batchesTx).signAndSend(polkadotAddress);
```

5. When user mint zkSBT, We also return `transactionDatas` which contains the proof key of zkSBT. Third party project can use this proof key information to request our NPO backend service:

POST http://${NPO_BACKEND_SERVICE_URL}/npo/raw-proofs

> Note: Please contact our team to get `NPO_BACKEND_SERVICE_URL`.

```json
{
    "address": "YOUR POLKADOT ADDRESS",
    "token_type": "zkBAB",
    "proof_info": [
        {
            "proof_id": "0x4d551bb6932126300d403e9963aa051f43675ca4b56a53e9f8e3e84783440726",
            "blur_url": "https://npo-cdn.asmatch.xyz/zkBAB_Front.jpg",
            "asset_id": "115",
            "transaction_data":{"identifier":{"is_transparent":false,"utxo_commitment_randomness":[37,234,109,248,115,209,84,18,147,191,117,149,49,3,241,210,88,22,238,243,206,113,60,123,120,9,193,161,9,206,48,37]},"asset_info":{"id":[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":1},"zk_address":{"receiving_key":[80,174,139,214,69,21,2,245,8,21,248,250,162,236,202,190,196,158,75,11,217,235,212,191,19,227,146,27,160,205,8,130]}}
        }
    ]
}
```

A successfully response example:

```json
{
    "status": true
}
```

If the api result is failed, it means your transaction data is not correct.


6. After proof information is stored on NPO backend service, you can request NPO backend verifier service to check if given proof information is valid or not:

POST http://${NPO_BACKEND_SERVICE_URL}/npo/raw-proof

```json
{
    "proof_id": ["0x4d551bb6932126300d403e9963aa051f43675ca4b56a53e9f8e3e84783440726"]
}
```

A successfully response example:

```json
{
    "status": true,
    "data": [
        {
            "address": "dmuiB62dLVDJxRG66ZPBRnrpvgvgHdQ335qNczznnZsSHmfz1",
            "url": "https://npo-cdn.asmatch.xyz/zkBAB_Front.jpg",
            "randomness": "00000000000000000000000000000000",
            "asset_id": "115",
            "token_type": "zkBAB",
            "proof_id": "0x4d551bb6932126300d403e9963aa051f43675ca4b56a53e9f8e3e84783440726",
            "createAt": 1681788356,
            "category": "Credential",
            "token_name": "BAB"
        }
    ]
}
```

## Credentials

We currently support Ethereum compatible chain which use EIP-712 signature, and only allow whitelist users to mint credentials zkSBT.

1. Before user mint zkSBT, user's ethereum address need to added to allowlist. Currently we only allow one special privilege account to execute `allowlistEvmAccount` transaction. So please also contact us if your project has requirement to mint credentials zkSBT.

This is an example of adding user's bab address to `allowlistEvmAccount`.

```typescript
const address = {
    bab: "YOUR BAB ADDRESS"
}
const allowlistTx = await api.tx.mantaSbt.allowlistEvmAccount(address);
await allowlistTx.signAndSend(polkadotAddress);
```

2. Query your asset ids from on chain storage:

This is an example of query user's bab address from `evmAddressAllowlist`.

```typescript
const address = {
    bab: "YOUR BAB ADDRESS"
}
const mintStatus = await api.query.mantaSbt.evmAddressAllowlist(address);
```

If the query result value is `Available` and contains asset id, then the user is allowed to mint zkSBT, otherwise if the value is `AlreadyMinted`, it means the user has already minted zkSBT. Or if the value is `None`, it means the user is not allowed to mint zkSBT.

```
{
  Available: 1
}
```

3. Get `TransferPost` from `privateWallet`.

```typescript
const sbtInfoList = [
  { assetId: new BN(1) }
];
const { posts, transactionDatas } = await privateWallet.multiSbtPostBuild(sbtInfoList);
```

4. Mint zkSBT.

> Note: We're using EIP-712 signature to verify use's eth address. So `mintSbtEth` extrinsic need to provide `chainId`, `signature`, and `address`. 

```typescript
const metadata = "YOUR METADATA";
const address = {
    bab: "YOUR BAB ADDRESS"
}
// This example only mint 1 zkSBT, you can batch your transaction if you have multiple zkSBT to mint.
const post = posts[0];

const mintTx = api.tx.mantaSbt.mintSbtEth(
    post,
    signedChainId,
    signature,
    address,
    null,
    null,
    metadata
);
await mintTx.signAndSend(polkadotAddress);
```

5. Using the `transactionDatas` and request to NPO backend service, Third party project can use this proof key information to request NPO backend service:

POST http://${NPO_BACKEND_SERVICE_URL}/npo/raw-proofs

> Note: Please contact our team to get `NPO_BACKEND_SERVICE_URL`.

```json
{
    "address": "YOUR POLKADOT ADDRESS",
    "token_type": "zkBAB",
    "proof_info": [
        {
            "proof_id": "0x4d551bb6932126300d403e9963aa051f43675ca4b56a53e9f8e3e84783440726",
            "blur_url": "https://npo-cdn.asmatch.xyz/zkBAB_Front.jpg",
            "asset_id": "115",
            "transaction_data":{"identifier":{"is_transparent":false,"utxo_commitment_randomness":[37,234,109,248,115,209,84,18,147,191,117,149,49,3,241,210,88,22,238,243,206,113,60,123,120,9,193,161,9,206,48,37]},"asset_info":{"id":[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":1},"zk_address":{"receiving_key":[80,174,139,214,69,21,2,245,8,21,248,250,162,236,202,190,196,158,75,11,217,235,212,191,19,227,146,27,160,205,8,130]}}
        }
    ]
}
```

A successfully response example:

```json
{
    "status": true
}
```

If the api result is failed, it means your transaction data is not correct.


6. After proof information is stored on NPO backend service, you can request NPO backend verifier service to check if given proof information is valid or not:

POST http://${NPO_BACKEND_SERVICE_URL}/npo/raw-proof

```json
{
    "proof_id": ["0x4d551bb6932126300d403e9963aa051f43675ca4b56a53e9f8e3e84783440726"]
}
```

A successfully response example:

```json
{
    "status": true,
    "data": [
        {
            "address": "dmuiB62dLVDJxRG66ZPBRnrpvgvgHdQ335qNczznnZsSHmfz1",
            "url": "https://npo-cdn.asmatch.xyz/zkBAB_Front.jpg",
            "randomness": "00000000000000000000000000000000",
            "asset_id": "115",
            "token_type": "zkBAB",
            "proof_id": "0x4d551bb6932126300d403e9963aa051f43675ca4b56a53e9f8e3e84783440726",
            "createAt": 1681788356,
            "category": "Credential",
            "token_name": "BAB"
        }
    ]
}
```
