// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from "@polkadot/api-base/types";
import type {
  BTreeMap,
  Bytes,
  Null,
  Option,
  U8aFixed,
  Vec,
  WrapperKeepOpaque,
  bool,
  u128,
  u16,
  u32,
  u64,
  u8,
} from "@polkadot/types-codec";
import type { AnyNumber, ITuple } from "@polkadot/types-codec/types";
import type {
  AccountId32,
  Call,
  H256,
} from "@polkadot/types/interfaces/runtime";
import type {
  CumulusPalletDmpQueueConfigData,
  CumulusPalletDmpQueuePageIndexData,
  CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot,
  CumulusPalletXcmpQueueInboundChannelDetails,
  CumulusPalletXcmpQueueOutboundChannelDetails,
  CumulusPalletXcmpQueueQueueConfigData,
  DolphinRuntimeOpaqueSessionKeys,
  FrameSupportWeightsPerDispatchClassU64,
  FrameSystemAccountInfo,
  FrameSystemEventRecord,
  FrameSystemLastRuntimeUpgradeInfo,
  FrameSystemPhase,
  MantaCollatorSelectionCandidateInfo,
  MantaPrimitivesAssetsAssetLocation,
  MantaPrimitivesAssetsAssetRegistarMetadata,
  PalletAssetsApproval,
  PalletAssetsAssetAccount,
  PalletAssetsAssetDetails,
  PalletAssetsAssetMetadata,
  PalletAuthorshipUncleEntryItem,
  PalletBalancesAccountData,
  PalletBalancesBalanceLock,
  PalletBalancesReleases,
  PalletBalancesReserveData,
  PalletCollectiveVotes,
  PalletDemocracyPreimageStatus,
  PalletDemocracyReferendumInfo,
  PalletDemocracyReleases,
  PalletDemocracyVoteThreshold,
  PalletDemocracyVoteVoting,
  PalletMantaPayEncryptedNote,
  PalletMantaPayUtxoMerkleTreePath,
  PalletMultisigMultisig,
  PalletPreimageRequestStatus,
  PalletSchedulerScheduledV3,
  PalletTransactionPaymentReleases,
  PalletTreasuryProposal,
  PalletXcmQueryStatus,
  PalletXcmVersionMigrationStage,
  PolkadotCorePrimitivesOutboundHrmpMessage,
  PolkadotPrimitivesV1AbridgedHostConfiguration,
  PolkadotPrimitivesV1PersistedValidationData,
  PolkadotPrimitivesV1UpgradeRestriction,
  SpConsensusAuraSr25519AppSr25519Public,
  SpCoreCryptoKeyTypeId,
  SpRuntimeDigest,
  XcmVersionedMultiLocation,
} from "@polkadot/types/lookup";
import type { Observable } from "@polkadot/types/types";

