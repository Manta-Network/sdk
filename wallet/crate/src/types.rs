use alloc::{boxed::Box, vec::Vec};
use core::fmt::Debug;
use manta_accounting::wallet::{ledger::ReadResponse, signer::SyncData};
use manta_crypto::{
    encryption::{hybrid, EmptyHeader},
    permutation::duplex,
};
use manta_crypto::arkworks::constraint::fp::Fp;
use manta_crypto::arkworks::algebra::Group;
use manta_crypto::arkworks::ec::ProjectiveCurve;
use manta_pay::{
    config::{
        self,
        utxo::{self, Config},
    },
    crypto::poseidon::encryption::{self, BlockArray, CiphertextBlock},
};
use manta_util::{
    serde::{Deserialize, Serialize},
    serde_with, BoxArray,
};
use manta_util::codec::Encode;
use scale_codec::Error;

/// Decodes the `bytes` array of the given length `N` into the SCALE decodable type `T` returning a
/// blanket error if decoding fails.
#[inline]
pub fn decode<T, const N: usize>(bytes: [u8; N]) -> Result<T, scale_codec::Error>
where
    T: scale_codec::Decode,
{
    T::decode(&mut bytes.as_slice())
}

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub enum UtxoTransparency {
    Opaque,
    Transparent,
}

pub type RawAssetId = [u8; 32];

pub type RawAssetValue = u128;

pub type RawUtxoCommitment = [u8; 32];

pub fn fp_decode<T>(bytes: Vec<u8>) -> Result<Fp<T>, scale_codec::Error>
    where T: manta_crypto::arkworks::ff::Field
{
    Fp::try_from(bytes).map_err(|_e| scale_codec::Error::from("Fp Serialize"))
}

pub fn group_decode<T>(bytes: Vec<u8>) -> Result<Group<T>, scale_codec::Error>
    where T: ProjectiveCurve
{
    Group::try_from(bytes).map_err(|_e| scale_codec::Error::from("Group Serialize"))
}

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawAsset {
    /// Asset Id
    pub id: RawAssetId,

    /// Asset Value
    pub value: RawAssetValue,
}

impl TryFrom<RawAsset> for config::Asset {
    type Error = Error;

    #[inline]
    fn try_from(asset: RawAsset) -> Result<Self, Self::Error> {
        Ok(Self {
            id: fp_decode(asset.id.to_vec())?,
            value: asset.value,
        })
    }
}

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawNullifierCommitment {
    pub commitment: [u8; 32],
}

/// Raw UTXO Type
#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawUtxo {
    /// Transparency Flag: 
    pub transparency: UtxoTransparency,
    // pub transparency: bool,

    /// Public Asset: 40 bytes
    pub public_asset: RawAsset,

    /// UTXO Commitment: 32 bytes
    pub commitment: RawUtxoCommitment,
}

impl RawUtxo {
    #[inline]
    pub fn try_into(self) -> Result<utxo::Utxo, Error> {
        let is_transparency = match self.transparency {
            UtxoTransparency::Transparent => true,
            UtxoTransparency::Opaque => false,
        };
        Ok(utxo::Utxo {
            is_transparent: is_transparency,
            // is_transparent: self.transparency,
            public_asset: self.public_asset.try_into()?,
            commitment: fp_decode(self.commitment.to_vec())?,
        })
    }
}

/// Raw Encrypted Note
#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawLightIncomingNote {
    /// Ephemeral Public Key
    pub ephemeral_public_key: [u8; 32],

    /// Ciphertext
    #[serde(with = "serde_with::As::<[serde_with::Same; 96]>")]
    pub ciphertext: [u8; 96],
}

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawIncomingNote {
    /// Ephemeral Public Key
    pub ephemeral_public_key: [u8; 32],

    // Tag
    pub tag: [u8; 32],

    /// Ciphertext
    #[serde(with = "serde_with::As::<[[serde_with::Same; 32]; 3]>")]
    pub ciphertext: [[u8; 32]; 3],
}

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawOutgoingNote {
    /// Ephemeral Public Key
    pub ephemeral_public_key: [u8; 32],

    /// Ciphertext
    #[serde(with = "serde_with::As::<[[serde_with::Same; 32]; 2]>")]
    pub ciphertext: [[u8; 32]; 2],
}

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawNulllifier {
    pub nullifier: RawNullifierCommitment,
    pub outgoing_note: RawOutgoingNote,
}

impl TryFrom<RawNullifierCommitment> for manta_accounting::transfer::utxo::protocol::Nullifier<Config> {
    type Error = scale_codec::Error;

