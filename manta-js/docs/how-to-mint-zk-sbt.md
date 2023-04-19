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

3. Mint zkSBT by your reserved asset id list.

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
await batchesTx.signAndSend(polkadotAddress);
```

4. When user mint zkSBT, We also return `transactionDatas` which contains the proof key of zkSBT. Third party project can use this proof key information to request our NPO backend service:

POST http://${NPO_BACKEND_SERVICE_URL}/npo/raw-proofs

```json
{
    "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    "proof_info": [
        {
            "proof_id": "25ea6df873d1541293bf75953103f1d25816eef3ce713c7b7809c1a109ce3025",
            "blur_url": "BAB Metadata 3023",
            "transaction_data":{"identifier":{"is_transparent":false,"utxo_commitment_randomness":[37,234,109,248,115,209,84,18,147,191,117,149,49,3,241,210,88,22,238,243,206,113,60,123,120,9,193,161,9,206,48,37]},"asset_info":{"id":[5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"value":1},"zk_address":{"receiving_key":[80,174,139,214,69,21,2,245,8,21,248,250,162,236,202,190,196,158,75,11,217,235,212,191,19,227,146,27,160,205,8,130]}}
        }
    ]
}
```

The successfully response like:

```json
{
    "status": true
}
```

If the api result is failed, it means your transaction data is not correct.


5. After proof information is stored on our backend service, you can request our backend verifier service to verify if given proof information is valid or not:

POST http://${NPO_BACKEND_SERVICE_URL}/npo/raw-proof

```json
{
    "proof_id": ["0x01234567890123456789012345678901"]
}
```

The successfully response example like:

```json
{
    "status": true,
    "data": [
        {
            "proof_id": "0x01234567890123456789012345678901",
            "metadata": "https://example.com/1.png",
            "asset_id": "1"
        }
    ]
}
```

## Credentials

We currently support ethereum compatible chain which use EIP-712 signature, and only allow whitelist users to mint credentials zkSBT.

1. Before user mint sbt, the user need to added to allowlist:

```typescript
const address = {
    bab: "0x_babAddress"
}
const allowlistTx = await api.tx.mantaSbt.allowlistEvmAccount(address);
await allowlistTx.signAndSend(polkadotAddress);
```

2. Query your asset ids from on chain storage:

```typescript
const address = {
    bab: "0x_babAddress"
}
const mintStatus = await api.query.mantaSbt.evmAddressAllowlist(address);
```

If the result value is Available, then the user is allowed to mint sbt, otherwise if the value is AlreadyMinted, it means the user has already minted sbt.

```json
{
  Available: 1
}
```

3. Get TransferPost from `privateWallet`

```typescript
const sbtInfoList = [
  { assetId: new BN(1) }
];
const { posts, transactionDatas } = await privateWallet.multiSbtPostBuild(sbtInfoList);
// This example only mint 1 zkSBT, you can batch your transaction if you have multiple sbt to mint.
const post = posts[0];
const transactionData = transactionDatas[0];
```

4. Mint zkSBT.

```typescript
const metadata = "YOUR METADATA";

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

5. Using the `transactionDatas` and request to NPO backend service, this workflow is same as previous part like mint sbt on Manata Network.