declare module "@polkadot/api-base/types/storage" {
  export interface AugmentedQueries<ApiType extends ApiTypes> {
    assetManager: {
      /**
       * AssetId to MultiLocation Map. This is mostly useful when sending an
       * asset to a foreign location.
       */
      assetIdLocation: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<XcmVersionedMultiLocation>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * AssetId to AssetRegistrar Map.
       */
      assetIdMetadata: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<MantaPrimitivesAssetsAssetRegistarMetadata>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * MultiLocation to AssetId Map. This is mostly useful when receiving an
       * asset from a foreign location.
       */
      locationAssetId: AugmentedQuery<
        ApiType,
        (
          arg:
            | MantaPrimitivesAssetsAssetLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array
        ) => Observable<Option<u32>>,
        [MantaPrimitivesAssetsAssetLocation]
      > &
        QueryableStorageEntry<ApiType, [MantaPrimitivesAssetsAssetLocation]>;
      /**
       * Get the next available AssetId.
       */
      nextAssetId: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * XCM transfer cost for different asset.
       */
      unitsPerSecond: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<u128>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    assets: {
      /**
       * The holdings of a specific account for a specific asset.
       */
      account: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletAssetsAssetAccount>>,
        [u32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u32, AccountId32]>;
      /**
       * Approved balance transfers. First balance is the amount approved for
       * transfer. Second is the amount of `T::Currency` reserved for storing
       * this. First key is the asset ID, second key is the owner and third key
       * is the delegate.
       */
      approvals: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: AccountId32 | string | Uint8Array,
          arg3: AccountId32 | string | Uint8Array
        ) => Observable<Option<PalletAssetsApproval>>,
        [u32, AccountId32, AccountId32]
      > &
        QueryableStorageEntry<ApiType, [u32, AccountId32, AccountId32]>;
      /**
       * Details of an asset.
       */
      asset: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletAssetsAssetDetails>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Metadata of an asset.
       */
      metadata: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<PalletAssetsAssetMetadata>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    aura: {
      /**
       * The current authority set.
       */
      authorities: AugmentedQuery<
        ApiType,
        () => Observable<Vec<SpConsensusAuraSr25519AppSr25519Public>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current slot of this block.
       *
       * This will be set in `on_initialize`.
       */
      currentSlot: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    auraExt: {
      /**
       * Serves as cache for the authorities.
       *
       * The authorities in AuRa are overwritten in `on_initialize` when we
       * switch to a new session, but we require the old authorities to verify
       * the seal when validating a PoV. This will always be updated to the
       * latest AuRa authorities in `on_finalize`.
       */
      authorities: AugmentedQuery<
        ApiType,
        () => Observable<Vec<SpConsensusAuraSr25519AppSr25519Public>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    authorship: {
      /**
       * Author of current block.
       */
      author: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Whether uncles were already set in this block.
       */
      didSetUncles: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Uncles
       */
      uncles: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PalletAuthorshipUncleEntryItem>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    balances: {
      /**
       * The balance of an account.
       *
       * NOTE: This is only used in the case that this pallet is used to store balances.
       */
      account: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<PalletBalancesAccountData>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Any liquidity locks on some account balances. NOTE: Should only be
       * accessed when setting, changing and freeing a lock.
       */
      locks: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<PalletBalancesBalanceLock>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Named reserves on some account balances.
       */
      reserves: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Vec<PalletBalancesReserveData>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Storage version of the pallet.
       *
       * This is set to v2.0.0 for new networks.
       */
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<PalletBalancesReleases>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The total units issued in the system.
       */
      totalIssuance: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    collatorSelection: {
      /**
       * Fixed deposit bond for each candidate.
       */
      candidacyBond: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The (community, limited) collation candidates.
       */
      candidates: AugmentedQuery<
        ApiType,
        () => Observable<Vec<MantaCollatorSelectionCandidateInfo>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Desired number of candidates.
       *
       * This should ideally always be less than [`Config::MaxCandidates`] for
       * weights to be correct.
       */
      desiredCandidates: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The invulnerable, fixed collators.
       */
      invulnerables: AugmentedQuery<
        ApiType,
        () => Observable<Vec<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Last block authored by collator.
       */
      lastAuthoredBlock: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<u32>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    council: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       */
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The prime member that helps determine the default vote behavior in case
       * of absentations.
       */
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Proposals so far.
       */
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Actual proposal for a given hash, if it's current.
       */
      proposalOf: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<Option<Call>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The hashes of the active proposals.
       */
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Votes on a given proposal, if it is ongoing.
       */
      voting: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletCollectiveVotes>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    councilMembership: {
      /**
       * The current membership, stored as an ordered Vec.
       */
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current prime member, if one exists.
       */
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    democracy: {
      /**
       * A record of who vetoed what. Maps proposal hash to a possible existent
       * block number (until when it may not be resubmitted) and who vetoed it.
       */
      blacklist: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<ITuple<[u32, Vec<AccountId32>]>>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * Record of all proposals that have been subject to emergency cancellation.
       */
      cancellations: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<bool>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * Those who have locked a deposit.
       *
       * TWOX-NOTE: Safe, as increasing integer keys are safe.
       */
      depositOf: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<ITuple<[Vec<AccountId32>, u128]>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * True if the last referendum tabled was submitted externally. False if
       * it was a public proposal.
       */
      lastTabledWasExternal: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Accounts for which there are locks in action which may be removed at
       * some point in the future. The value is the block number at which the
       * lock expires and may be removed.
       *
       * TWOX-NOTE: OK ― `AccountId` is a secure hash.
       */
      locks: AugmentedQuery<
        ApiType,
        (arg: AccountId32 | string | Uint8Array) => Observable<Option<u32>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * The lowest referendum index representing an unbaked referendum. Equal
       * to `ReferendumCount` if there isn't a unbaked referendum.
       */
      lowestUnbaked: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The referendum to be tabled whenever it would be valid to table an
       * external proposal. This happens when a referendum needs to be tabled
       * and one of two conditions are met:
       *
       * - `LastTabledWasExternal` is `false`; or
       * - `PublicProps` is empty.
       */
      nextExternal: AugmentedQuery<
        ApiType,
        () => Observable<Option<ITuple<[H256, PalletDemocracyVoteThreshold]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Map of hashes to the proposal preimage, along with who registered it
       * and their deposit. The block number is the block at which it was deposited.
       */
      preimages: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletDemocracyPreimageStatus>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The number of (public) proposals that have been made so far.
       */
      publicPropCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The public proposals. Unsorted. The second item is the proposal's hash.
       */
      publicProps: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[u32, H256, AccountId32]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The next free referendum index, aka the number of referenda started so far.
       */
      referendumCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Information concerning any given referendum.
       *
       * TWOX-NOTE: SAFE as indexes are not under an attacker’s control.
       */
      referendumInfoOf: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletDemocracyReferendumInfo>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Storage version of the pallet.
       *
       * New networks start with last version.
       */
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<Option<PalletDemocracyReleases>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * All votes for a particular voter. We store the balance for the number
       * of votes that we have recorded. The second item is the total amount of
       * delegations, that will be added.
       *
       * TWOX-NOTE: SAFE as `AccountId`s are crypto hashes anyway.
       */
      votingOf: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<PalletDemocracyVoteVoting>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    dmpQueue: {
      /**
       * The configuration.
       */
      configuration: AugmentedQuery<
        ApiType,
        () => Observable<CumulusPalletDmpQueueConfigData>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The overweight messages.
       */
      overweight: AugmentedQuery<
        ApiType,
        (
          arg: u64 | AnyNumber | Uint8Array
        ) => Observable<Option<ITuple<[u32, Bytes]>>>,
        [u64]
      > &
        QueryableStorageEntry<ApiType, [u64]>;
      /**
       * The page index.
       */
      pageIndex: AugmentedQuery<
        ApiType,
        () => Observable<CumulusPalletDmpQueuePageIndexData>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The queue pages.
       */
      pages: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Vec<ITuple<[u32, Bytes]>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    mantaPay: {
      /**
       * Shards of the merkle tree
       */
      shards: AugmentedQuery<
        ApiType,
        (
          arg1: u8 | AnyNumber | Uint8Array,
          arg2: u64 | AnyNumber | Uint8Array
        ) => Observable<ITuple<[Bytes, PalletMantaPayEncryptedNote]>>,
        [u8, u64]
      > &
        QueryableStorageEntry<ApiType, [u8, u64]>;
      /**
       * Shard trees
       */
      shardTrees: AugmentedQuery<
        ApiType,
        (
          arg: u8 | AnyNumber | Uint8Array
        ) => Observable<PalletMantaPayUtxoMerkleTreePath>,
        [u8]
      > &
        QueryableStorageEntry<ApiType, [u8]>;
      /**
       * Outputs of Utxo accumulator
       */
      utxoAccumulatorOutputs: AugmentedQuery<
        ApiType,
        (arg: Bytes | string | Uint8Array) => Observable<Null>,
        [Bytes]
      > &
        QueryableStorageEntry<ApiType, [Bytes]>;
      /**
       * Utxo set
       */
      utxoSet: AugmentedQuery<
        ApiType,
        (arg: Bytes | string | Uint8Array) => Observable<Null>,
        [Bytes]
      > &
        QueryableStorageEntry<ApiType, [Bytes]>;
      /**
       * Void number set
       */
      voidNumberSet: AugmentedQuery<
        ApiType,
        (arg: Bytes | string | Uint8Array) => Observable<Null>,
        [Bytes]
      > &
        QueryableStorageEntry<ApiType, [Bytes]>;
      /**
       * Void number set insertion order
       */
      voidNumberSetInsertionOrder: AugmentedQuery<
        ApiType,
        (arg: u64 | AnyNumber | Uint8Array) => Observable<Bytes>,
        [u64]
      > &
        QueryableStorageEntry<ApiType, [u64]>;
      /**
       * Void number set size
       */
      voidNumberSetSize: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    multisig: {
      calls: AugmentedQuery<
        ApiType,
        (
          arg: U8aFixed | string | Uint8Array
        ) => Observable<
          Option<ITuple<[WrapperKeepOpaque<Call>, AccountId32, u128]>>
        >,
        [U8aFixed]
      > &
        QueryableStorageEntry<ApiType, [U8aFixed]>;
      /**
       * The set of open multisig operations.
       */
      multisigs: AugmentedQuery<
        ApiType,
        (
          arg1: AccountId32 | string | Uint8Array,
          arg2: U8aFixed | string | Uint8Array
        ) => Observable<Option<PalletMultisigMultisig>>,
        [AccountId32, U8aFixed]
      > &
        QueryableStorageEntry<ApiType, [AccountId32, U8aFixed]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    parachainInfo: {
      parachainId: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    parachainSystem: {
      /**
       * The number of HRMP messages we observed in `on_initialize` and thus
       * used that number for announcing the weight of `on_initialize` and `on_finalize`.
       */
      announcedHrmpMessagesPerCandidate: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The next authorized upgrade, if there is one.
       */
      authorizedUpgrade: AugmentedQuery<
        ApiType,
        () => Observable<Option<H256>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * A custom head data that should be returned as result of `validate_block`.
       *
       * See [`Pallet::set_custom_validation_head_data`] for more information.
       */
      customValidationHeadData: AugmentedQuery<
        ApiType,
        () => Observable<Option<Bytes>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Were the validation data set to notify the relay chain?
       */
      didSetValidationCode: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The parachain host configuration that was obtained from the relay parent.
       *
       * This field is meant to be updated each block with the validation data
       * inherent. Therefore, before processing of the inherent, e.g. in
       * `on_initialize` this data may be stale.
       *
       * This data is also absent from the genesis.
       */
      hostConfiguration: AugmentedQuery<
        ApiType,
        () => Observable<Option<PolkadotPrimitivesV1AbridgedHostConfiguration>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * HRMP messages that were sent in a block.
       *
       * This will be cleared in `on_initialize` of each new block.
       */
      hrmpOutboundMessages: AugmentedQuery<
        ApiType,
        () => Observable<Vec<PolkadotCorePrimitivesOutboundHrmpMessage>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * HRMP watermark that was set in a block.
       *
       * This will be cleared in `on_initialize` of each new block.
       */
      hrmpWatermark: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The last downward message queue chain head we have observed.
       *
       * This value is loaded before and saved after processing inbound downward
       * messages carried by the system inherent.
       */
      lastDmqMqcHead: AugmentedQuery<ApiType, () => Observable<H256>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The message queue chain heads we have observed per each channel incoming channel.
       *
       * This value is loaded before and saved after processing inbound downward
       * messages carried by the system inherent.
       */
      lastHrmpMqcHeads: AugmentedQuery<
        ApiType,
        () => Observable<BTreeMap<u32, H256>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Validation code that is set by the parachain and is to be communicated
       * to collator and consequently the relay-chain.
       *
       * This will be cleared in `on_initialize` of each new block if no other
       * pallet already set the value.
       */
      newValidationCode: AugmentedQuery<
        ApiType,
        () => Observable<Option<Bytes>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Upward messages that are still pending and not yet send to the relay chain.
       */
      pendingUpwardMessages: AugmentedQuery<
        ApiType,
        () => Observable<Vec<Bytes>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * In case of a scheduled upgrade, this storage field contains the
       * validation code to be applied.
       *
       * As soon as the relay chain gives us the go-ahead signal, we will
       * overwrite the `:code` which will result the next block process with the
       * new validation code. This concludes the upgrade process.
       */
      pendingValidationCode: AugmentedQuery<
        ApiType,
        () => Observable<Bytes>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Number of downward messages processed in a block.
       *
       * This will be cleared in `on_initialize` of each new block.
       */
      processedDownwardMessages: AugmentedQuery<
        ApiType,
        () => Observable<u32>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The snapshot of some state related to messaging relevant to the current
       * parachain as per the relay parent.
       *
       * This field is meant to be updated each block with the validation data
       * inherent. Therefore, before processing of the inherent, e.g. in
       * `on_initialize` this data may be stale.
       *
       * This data is also absent from the genesis.
       */
      relevantMessagingState: AugmentedQuery<
        ApiType,
        () => Observable<
          Option<CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot>
        >,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The weight we reserve at the beginning of the block for processing DMP
       * messages. This overrides the amount set in the Config trait.
       */
      reservedDmpWeightOverride: AugmentedQuery<
        ApiType,
        () => Observable<Option<u64>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The weight we reserve at the beginning of the block for processing XCMP
       * messages. This overrides the amount set in the Config trait.
       */
      reservedXcmpWeightOverride: AugmentedQuery<
        ApiType,
        () => Observable<Option<u64>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * An option which indicates if the relay-chain restricts signalling a
       * validation code upgrade. In other words, if this is `Some` and
       * [`NewValidationCode`] is `Some` then the produced candidate will be invalid.
       *
       * This storage item is a mirror of the corresponding value for the
       * current parachain from the relay-chain. This value is ephemeral which
       * means it doesn't hit the storage. This value is set after the inherent.
       */
      upgradeRestrictionSignal: AugmentedQuery<
        ApiType,
        () => Observable<Option<PolkadotPrimitivesV1UpgradeRestriction>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Upward messages that were sent in a block.
       *
       * This will be cleared in `on_initialize` of each new block.
       */
      upwardMessages: AugmentedQuery<
        ApiType,
        () => Observable<Vec<Bytes>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The [`PersistedValidationData`] set for this block. This value is
       * expected to be set only once per block and it's never stored in the trie.
       */
      validationData: AugmentedQuery<
        ApiType,
        () => Observable<Option<PolkadotPrimitivesV1PersistedValidationData>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    polkadotXcm: {
      /**
       * The existing asset traps.
       *
       * Key is the blake2 256 hash of (origin, versioned `MultiAssets`) pair.
       * Value is the number of times this pair has been trapped (usually just 1
       * if it exists at all).
       */
      assetTraps: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<u32>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The current migration's stage, if any.
       */
      currentMigration: AugmentedQuery<
        ApiType,
        () => Observable<Option<PalletXcmVersionMigrationStage>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The ongoing queries.
       */
      queries: AugmentedQuery<
        ApiType,
        (
          arg: u64 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletXcmQueryStatus>>,
        [u64]
      > &
        QueryableStorageEntry<ApiType, [u64]>;
      /**
       * The latest available query index.
       */
      queryCounter: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Default version to encode XCM when latest version of destination is
       * unknown. If `None`, then the destinations whose XCM version is unknown
       * are considered unreachable.
       */
      safeXcmVersion: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The Latest versions that we know various locations support.
       */
      supportedVersion: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array
        ) => Observable<Option<u32>>,
        [u32, XcmVersionedMultiLocation]
      > &
        QueryableStorageEntry<ApiType, [u32, XcmVersionedMultiLocation]>;
      /**
       * Destinations whose latest XCM version we would like to know. Duplicates
       * not allowed, and the `u32` counter is the number of times that a send
       * to the destination has been attempted, which is used as a prioritization.
       */
      versionDiscoveryQueue: AugmentedQuery<
        ApiType,
        () => Observable<Vec<ITuple<[XcmVersionedMultiLocation, u32]>>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * All locations that we have requested version notifications from.
       */
      versionNotifiers: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array
        ) => Observable<Option<u64>>,
        [u32, XcmVersionedMultiLocation]
      > &
        QueryableStorageEntry<ApiType, [u32, XcmVersionedMultiLocation]>;
      /**
       * The target locations that are subscribed to our version changes, as
       * well as the most recent of our versions we informed them of.
       */
      versionNotifyTargets: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array
        ) => Observable<Option<ITuple<[u64, u64, u32]>>>,
        [u32, XcmVersionedMultiLocation]
      > &
        QueryableStorageEntry<ApiType, [u32, XcmVersionedMultiLocation]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    preimage: {
      /**
       * The preimages stored by this pallet.
       */
      preimageFor: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<Option<Bytes>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The request status of a given hash.
       */
      statusFor: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletPreimageRequestStatus>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    scheduler: {
      /**
       * Items to be executed, indexed by the block number that they should be
       * executed on.
       */
      agenda: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Vec<Option<PalletSchedulerScheduledV3>>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Lookup from identity to the block number and index of the task.
       */
      lookup: AugmentedQuery<
        ApiType,
        (
          arg: Bytes | string | Uint8Array
        ) => Observable<Option<ITuple<[u32, u32]>>>,
        [Bytes]
      > &
        QueryableStorageEntry<ApiType, [Bytes]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    session: {
      /**
       * Current index of the session.
       */
      currentIndex: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Indices of disabled validators.
       *
       * The vec is always kept sorted so that we can find whether a given
       * validator is disabled using binary search. It gets cleared when
       * `on_session_ending` returns a new set of identities.
       */
      disabledValidators: AugmentedQuery<
        ApiType,
        () => Observable<Vec<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The owner of a key. The key is the `KeyTypeId` + the encoded key.
       */
      keyOwner: AugmentedQuery<
        ApiType,
        (
          arg:
            | ITuple<[SpCoreCryptoKeyTypeId, Bytes]>
            | [
                SpCoreCryptoKeyTypeId | string | Uint8Array,
                Bytes | string | Uint8Array
              ]
        ) => Observable<Option<AccountId32>>,
        [ITuple<[SpCoreCryptoKeyTypeId, Bytes]>]
      > &
        QueryableStorageEntry<
          ApiType,
          [ITuple<[SpCoreCryptoKeyTypeId, Bytes]>]
        >;
      /**
       * The next session keys for a validator.
       */
      nextKeys: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<Option<DolphinRuntimeOpaqueSessionKeys>>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * True if the underlying economic identities or weighting behind the
       * validators has changed in the queued validator set.
       */
      queuedChanged: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The queued keys for the next session. When the next session begins,
       * these keys will be used to determine the validator's session keys.
       */
      queuedKeys: AugmentedQuery<
        ApiType,
        () => Observable<
          Vec<ITuple<[AccountId32, DolphinRuntimeOpaqueSessionKeys]>>
        >,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current set of validators.
       */
      validators: AugmentedQuery<
        ApiType,
        () => Observable<Vec<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    sudo: {
      /**
       * The `AccountId` of the sudo key.
       */
      key: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    system: {
      /**
       * The full account information for a particular account ID.
       */
      account: AugmentedQuery<
        ApiType,
        (
          arg: AccountId32 | string | Uint8Array
        ) => Observable<FrameSystemAccountInfo>,
        [AccountId32]
      > &
        QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Total length (in bytes) for all extrinsics put together, for the current block.
       */
      allExtrinsicsLen: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Map of block numbers to block hashes.
       */
      blockHash: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<H256>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * The current weight for the block.
       */
      blockWeight: AugmentedQuery<
        ApiType,
        () => Observable<FrameSupportWeightsPerDispatchClassU64>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Digest of the current block, also part of the block header.
       */
      digest: AugmentedQuery<ApiType, () => Observable<SpRuntimeDigest>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The number of events in the `Events<T>` list.
       */
      eventCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Events deposited for the current block.
       *
       * NOTE: This storage item is explicitly unbounded since it is never
       * intended to be read from within the runtime.
       */
      events: AugmentedQuery<
        ApiType,
        () => Observable<Vec<FrameSystemEventRecord>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Mapping between a topic (represented by T::Hash) and a vector of
       * indexes of events in the `<Events<T>>` list.
       *
       * All topic vectors have deterministic storage locations depending on the
       * topic. This allows light-clients to leverage the changes trie storage
       * tracking mechanism and in case of changes fetch the list of events of interest.
       *
       * The value has the type `(T::BlockNumber, EventIndex)` because if we
       * used only just the `EventIndex` then in case if the topic has the same
       * contents on the next block no notification will be triggered thus the
       * event might be lost.
       */
      eventTopics: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Vec<ITuple<[u32, u32]>>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The execution phase of the block.
       */
      executionPhase: AugmentedQuery<
        ApiType,
        () => Observable<Option<FrameSystemPhase>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Total extrinsics count for the current block.
       */
      extrinsicCount: AugmentedQuery<
        ApiType,
        () => Observable<Option<u32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Extrinsics data for the current block (maps an extrinsic's index to its data).
       */
      extrinsicData: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Stores the `spec_version` and `spec_name` of when the last runtime
       * upgrade happened.
       */
      lastRuntimeUpgrade: AugmentedQuery<
        ApiType,
        () => Observable<Option<FrameSystemLastRuntimeUpgradeInfo>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current block number being processed. Set by `execute_block`.
       */
      number: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Hash of the previous block.
       */
      parentHash: AugmentedQuery<ApiType, () => Observable<H256>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * True if we have upgraded so that AccountInfo contains three types of
       * `RefCount`. False (default) if not.
       */
      upgradedToTripleRefCount: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * True if we have upgraded so that `type RefCount` is `u32`. False
       * (default) if not.
       */
      upgradedToU32RefCount: AugmentedQuery<
        ApiType,
        () => Observable<bool>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    technicalCommittee: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       */
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The prime member that helps determine the default vote behavior in case
       * of absentations.
       */
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Proposals so far.
       */
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Actual proposal for a given hash, if it's current.
       */
      proposalOf: AugmentedQuery<
        ApiType,
        (arg: H256 | string | Uint8Array) => Observable<Option<Call>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The hashes of the active proposals.
       */
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Votes on a given proposal, if it is ongoing.
       */
      voting: AugmentedQuery<
        ApiType,
        (
          arg: H256 | string | Uint8Array
        ) => Observable<Option<PalletCollectiveVotes>>,
        [H256]
      > &
        QueryableStorageEntry<ApiType, [H256]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    technicalMembership: {
      /**
       * The current membership, stored as an ordered Vec.
       */
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The current prime member, if one exists.
       */
      prime: AugmentedQuery<
        ApiType,
        () => Observable<Option<AccountId32>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    timestamp: {
      /**
       * Did the timestamp get updated in this block?
       */
      didUpdate: AugmentedQuery<ApiType, () => Observable<bool>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Current time for the current block.
       */
      now: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    transactionPause: {
      /**
       * The paused transaction map
       *
       * Map (PalletNameBytes, FunctionNameBytes) => Option<()>
       */
      pausedTransactions: AugmentedQuery<
        ApiType,
        (
          arg:
            | ITuple<[Bytes, Bytes]>
            | [Bytes | string | Uint8Array, Bytes | string | Uint8Array]
        ) => Observable<Option<Null>>,
        [ITuple<[Bytes, Bytes]>]
      > &
        QueryableStorageEntry<ApiType, [ITuple<[Bytes, Bytes]>]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    transactionPayment: {
      nextFeeMultiplier: AugmentedQuery<ApiType, () => Observable<u128>, []> &
        QueryableStorageEntry<ApiType, []>;
      storageVersion: AugmentedQuery<
        ApiType,
        () => Observable<PalletTransactionPaymentReleases>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    treasury: {
      /**
       * Proposal indices that have been approved but not yet awarded.
       */
      approvals: AugmentedQuery<ApiType, () => Observable<Vec<u32>>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Number of proposals that have been made.
       */
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Proposals that have been made.
       */
      proposals: AugmentedQuery<
        ApiType,
        (
          arg: u32 | AnyNumber | Uint8Array
        ) => Observable<Option<PalletTreasuryProposal>>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    xcmpQueue: {
      /**
       * Inbound aggregate XCMP messages. It can only be one per ParaId/block.
       */
      inboundXcmpMessages: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: u32 | AnyNumber | Uint8Array
        ) => Observable<Bytes>,
        [u32, u32]
      > &
        QueryableStorageEntry<ApiType, [u32, u32]>;
      /**
       * Status of the inbound XCMP channels.
       */
      inboundXcmpStatus: AugmentedQuery<
        ApiType,
        () => Observable<Vec<CumulusPalletXcmpQueueInboundChannelDetails>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The messages outbound in a given XCMP channel.
       */
      outboundXcmpMessages: AugmentedQuery<
        ApiType,
        (
          arg1: u32 | AnyNumber | Uint8Array,
          arg2: u16 | AnyNumber | Uint8Array
        ) => Observable<Bytes>,
        [u32, u16]
      > &
        QueryableStorageEntry<ApiType, [u32, u16]>;
      /**
       * The non-empty XCMP channels in order of becoming non-empty, and the
       * index of the first and last outbound message. If the two indices are
       * equal, then it indicates an empty queue and there must be a non-`Ok`
       * `OutboundStatus`. We assume queues grow no greater than 65535 items.
       * Queue indices for normal messages begin at one; zero is reserved in
       * case of the need to send a high-priority signal message this block. The
       * bool is true if there is a signal message waiting to be sent.
       */
      outboundXcmpStatus: AugmentedQuery<
        ApiType,
        () => Observable<Vec<CumulusPalletXcmpQueueOutboundChannelDetails>>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The messages that exceeded max individual message weight budget.
       *
       * These message stay in this storage map until they are manually
       * dispatched via `service_overweight`.
       */
      overweight: AugmentedQuery<
        ApiType,
        (
          arg: u64 | AnyNumber | Uint8Array
        ) => Observable<Option<ITuple<[u32, u32, Bytes]>>>,
        [u64]
      > &
        QueryableStorageEntry<ApiType, [u64]>;
      /**
       * The number of overweight messages ever recorded in `Overweight`. Also
       * doubles as the next available free overweight index.
       */
      overweightCount: AugmentedQuery<ApiType, () => Observable<u64>, []> &
        QueryableStorageEntry<ApiType, []>;
      /**
       * The configuration which controls the dynamics of the outbound queue.
       */
      queueConfig: AugmentedQuery<
        ApiType,
        () => Observable<CumulusPalletXcmpQueueQueueConfigData>,
        []
      > &
        QueryableStorageEntry<ApiType, []>;
      /**
       * Any signal messages waiting to be sent.
       */
      signalMessages: AugmentedQuery<
        ApiType,
        (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>,
        [u32]
      > &
        QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    xTokens: {
      /**
       * Generic query
       */
      [key: string]: QueryableStorageEntry<ApiType>;
    };
  } // AugmentedQueries
} // declare module
