
## zkSBT

zkSBT sdk is extension of manta-pay sdk, and add some custom logic, including:
- We have a pre-charge steps when reserve asset id of zkSBT.
- User mint zkSBT by provide metadata, the metadata of zkSBT can be image url or anything, but we have a size limit of metadata(Current is 300 length).

Developer should use sdk to mint zkSBT, because current we need `Signer` to generate `TransferPost` which contains lots of zkp proof information.

### Mint zkSBT

Here is a example of mint zkSBT steps:

1. initial wallet and signer.

> `getPolkadotSignerAndAddress` is the same as manta-pay sdk.

```js
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    await privateWallet.initialWalletSync();
```

2. reserve asest id before mint zkSBT.

```js
    const reserveSbt = await privateWallet.buildReserveSbt(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    await reserveSbt.signAndSend(polkadotConfig.polkadotAddress);
```

3. Mint zkSBT by provide start asset id, number of token to mint, and metadata list.

> Notice: due to zkp proof extrinsic size is large than normal transaction, we current support at least 5 zkSBT in one batch.

```js
    const numberOfMints = 2;
    const metadata: string[] = [];
    for (let i = 0; i < numberOfMints; i++ ) {
        metadata.push(`YOUR METADAT INFO ${i.toString()}`)
    }

    const sbtMint = await privateWallet.buildSbtBatch(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress, assetId, numberOfMints, metadata);

    await sbtMint.batchTx.signAndSend(polkadotConfig.polkadotAddress);
```

### zkSBT Proof storage and verification

After user mint zkSBT, the return value including proof key of zkSBT, the concept of proof key can be reference to manta pay api documentation. Third party project should use these proof key and asset id returned from `buildSbtBatch` method, and call our backend service api to store the proof information:

POST http://backend_service_url/npo/raw-proofs

```js
{
    "address": "0xRAW-001",
    "proof_info": [{
        "proof_id": "0x01234567890123456789012345678901",
        "asset_id": "1",
        "metadata": "https://example.com/1.png"
    }]
}
```

The return response like:

```js
{
    "status": true
}
```

After proof information is stored on our backend service, you can call our backend verifier service to verify if given proof information is valid or not:

POST http://backend_service_url/npo/raw-proof

```js
{
    "proof_id": ["0x01234567890123456789012345678901"]
}
```

response:

```js
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
