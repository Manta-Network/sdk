use alloc::{
    string::{String},
};
use js_sys::{JsString};
use manta_accounting::{
    transfer::canonical,
};
use manta_accounting::asset::Asset;
use manta_pay::{
    config::{self},
};
use manta_util::{
    serde::{Deserialize, Serialize},
};
use wasm_bindgen::prelude::{wasm_bindgen, JsValue};
use crate::{decode, field_from_id_u128, from_js};

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde", deny_unknown_fields, transparent)]
#[wasm_bindgen]
pub struct Transaction(canonical::Transaction<config::Config>);

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde", deny_unknown_fields)]
enum LegacyTransaction {
    ToPrivate(LegacyAsset),
    //
}

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde", deny_unknown_fields)]
pub struct LegacyAsset {
    pub id: u128,
    pub value: u128
}

#[wasm_bindgen]
impl Transaction {
    /// Parses `Self` from a JS value.
    #[inline]
    #[wasm_bindgen(constructor)]
    pub fn new(value: JsValue) -> Transaction {
        from_js(value)
    }

    /// Parses `Self` from a [`String`].
    #[inline]
    pub fn from_string(value: String) -> Transaction {
        // convert id to correct AssetId type
        // 1. origin string: { "ToPrivate": { "id": ${asset_id}, "value": "${to_private_amount}" }}
        // 2. convert asset_id to [u8; 32] or Fp
        // 3. convert to Transaction
        let legacy_tx: LegacyTransaction = serde_json::from_str(&value).expect("Deserialization is not allowed to fail.");
        let inner_tx = match legacy_tx {
            LegacyTransaction::ToPrivate(legacy_asset) => {
                // let field = field_from_id_u128(legacy_asset.id);
                let asset = Asset {
                    // id: decode(field).expect("Fp convert should not failed."),
                    id: legacy_asset.id.into(),
                    value: legacy_asset.value
                };
                canonical::Transaction::ToPrivate(asset)
            }
        };
        Transaction(inner_tx)
    }

    /// Parses `Self` from a Javascript string.
    #[allow(dead_code)] // NOTE: We only care about this implementation if a type uses it.
    #[inline]
    pub(crate) fn from_js_string(value: JsString) -> canonical::Transaction<config::Config> {
        serde_json::from_str(&String::from(value))
            .expect("Deserialization is not allowed to fail.")
    }
}

impl AsRef<canonical::Transaction<config::Config>> for Transaction {
    #[inline]
    fn as_ref(&self) -> &canonical::Transaction<config::Config> {
        &self.0
    }
}

impl AsMut<canonical::Transaction<config::Config>> for Transaction {
    #[inline]
    fn as_mut(&mut self) -> &mut canonical::Transaction<config::Config> {
        &mut self.0
    }
}

impl From<canonical::Transaction<config::Config>> for Transaction {
    #[inline]
    fn from(this: canonical::Transaction<config::Config>) -> Self {
        Self(this)
    }
}

impl From<Transaction> for canonical::Transaction<config::Config> {
    #[inline]
    fn from(this: Transaction) -> Self {
        this.0
    }
}