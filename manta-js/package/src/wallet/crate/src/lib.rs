// Copyright 2019-2022 Manta Network.
// This file is part of manta-wallet.
//
// manta-wallet is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// manta-wallet is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with manta-wallet. If not, see <http://www.gnu.org/licenses/>.

//! Manta Pay Wallet

#![no_std]

extern crate alloc;
extern crate console_error_panic_hook;

use crate::types::*;
use alloc::{
    boxed::Box,
    format,
    rc::Rc,
    string::{String, ToString},
    vec::Vec,
};
use core::{cell::RefCell, fmt::Debug};
use js_sys::{JsString, Promise};
use manta_accounting::{
    asset,
    transfer::canonical,
    wallet::{
        self,
        ledger::{self, ReadResponse},
        signer::SyncData,
    },
};
use manta_crypto::signature::schnorr;
use manta_pay::{
    config::{self, utxo},
    signer,
};
use manta_util::{
    codec::Decode,
    future::LocalBoxFutureResult,
    http::reqwest,
    into_array_unchecked, ops,
    serde::{de::DeserializeOwned, Deserialize, Serialize},
    Array,
};
use wasm_bindgen::prelude::{wasm_bindgen, JsValue};
use wasm_bindgen_futures::future_to_promise;

mod types;

#[wasm_bindgen]
extern "C" {
    pub type Api;

    #[wasm_bindgen(structural, method)]
    async fn pull(this: &Api, checkpoint: JsValue) -> JsValue;

    #[wasm_bindgen(structural, method)]
    async fn push(this: &Api, posts: Vec<JsValue>) -> JsValue;
}

/// Serialize the borrowed `value` as a Javascript object.
#[inline]
fn borrow_js<T>(value: &T) -> JsValue
where
    T: Serialize,
{
    JsValue::from_serde(value).expect("Serialization is not allowed to fail.")
}

/// Serialize the owned `value` as a Javascript object.
#[inline]
fn into_js<T>(value: T) -> JsValue
where
    T: Serialize,
{
    borrow_js(&value)
}

/// Converts `value` into a value of type `T`.
#[inline]
pub fn from_js<T>(value: JsValue) -> T
where
    T: DeserializeOwned,
{
    value
        .into_serde()
        .expect("Deserialization is not allowed to fail.")
}

/// convert AssetId to String for js compatability (AssetID is 128 bit)
#[inline]
pub fn id_string_from_field(id: [u8; 32]) -> Option<String> {
    if u128::from_le_bytes(Array::from_iter(id[16..32].iter().copied()).into()) == 0 {
        String::from_utf8(id.to_vec()).ok()
    } else {
        None
    }
}

/// convert String to AssetId (Field)
#[inline]
pub fn field_from_id_string(id: String) -> [u8; 32] {
    into_array_unchecked(id.as_bytes())
}

/// convert u128 to AssetId (Field)
#[inline]
pub fn field_from_id_u128(id: u128) -> [u8; 32] {
    into_array_unchecked([id.to_le_bytes(), [0; 16]].concat())
}

/// Implements a JS-compatible wrapper for the given `$type`.
macro_rules! impl_js_compatible {
    ($name:ident, $type:ty, $doc:expr) => {
        #[doc = $doc]
        #[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
        #[serde(crate = "manta_util::serde", deny_unknown_fields, transparent)]
        #[wasm_bindgen]
        pub struct $name($type);

        #[wasm_bindgen]
        impl $name {
            /// Parses `Self` from a JS value.
            #[inline]
            #[wasm_bindgen(constructor)]
            pub fn new(value: JsValue) -> $name {
                from_js(value)
            }

            /// Parses `Self` from a [`String`].
            #[inline]
            pub fn from_string(value: String) -> $name {
                serde_json::from_str(&value).expect("Deserialization is not allowed to fail.")
            }

            /// Parses `Self` from a Javascript string.
            #[allow(dead_code)] // NOTE: We only care about this implementation if a type uses it.
            #[inline]
            pub(crate) fn from_js_string(value: JsString) -> $type {
                serde_json::from_str(&String::from(value))
                    .expect("Deserialization is not allowed to fail.")
            }
        }

        impl AsRef<$type> for $name {
            #[inline]
            fn as_ref(&self) -> &$type {
                &self.0
            }
        }

        impl AsMut<$type> for $name {
            #[inline]
            fn as_mut(&mut self) -> &mut $type {
                &mut self.0
            }
        }

        impl From<$type> for $name {
            #[inline]
            fn from(this: $type) -> Self {
                Self(this)
            }
        }

        impl From<$name> for $type {
            #[inline]
            fn from(this: $name) -> Self {
                this.0
            }
        }
    };
}