    #[inline]
    fn try_from(commitment: RawNullifierCommitment) -> Result<Self, Self::Error> {
        Ok(Self {
            commitment: fp_decode(commitment.commitment.to_vec())?,
        })
    }
}

#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawFullIncomingNote {
    raw_address_partition: u8,
    raw_incoming_note: RawIncomingNote,
    raw_light_incoming_note: RawLightIncomingNote,
}

impl TryFrom<RawFullIncomingNote> for utxo::FullIncomingNote {
    type Error = scale_codec::Error;

    #[inline]
    fn try_from(encrypted_note: RawFullIncomingNote) -> Result<Self, Self::Error> {
        Ok(Self {
            address_partition: encrypted_note.raw_address_partition,
            incoming_note: utxo::IncomingNote {
                header: EmptyHeader::default(),
                ciphertext: hybrid::Ciphertext {
                    ephemeral_public_key: group_decode(
                        encrypted_note.raw_incoming_note.ephemeral_public_key.to_vec(),
                    )?,
                    ciphertext: duplex::Ciphertext {
                        tag: encryption::Tag(fp_decode(encrypted_note.raw_incoming_note.tag.to_vec())?),
                        message: BlockArray(BoxArray(Box::new([CiphertextBlock(
                            encrypted_note
                                .raw_incoming_note
                                .ciphertext
                                .into_iter()
                                .map(|x| fp_decode(x.to_vec()))
                                .collect::<Result<Vec<_>, _>>()?
                                .into(),
                        )]))),
                    },
                },
            },
            light_incoming_note: utxo::LightIncomingNote {
                header: EmptyHeader::default(),
                ciphertext: hybrid::Ciphertext {
                    ephemeral_public_key: group_decode(
                        encrypted_note.raw_light_incoming_note.ephemeral_public_key.to_vec(),
                    )?,
                    ciphertext: encrypted_note.raw_light_incoming_note.ciphertext.into(),
                },
            },
        })
    }
}

impl TryFrom<RawOutgoingNote> for utxo::OutgoingNote {
    type Error = Error;

    #[inline]
    fn try_from(note: RawOutgoingNote) -> Result<Self, Self::Error> {
        let mut array_ = [0u8; 64];
        let mut ind = 0;
        for i in note.ciphertext {
            for j in i {
                array_[ind as usize] = j;
                ind += 1;
            }
        }
        let decoded: [u8; 64] = decode(array_).unwrap();
        Ok(Self {
            header: EmptyHeader::default(),
            ciphertext: hybrid::Ciphertext {
                ephemeral_public_key: group_decode(note.ephemeral_public_key.to_vec())?,
                ciphertext: decoded.into(),
            },
        })
    }
}

impl RawNulllifier {
    #[inline]
    pub fn try_into(self) -> Result<utxo::Nullifier, Error> {
        Ok(utxo::Nullifier {
            nullifier: self.nullifier.try_into()?,
            outgoing_note: self.outgoing_note.try_into()?,
        })
    }
}

/// Raw Pull Response
#[derive(Clone, Debug, Deserialize, Eq, Hash, PartialEq, Serialize)]
#[serde(crate = "manta_util::serde")]
pub struct RawPullResponse {
    /// Should Continue Flag
    pub should_continue: bool,

    /// Receiver Data
    pub receivers: Vec<(RawUtxo, RawFullIncomingNote)>,

    /// Sender Data
    pub senders: Vec<(RawUtxoCommitment, RawOutgoingNote)>,
}

impl TryFrom<RawPullResponse> for ReadResponse<SyncData<config::Config>> {
    type Error = ();

    #[inline]
    fn try_from(response: RawPullResponse) -> Result<Self, Self::Error> {
        Ok(Self {
            should_continue: response.should_continue,
            data: SyncData {
                utxo_note_data: response
                    .receivers
                    .into_iter()
                    .map(|(utxo, encrypted_note)| {
                        utxo.try_into()
                            .and_then(|u| encrypted_note.try_into().map(|n| (u, n)))
                    })
                    .collect::<Result<Vec<_>, _>>()
                    .map_err(|_| ())?,
                nullifier_data: response
                    .senders
                    .into_iter()
                    .map(|(comm, note)| {
                        let nullifier = RawNulllifier {
                            nullifier: RawNullifierCommitment { commitment: comm },
                            outgoing_note: note
                                .try_into()
                                .expect("Outgoing note convert should not failed"),
                        };
                        nullifier.try_into()
                    }) // check type
                    .collect::<Result<Vec<_>, _>>()
                    .map_err(|_| ())?,
            },
        })
    }
}
