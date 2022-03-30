#!/usr/bin/env ts-node
const typesLookup = require("./interfaces/types-lookup");
require("./interfaces/augment-api");
require("./interfaces/augment-types");

// external imports
const { ApiPromise, WsProvider } = require("@polkadot/api");
//import { createType } from '@polkadot/types';

const { Keyring } = require("@polkadot/keyring");
const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

// our local stuff
//import * as definitions from './interfaces/definitions';

async function main(): Promise<void> {
  // Initialise the provider to connect to the local node
  const provider = new WsProvider("ws://127.0.0.1:9800");

  // Create the API and wait until ready
  const api = await ApiPromise.create({ provider });

  // Constuct the keyring after the API (crypto has an async init)
  const keyring = new Keyring({ type: "sr25519" });

  // Add Alice to our keyring with a hard-deived path (empty phrase, so uses dev)
  const alice = keyring.addFromUri("//Alice");

  const post = {
    asset_id: null,
    sources: [1],
    sender_posts: [],
    receiver_posts: [
      {
        utxo: [
          62, 70, 248, 44, 178, 218, 105, 18, 254, 104, 229, 154, 247, 176, 23,
          71, 84, 178, 53, 239, 108, 86, 56, 92, 155, 89, 100, 12, 157, 85, 248,
          50,
        ],
        note: {
          ciphertext: [
            227, 211, 155, 202, 209, 220, 115, 205, 180, 29, 149, 45, 214, 30,
            38, 91, 220, 175, 207, 244, 135, 73, 226, 18, 1, 71, 224, 54, 120,
            249, 40, 216, 245, 204, 4, 93,
          ],
          ephemeral_public_key: [
            218, 6, 174, 44, 19, 199, 189, 128, 81, 91, 33, 111, 26, 181, 154,
            16, 231, 29, 246, 210, 76, 55, 16, 10, 2, 233, 214, 73, 208, 171,
            50, 98,
          ],
        },
      },
    ],
    sinks: [],
    validity_proof: [
      139, 26, 115, 116, 198, 101, 79, 253, 165, 59, 96, 157, 37, 23, 189, 109,
      143, 91, 235, 239, 181, 79, 123, 163, 156, 7, 203, 166, 106, 190, 37, 29,
      254, 24, 140, 38, 222, 88, 189, 182, 6, 46, 20, 172, 238, 46, 1, 140, 25,
      167, 224, 133, 121, 13, 150, 109, 153, 39, 88, 43, 33, 199, 251, 188, 159,
      79, 138, 7, 195, 33, 139, 254, 31, 1, 176, 127, 143, 187, 207, 115, 103,
      114, 249, 182, 112, 201, 95, 7, 206, 103, 62, 62, 68, 67, 148, 11, 68,
      206, 175, 112, 224, 89, 148, 13, 154, 91, 36, 186, 4, 185, 141, 254, 127,
      161, 156, 45, 53, 156, 193, 44, 217, 212, 99, 154, 135, 97, 118, 249, 67,
      50, 131, 223, 213, 64, 196, 206, 7, 15, 216, 164, 35, 249, 169, 4, 30,
      164, 81, 129, 83, 126, 76, 8, 247, 12, 196, 41, 236, 73, 81, 209, 112,
      241, 109, 19, 210, 120, 96, 202, 238, 247, 132, 233, 203, 153, 78, 27,
      166, 0, 106, 46, 4, 45, 106, 171, 86, 184, 46, 64, 75, 199, 92, 1,
    ],
  };

  const post2 = api.createType("PalletMantaPayTransferPost", post);

  console.log(post2);
  console.log(post2.assetId.toString());

  // Create a extrinsic, transferring 12345 units to Bob
  const transfer = api.tx.mantaPay.toPrivate(post2);

  // Sign and send the transaction using our account
  const hash = await transfer.signAndSend(alice);

  console.log("Transfer sent with hash", hash.toHex());
}

main()
  .catch(console.error)
  .finally(() => process.exit());