impl_js_compatible!(AssetId, utxo::AssetId, "AssetId");
impl_js_compatible!(
    Asset,
    manta_accounting::transfer::Asset<config::Config>,
    "Asset"
);
impl_js_compatible!(AssetMetadata, asset::AssetMetadata, "Asset Metadata");
impl_js_compatible!(
    Transaction,
    canonical::Transaction<config::Config>,
    "Transaction"
);
impl_js_compatible!(
    TransactionKind,
    canonical::TransactionKind<config::Config>,
    "Transaction Kind"
);
impl_js_compatible!(SenderPost, config::SenderPost, "Sender Post");
impl_js_compatible!(ReceiverPost, config::ReceiverPost, "Receiver Post");

impl_js_compatible!(ControlFlow, ops::ControlFlow, "Control Flow");
impl_js_compatible!(Network, signer::client::network::Network, "Network Type");

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde", deny_unknown_fields)]
pub struct RawAuthorizationSignature {
    /// Authorization Key
    pub authorization_key: [u8; 32],

    /// Signature
    pub signature: ([u8; 32], [u8; 32]),
}

impl TryFrom<RawAuthorizationSignature>
    for manta_accounting::transfer::AuthorizationSignature<config::Config>
{
    type Error = scale_codec::Error;

    #[inline]
    fn try_from(signature: RawAuthorizationSignature) -> Result<Self, Self::Error> {
        Ok(Self {
            authorization_key: group_decode(signature.authorization_key.to_vec())?,
            signature: schnorr::Signature {
                scalar: fp_decode(signature.signature.0.to_vec())?,
                nonce_point: group_decode(signature.signature.1.to_vec())?,
            },
        })
    }
}

impl TryFrom<JsString> for RawAuthorizationSignature {
    type Error = scale_codec::Error;

    #[inline]
    fn try_from(signature: JsString) -> Result<Self, Self::Error> {
        let sig_str = String::from(signature);
        let ref_slice = &sig_str.as_bytes();
        let arr: [u8; 32] = ref_slice[0..32].try_into().unwrap();
        let scala: [u8; 32] = ref_slice[32..64].try_into().unwrap();
        let group: [u8; 32] = ref_slice[64..96].try_into().unwrap();
        Ok(Self {
            authorization_key: decode(arr)?,
            signature: (decode(scala)?, decode(group)?),
        })
    }
}

/// Transfer Post
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde", deny_unknown_fields)]
#[wasm_bindgen]
pub struct TransferPost {
    /// Authorization Signature
    authorization_signature:
        Option<manta_accounting::transfer::AuthorizationSignature<config::Config>>,

    /// Asset Id
    asset_id: Option<AssetId>,

    /// Sources
    sources: Vec<RawAssetValue>,

    /// Sender Posts
    sender_posts: Vec<config::SenderPost>,

    /// Receiver Posts
    receiver_posts: Vec<config::ReceiverPost>,

    /// Sinks
    sinks: Vec<RawAssetValue>,

    /// Validity Proof
    proof: config::Proof,
}

