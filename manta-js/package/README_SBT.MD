
## SBT

SBT sdk is extension of manta-pay sdk, and add some custom logic, including:
- We have a pre-charge steps when reserve asset id of SBT.
- User mint SBT by provide metadata, the metadata of SBT can be image url or anything, but we have a size limit of metadata(Current is 300 length).

Developer should use sdk to mint SBT, because current we need `Signer` to generate `TransferPost` which contains lots of zkp proof information.

### Mint SBT

Here is a example of mint SBT steps:

1. initial wallet and signer.

> `getPolkadotSignerAndAddress` is the same as manta-pay sdk.

```js
    const privateWallet = await SbtMantaPrivateWallet.initSBT(privateWalletConfig);
    const polkadotConfig = await getPolkadotSignerAndAddress();

    await privateWallet.initalWalletSync();
```

2. reserve asest id before mint SBT.

```js
    const reserveSbt = await privateWallet.buildReserveSbt(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress);

    await reserveSbt.signAndSend(polkadotConfig.polkadotAddress);
```

3. Mint SBT by provide start asset id, number of token to mint, and metadata list.

> Notice: due to zkp proof extrinsic size is large than normal transaction, we current support at least 8 SBT in one batch.

```js
    const numberOfMints = 2;
    const metadata: string[] = [];
    for (let i = 0; i < numberOfMints; i++ ) {
        metadata.push(`YOUR METADAT INFO ${i.toString()}`)
    }

    const sbtMint = await privateWallet.buildSbtBatch(polkadotConfig.polkadotSigner, polkadotConfig.polkadotAddress, assetId, numberOfMints, metadata);    

    await sbtMint.batchTx.signAndSend(polkadotConfig.polkadotAddress);
```

### SBT Proof storage and verification

After user mint SBT, the return value including proof key of SBT, the concept of proof key can be reference to manta pay api documentation. Third party project should use these proof key and asset id returned from `buildSbtBatch` method, and call our backend service api to store the proof information:

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