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
        ledger::{self, PullResponse},
    },
};
use manta_pay::{
    config::{self, Config, EncryptedNote, Utxo, VoidNumber},
    signer::{self, Checkpoint},
};
use manta_util::{
    future::LocalBoxFutureResult,
    ops,
    serde::{de::DeserializeOwned, Deserialize, Serialize},
};
use wasm_bindgen::prelude::{wasm_bindgen, JsValue};
use wasm_bindgen_futures::future_to_promise;

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
fn from_js<T>(value: JsValue) -> T
where
    T: DeserializeOwned,
{
    value
        .into_serde()
        .expect("Deserialization is not allowed to fail.")
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

impl_js_compatible!(AssetId, asset::AssetId, "Asset Id");
impl_js_compatible!(AssetValue, asset::AssetValue, "Asset Value");
impl_js_compatible!(Asset, AssetType, "Asset");
impl_js_compatible!(AssetMetadata, asset::AssetMetadata, "Asset Metadata");
impl_js_compatible!(Transaction, TransactionType, "Transaction");
impl_js_compatible!(
    TransactionKind,
    canonical::TransactionKind,
    "Transaction Kind"
);
impl_js_compatible!(SenderPost, config::SenderPost, "Sender Post");
impl_js_compatible!(ReceiverPost, config::ReceiverPost, "Receiver Post");
impl_js_compatible!(ReceivingKey, config::ReceivingKey, "Receiving Key");
impl_js_compatible!(ReceivingKeyList, Vec<ReceivingKey>, "Receiving Key List");
impl_js_compatible!(
    ReceivingKeyRequest,
    signer::ReceivingKeyRequest,
    "Receiving Key Request"
);
impl_js_compatible!(ControlFlow, ops::ControlFlow, "Control Flow");

/// Asset Type
#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde", deny_unknown_fields)]
struct AssetType {
    /// Asset Id
    id: asset::AssetId,

    /// Asset Value
    ///
    /// This is meant to represent a value of type [`asset::AssetValue`] which is too big to fit
    /// into a Javascript integer. Because we don't have access to the Big Number APIs from Rust,
    /// we just send a `String` back and forth and have Javascript convert it into a numeric
    /// representation.
    value: String,
}

impl From<Asset> for asset::Asset {
    #[inline]
    fn from(asset: Asset) -> Self {
        Self {
            id: asset.0.id,
            value: asset::AssetValue(
                asset
                    .0
                    .value
                    .parse()
                    .expect("Parsing an asset value is not allowed to fail."),
            ),
        }
    }
}

impl From<asset::Asset> for Asset {
    #[inline]
    fn from(asset: asset::Asset) -> Asset {
        Self(AssetType {
            id: asset.id,
            value: asset.value.0.to_string(),
        })
    }
}

/// Transaction Types
#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde", deny_unknown_fields)]
enum TransactionType {
    /// Mint
    Mint(Asset),

    /// Private Transfer
    PrivateTransfer(Asset, config::ReceivingKey),

    /// Reclaim
    Reclaim(Asset),
}

impl From<Transaction> for config::Transaction {
    #[inline]
    fn from(transaction: Transaction) -> Self {
        match transaction.0 {
            TransactionType::Mint(asset) => Self::Mint(asset.into()),
            TransactionType::PrivateTransfer(asset, receiver) => {
                Self::PrivateTransfer(asset.into(), receiver)
            }
            TransactionType::Reclaim(asset) => Self::Reclaim(asset.into()),
        }
    }
}

/// Transfer Post
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde", deny_unknown_fields)]
#[wasm_bindgen]
pub struct TransferPost {
    /// Asset Id
    asset_id: Option<asset::AssetId>,

    /// Sources
    sources: Vec<String>,

    /// Sender Posts
    sender_posts: Vec<config::SenderPost>,

    /// Receiver Posts
    receiver_posts: Vec<config::ReceiverPost>,

    /// Sinks
    sinks: Vec<String>,

    /// Validity Proof
    validity_proof: config::Proof,
}

#[wasm_bindgen]
impl TransferPost {
    /// Builds a new [`TransferPost`].
    #[inline]
    #[wasm_bindgen(constructor)]
    pub fn new(
        asset_id: Option<AssetId>,
        sources: Vec<JsString>,
        sender_posts: Vec<JsValue>,
        receiver_posts: Vec<JsValue>,
        sinks: Vec<JsString>,
        validity_proof: JsValue,
    ) -> Self {
        Self {
            asset_id: asset_id.map(Into::into),
            sources: sources.into_iter().map(Into::into).collect(),
            sender_posts: sender_posts.into_iter().map(from_js).collect(),
            receiver_posts: receiver_posts.into_iter().map(from_js).collect(),
            sinks: sinks.into_iter().map(Into::into).collect(),
            validity_proof: from_js(validity_proof),
        }
    }
}

impl From<config::TransferPost> for TransferPost {
    #[inline]
    fn from(post: config::TransferPost) -> Self {
        Self {
            asset_id: post.asset_id.map(Into::into),
            sources: post.sources.into_iter().map(|s| s.to_string()).collect(),
            sender_posts: post.sender_posts,
            receiver_posts: post.receiver_posts,
            sinks: post.sinks.into_iter().map(|s| s.to_string()).collect(),
            validity_proof: post.validity_proof,
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

impl ledger::PullConfiguration<Config> for PolkadotJsLedger {
    type Checkpoint = Checkpoint;
    type ReceiverChunk = Vec<(Utxo, EncryptedNote)>;
    type SenderChunk = Vec<VoidNumber>;
}

impl ledger::Connection<Config> for PolkadotJsLedger {
    type PushResponse = String;
    type Error = LedgerError;

    #[inline]
    fn pull<'s>(
        &'s mut self,
        checkpoint: &'s Self::Checkpoint,
    ) -> LocalBoxFutureResult<'s, PullResponse<Config, Self>, Self::Error> {
        // TODO: Box::pin(async { from_js(self.0.pull(borrow_js(checkpoint)).await) })
        todo!()
    }

    #[inline]
    fn push(
        &mut self,
        posts: Vec<config::TransferPost>,
    ) -> LocalBoxFutureResult<Self::PushResponse, Self::Error> {
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
pub struct SignerError(signer::client::http::Error);

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
pub struct WalletError(wallet::Error<Config, PolkadotJsLedger, SignerType>);

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
    pub fn balance(&self, id: AssetId) -> String {
        self.0.borrow().balance(id.into()).to_string()
    }

    /// Returns true if `self` contains at least `asset.value` of the asset of kind `asset.id`.
    #[inline]
    pub fn contains(&self, asset: Asset) -> bool {
        self.0.borrow().contains(asset.into())
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

    /// Resets `self` to the default checkpoint and no balance. A call to this method should be
    /// followed by a call to [`sync`](Self::sync) to retrieve the correct checkpoint and balance.
    ///
    /// # Note
    ///
    /// This is not a "full wallet recovery" which would involve resetting the signer as well as
    /// this wallet state. See the [`recover`](Self::recover) method for more.
    #[inline]
    pub fn reset(&mut self) {
        self.0.borrow_mut().reset()
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
        future_to_promise(async move {
            f(&mut this.borrow_mut())
                .await
                .map(into_js)
                .map_err(|err| into_js(format!("Error during asynchronous call: {:?}", err)))
        })
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
    pub fn recover(&self) -> Promise {
        self.with_async(|this| Box::pin(async { this.recover().await }))
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
    pub fn sync(&self) -> Promise {
        self.with_async(|this| Box::pin(async { this.sync().await }))
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
    pub fn sync_partial(&self) -> Promise {
        self.with_async(|this| Box::pin(async { this.sync_partial().await }))
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
        self.0
            .borrow()
            .check(&transaction.clone().into())
            .map(Into::into)
            .map_err(Into::into)
    }

    /// Posts a transaction to the ledger, returning `true` if the `transaction` was successfully
    /// saved onto the ledger. This method automatically synchronizes with the ledger before
    /// posting, _but not after_. To amortize the cost of future calls to [`post`](Self::post), the
    /// [`sync`](Self::sync) method can be used to synchronize with the ledger.
    ///
    /// # Failure Conditions
    ///
    /// This method returns `false` when there were no errors in producing transfer data and
    /// sending and receiving from the ledger, but instead the ledger just did not accept the
    /// transaction as is. This could be caused by an external update to the ledger while the
    /// signer was building the transaction that caused the wallet and the ledger to get out of
    /// sync. In this case, [`post`](Self::post) can safely be called again, to retry the
    /// transaction.
    ///
    /// This method returns an error in any other case. The internal state of the wallet is kept
    /// consistent between calls and recoverable errors are returned for the caller to handle.
    #[inline]
    pub fn post(&self, transaction: Transaction, metadata: Option<AssetMetadata>) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.post(transaction.into(), metadata.map(Into::into))
                    .await
            })
        })
    }

    /// Returns public receiving keys according to the `request`.
    #[inline]
    pub fn receiving_keys(&self, request: ReceivingKeyRequest) -> Promise {
        self.with_async(|this| {
            Box::pin(async {
                this.receiving_keys(request.into())
                    .await
                    .map(|keys| ReceivingKeyList(keys.into_iter().map(Into::into).collect()))
            })
        })
    }
}