#[wasm_bindgen]
impl TransferPost {
    /// Builds a new [`TransferPost`].
    #[inline]
    #[wasm_bindgen(constructor)]
    pub fn new(
        authorization_signature: Option<JsString>,
        asset_id: Option<String>,
        sources: Vec<JsValue>,
        sender_posts: Vec<JsValue>,
        receiver_posts: Vec<JsValue>,
        sinks: Vec<JsValue>,
        proof: JsValue,
    ) -> Self {
        Self {
            authorization_signature: authorization_signature.map(|x| {
                let raw: RawAuthorizationSignature = x.try_into().unwrap();
                raw.try_into().unwrap()
            }),
            asset_id: asset_id.map(|id| field_from_id_string(id)).map(|x| {
                AssetId(
                    Decode::decode(x)
                        .expect("Decoding a field element from [u8; 32] is not allowed to fail"),
                )
            }), 
            sources: sources.into_iter().map(from_js).collect(),
            sender_posts: sender_posts.into_iter().map(from_js).collect(),
            receiver_posts: receiver_posts.into_iter().map(from_js).collect(),
            sinks: sinks.into_iter().map(from_js).collect(),
            proof: from_js(proof),
        }
    }
}

impl From<config::TransferPost> for TransferPost {
    #[inline]
    fn from(post: config::TransferPost) -> Self {
        Self {
            authorization_signature: post.authorization_signature.map(Into::into),
            asset_id: post.body.asset_id.map(Into::into),
            sources: post
                .body
                .sources
                .into_iter()
                .map(|s| s.to_le_bytes())
                .collect(),
            sender_posts: post.body.sender_posts,
            receiver_posts: post.body.receiver_posts,
            sinks: post.body.sinks.into_iter().map(|s| s.to_le_bytes()).collect(),
            proof: post.body.proof,
        }
    }
}

/// Polkadot-JS API Ledger Connection
#[wasm_bindgen]
pub struct PolkadotJsLedger(Api);

#[wasm_bindgen]
impl PolkadotJsLedger {
    /// Builds a new [`PolkadotJsLedger`] from its JS [`Api`].
    #[inline]
    #[wasm_bindgen(constructor)]
    pub fn new(api: Api) -> Self {
        console_error_panic_hook::set_once();
        Self(api)
    }
}

/// Polkadot-JS API Ledger Connection Error
#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "manta_util::serde")]
#[wasm_bindgen]
pub struct LedgerError;

impl ledger::Connection for PolkadotJsLedger {
    type Error = LedgerError;
}

impl ledger::Read<SyncData<config::Config>> for PolkadotJsLedger {
    type Checkpoint = utxo::Checkpoint;

    #[inline]
    fn read<'s>(
        &'s mut self,
        checkpoint: &'s Self::Checkpoint,
    ) -> LocalBoxFutureResult<'s, ReadResponse<SyncData<config::Config>>, Self::Error> {
        Box::pin(async {
            Ok(
                from_js::<RawPullResponse>(self.0.pull(borrow_js(checkpoint)).await)
                    .try_into()
                    .expect("Conversion is not allowed to fail."),
            )
        })
    }
}

impl ledger::Write<Vec<config::TransferPost>> for PolkadotJsLedger {
    type Response = String;

    #[inline]
    fn write(
        &mut self,
        posts: Vec<config::TransferPost>,
    ) -> LocalBoxFutureResult<Self::Response, Self::Error> {
        Box::pin(async {
            from_js(
                self.0
                    .push(
                        posts
                            .into_iter()
                            .map(|p| into_js(TransferPost::from(p)))
                            .collect(),
                    )
                    .await,
            )
        })
    }
}

/// Signer Error
#[wasm_bindgen]
pub struct SignerError(reqwest::Error);

/// Signer Type
type SignerType = signer::client::http::Client;

/// Signer Client
#[wasm_bindgen]
pub struct Signer(SignerType);

#[wasm_bindgen]
impl Signer {
    /// Builds a new signer connection with the given `server_url`.
    #[inline]
    #[wasm_bindgen(constructor)]
    pub fn new(server_url: String) -> Option<Signer> {
        console_error_panic_hook::set_once();
        Some(Self(SignerType::new(server_url).ok()?))
    }
}

/// Wallet Error
#[wasm_bindgen]
pub struct WalletError(wallet::Error<manta_pay::config::Config, PolkadotJsLedger, SignerType>);

/// Wallet Type
type WalletType = signer::client::http::Wallet<PolkadotJsLedger>;

/// Wallet with Polkadot-JS API Connection
#[wasm_bindgen]
pub struct Wallet(Rc<RefCell<WalletType>>);

