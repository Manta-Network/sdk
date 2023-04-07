import * as $ from 'manta-scale-codec';
import { u8aToU8a } from '@polkadot/util';

export default $;

const $Asset = $.object(
  $.field('id', $.sizedUint8Array(32)),
  $.field('value', $.sizedUint8Array(16))
);

const $Utxo = $.object(
  $.field('is_transparent', $.bool),
  $.field('public_asset', $Asset),
  $.field('commitment', $.sizedUint8Array(32))
);

const $IncomingNote = $.object(
  $.field('ephemeral_public_key', $.sizedUint8Array(32)),
  $.field('tag', $.sizedUint8Array(32)),
  $.field('ciphertext', $.sizedArray($.sizedUint8Array(32), 3))
);

const $LightIncomingNote = $.object(
  $.field('ephemeral_public_key', $.sizedUint8Array(32)),
  $.field('ciphertext', $.sizedArray($.sizedUint8Array(32), 3))
);

const $FullIncomingNote = $.object(
  $.field('address_partition', $.u8),
  $.field('incoming_note', $IncomingNote),
  $.field('light_incoming_note', $LightIncomingNote)
);

const $OutgoingNote = $.object(
  $.field('ephemeral_public_key', $.sizedUint8Array(32)),
  $.field('ciphertext', $.sizedArray($.sizedUint8Array(32), 2))
);

export const $Receivers = $.array($.tuple($Utxo, $FullIncomingNote));
export const $Senders = $.array($.tuple($.sizedUint8Array(32), $OutgoingNote));

export const $Utxos = $.array($Utxo);

const $CurrentPath = $.object(
  $.field('sibling_digest', $.sizedUint8Array(32)),
  $.field('leaf_index', $.u32),
  $.field('inner_path', $.array($.sizedUint8Array(32)))
);

export const $CurrentPaths = $.array($CurrentPath);

// Converts an `light incoming note` into a JSON object.
function lightIncomingNoteToJson(note: any) {
  // [[u8; 32], 3]
  const ciphertext = note.ciphertext;
  const cipher0 = Array.from(ciphertext[0]);
  const cipher1 = Array.from(ciphertext[1]);
  const cipher2 = Array.from(ciphertext[2]);
  return {
    ephemeral_public_key: Array.from(u8aToU8a(note.ephemeral_public_key)),
    ciphertext: [cipher0, cipher1, cipher2],
  };
}

// Converts an `incoming note` into a JSON object.
function incomingNoteToJson(note: any) {
  // [[u8; 32]; 3]
  const ciphertext = note.ciphertext;
  const cipher0 = Array.from(ciphertext[0]);
  const cipher1 = Array.from(ciphertext[1]);
  const cipher2 = Array.from(ciphertext[2]);
  return {
    ephemeral_public_key: Array.from(u8aToU8a(note.ephemeral_public_key)),
    tag: Array.from(u8aToU8a(note.tag)),
    ciphertext: [cipher0, cipher1, cipher2],
  };
}

// Converts an `outgoing note` into a JSON object.
export function outgoingNoteToJson(note: any) {
  // [[u8; 32], 2]'
  const ciphertext = note.ciphertext;
  const cipher0 = Array.from(ciphertext[0]);
  const cipher1 = Array.from(ciphertext[1]);
  return {
    ephemeral_public_key: Array.from(u8aToU8a(note.ephemeral_public_key)),
    ciphertext: [cipher0, cipher1],
  };
}

// Converts an `full incoming note` into a JSON object.
export function fullIncomingNoteToJson(note: any) {
  return {
    address_partition: note.address_partition,
    incoming_note: incomingNoteToJson(note.incoming_note),
    light_incoming_note: lightIncomingNoteToJson(note.light_incoming_note),
  };
}

// Converts an `utxo` into a JSON object.
export function utxoToJson(utxo: any) {
  const asset_id = Array.from(u8aToU8a(utxo.public_asset.id));
  const asset_value = Array.from(u8aToU8a(utxo.public_asset.value));
  return {
    is_transparent: utxo.is_transparent,
    public_asset: {
      id: asset_id,
      value: asset_value,
    },
    commitment: Array.from(u8aToU8a(utxo.commitment)),
  };
}

export function currentPathToJson(currentPath: any) {
  const sibling_digest = Array.from(u8aToU8a(currentPath.sibling_digest));
  const leaf_index = currentPath.leaf_index;
  const inner_path = currentPath.inner_path.map((path: any) =>
    Array.from(u8aToU8a(path))
  );
  return {
    sibling_digest,
    leaf_index,
    inner_path,
  };
}