#[wasm_bindgen]
impl Wallet {
    /// Starts a new [`Wallet`] from existing `signer` and `ledger` connections.
    ///
    /// # Setting Up the Wallet
    ///
    /// Creating a [`Wallet`] using this method should be followed with a call to [`sync`] or
    /// [`recover`] to retrieve the current checkpoint and balance for this [`Wallet`]. If the
    /// backing `signer` is known to be already initialized, a call to [`sync`] is enough,
    /// otherwise, a call to [`recover`] is necessary to retrieve the full balance state.
    ///
    /// [`sync`]: Self::sync
    /// [`recover`]: Self::recover
    #[inline]
    #[wasm_bindgen(constructor)]
    pub fn new(ledger: PolkadotJsLedger, signer: Signer) -> Self {
        Self(Rc::new(RefCell::new(WalletType::new(ledger, signer.0))))
    }

    /// Returns the current balance associated with this `id`.
    #[inline]
    pub fn balance(&self, id: String) -> String {
        let asset_id = id.parse::<u128>().ok();
        let asset_id_type = asset_id
            .map(|id| field_from_id_u128(id))
            .map(|x| {
                Decode::decode(x)
                    .expect("Decoding a field element from [u8; 32] is not allowed to fail")
            })
            .expect("asset should have value");
        self.0.borrow().balance(&asset_id_type).to_string()
    }

    /// Returns true if `self` contains at least `asset.value` of the asset of kind `asset.id`.
    #[inline]
    pub fn contains(&self, asset: Asset) -> bool {
        self.0.borrow().contains(&asset.into())
    }

    /// Returns a shared reference to the balance state associated to `self`.
    #[inline]
    pub fn assets(&self) -> JsValue {
        borrow_js(self.0.borrow().assets())
    }

    /// Returns the [`Checkpoint`](ledger::Connection::Checkpoint) representing the current state
    /// of this wallet.
    #[inline]
    pub fn checkpoint(&self) -> JsValue {
        borrow_js(self.0.borrow().checkpoint())
    }

    /// Calls `f` on a mutably borrowed value of `self` converting the future into a JS [`Promise`].
    #[allow(clippy::await_holding_refcell_ref)] // NOTE: JS is single-threaded so we can't panic.
    #[inline]
    fn with_async<T, E, F>(&self, f: F) -> Promise
    where
        T: Serialize,
        E: Debug,
        F: 'static + for<'w> FnOnce(&'w mut WalletType) -> LocalBoxFutureResult<'w, T, E>,
    {
        let this = self.0.clone();
        let response = future_to_promise(async move {
            f(&mut this.borrow_mut())
                .await
                .map(into_js)
                .map_err(|err| into_js(format!("Error during asynchronous call: {err:?}")))
        });
        self.0.clone().borrow_mut().signer_mut().set_network(None);
        response
    }

    /// Performs full wallet recovery.
    ///
    /// # Failure Conditions
    ///
    /// This method returns an element of type [`Error`] on failure, which can result from any
    /// number of synchronization issues between the wallet, the ledger, and the signer. See the
    /// [`InconsistencyError`] type for more information on the kinds of errors that can occur and
    /// how to resolve them.
    ///
    /// [`Error`]: wallet::Error
    /// [`InconsistencyError`]: wallet::InconsistencyError
    #[inline]
    pub fn restart(&self, network: Network) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.signer_mut().set_network(Some(network.into()));
                let response = this.restart().await;
                this.signer_mut().set_network(None);
                response
            })
        })
    }

    /// Pulls data from the ledger, synchronizing the wallet and balance state. This method loops
    /// continuously calling [`sync_partial`](Self::sync_partial) until all the ledger data has
    /// arrived at and has been synchronized with the wallet.
    ///
    /// # Failure Conditions
    ///
    /// This method returns an element of type [`Error`] on failure, which can result from any
    /// number of synchronization issues between the wallet, the ledger, and the signer. See the
    /// [`InconsistencyError`] type for more information on the kinds of errors that can occur and
    /// how to resolve them.
    ///
    /// [`Error`]: wallet::Error
    /// [`InconsistencyError`]: wallet::InconsistencyError
    #[inline]
    pub fn sync(&self, network: Network) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.signer_mut().set_network(Some(network.into()));
                let response = this.sync().await;
                this.signer_mut().set_network(None);
                response
            })
        })
    }

    /// Pulls data from the ledger, synchronizing the wallet and balance state. This method returns
    /// a [`ControlFlow`] for matching against to determine if the wallet requires more
    /// synchronization.
    ///
    /// # Failure Conditions
    ///
    /// This method returns an element of type [`Error`] on failure, which can result from any
    /// number of synchronization issues between the wallet, the ledger, and the signer. See the
    /// [`InconsistencyError`] type for more information on the kinds of errors that can occur and
    /// how to resolve them.
    ///
    /// [`Error`]: wallet::Error
    /// [`InconsistencyError`]: wallet::InconsistencyError
    #[inline]
    pub fn sync_partial(&self, network: Network) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.signer_mut().set_network(Some(network.into()));
                let response = this.sync_partial().await;
                this.signer_mut().set_network(None);
                response
            })
        })
    }

    /// Checks if `transaction` can be executed on the balance state of `self`, returning the
    /// kind of update that should be performed on the balance state if the transaction is
    /// successfully posted to the ledger.
    ///
    /// # Safety
    ///
    /// This method is already called by [`post`](Self::post), but can be used by custom
    /// implementations to perform checks elsewhere.
    #[inline]
    pub fn check(&self, transaction: &Transaction) -> Result<TransactionKind, Asset> {
        // FIXME: Use a better API so we can remove the `clone`.
        self.check(&transaction.clone().into())
            .map(Into::into)
            .map_err(Into::into)
    }

    /// Signs the `transaction` using the signer connection, sending `metadata` and `network` for context. This
    /// method _does not_ automatically sychronize with the ledger. To do this, call the
    /// [`sync`](Self::sync) method separately.
    #[inline]
    pub fn sign(
        &self,
        transaction: Transaction,
        metadata: Option<AssetMetadata>,
        network: Network,
    ) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.signer_mut().set_network(Some(network.into()));
                let response = this
                    .sign(transaction.into(), metadata.map(Into::into))
                    .await
                    .map(|response| {
                        response
                            .posts
                            .into_iter()
                            .map(TransferPost::from)
                            .collect::<Vec<_>>()
                    });
                this.signer_mut().set_network(None);
                response
            })
        })
    }

    /// Posts a transaction to the ledger, returning a success [`Response`] if the `transaction`
    /// was successfully posted to the ledger. This method automatically synchronizes with the
    /// ledger before posting, _but not after_. To amortize the cost of future calls to [`post`],
    /// the [`sync`] method can be used to synchronize with the ledger.
    ///
    /// # Failure Conditions
    ///
    /// This method returns a [`Response`] when there were no errors in producing transfer data and
    /// sending and receiving from the ledger, but instead the ledger just did not accept the
    /// transaction as is. This could be caused by an external update to the ledger while the signer
    /// was building the transaction that caused the wallet and the ledger to get out of sync. In
    /// this case, [`post`] can safely be called again, to retry the transaction.
    ///
    /// This method returns an error in any other case. The internal state of the wallet is kept
    /// consistent between calls and recoverable errors are returned for the caller to handle.
    ///
    /// [`Response`]: ledger::Write::Response
    /// [`post`]: Self::post
    /// [`sync`]: Self::sync
    #[inline]
    pub fn post(
        &self,
        transaction: Transaction,
        metadata: Option<AssetMetadata>,
        network: Network,
    ) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.signer_mut().set_network(Some(network.into()));
                let response = this
                    .post(transaction.into(), metadata.map(Into::into))
                    .await;
                this.signer_mut().set_network(None);
                response
            })
        })
    }

    /// Returns public receiving keys according to the `request`.
    #[inline]
    pub fn receiving_keys(&self, network: Network) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.signer_mut().set_network(Some(network.into()));
                let response = this.address().await;
                this.signer_mut().set_network(None);
                response
            })
        })
    }

    /// Returns public receiving keys according to the `request`.
    #[inline]
    pub fn address(&self, network: Network) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.signer_mut().set_network(Some(network.into()));
                let response = this.address().await;
                this.signer_mut().set_network(None);
                response
            })
        })
    }
}
