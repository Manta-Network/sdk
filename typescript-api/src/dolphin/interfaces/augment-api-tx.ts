// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from "@polkadot/api-base/types";
import type {
  Bytes,
  Compact,
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
  MultiAddress,
  Perbill,
} from "@polkadot/types/interfaces/runtime";
import type {
  CumulusPrimitivesParachainInherentParachainInherentData,
  DolphinRuntimeCurrencyId,
  DolphinRuntimeOpaqueSessionKeys,
  DolphinRuntimeOriginCaller,
  FrameSupportScheduleMaybeHashed,
  MantaPrimitivesAssetsAssetLocation,
  MantaPrimitivesAssetsAssetRegistrarMetadata,
  PalletDemocracyConviction,
  PalletDemocracyVoteAccountVote,
  PalletMantaPayTransferPost,
  PalletMultisigTimepoint,
  SpRuntimeHeader,
  XcmV1MultiLocation,
  XcmV2WeightLimit,
  XcmVersionedMultiAsset,
  XcmVersionedMultiAssets,
  XcmVersionedMultiLocation,
  XcmVersionedXcm,
} from "@polkadot/types/lookup";

declare module "@polkadot/api-base/types/submittable" {
  export interface AugmentedSubmittables<ApiType extends ApiTypes> {
    assetManager: {
      /**
       * Register a new asset in the asset manager.
       *
       * - `origin`: Caller of this extrinsic, the acess control is specfied by
       *   `ForceOrigin`.
       * - `location`: Location of the asset.
       * - `metadata`: Asset metadata.
       * - `min_balance`: Minimum balance to keep an account alive, used in
       *   conjunction with `is_sufficient`.
       * - `is_sufficient`: Whether this asset needs users to have an existential
       *   deposit to hold this asset.
       *
       * # <weight>
       *
       * TODO: get actual weight
       *
       * # </weight>
       */
      registerAsset: AugmentedSubmittable<
        (
          location:
            | MantaPrimitivesAssetsAssetLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          metadata:
            | MantaPrimitivesAssetsAssetRegistrarMetadata
            | {
                name?: any;
                symbol?: any;
                decimals?: any;
                evmAddress?: any;
                isFrozen?: any;
                minBalance?: any;
                isSufficient?: any;
              }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          MantaPrimitivesAssetsAssetLocation,
          MantaPrimitivesAssetsAssetRegistrarMetadata
        ]
      >;
      /**
       * Update an asset by its asset id in the asset manager.
       *
       * - `origin`: Caller of this extrinsic, the acess control is specfied by
       *   `ForceOrigin`.
       * - `asset_id`: AssetId to be updated.
       * - `units_per_second`: units per second for `asset_id`
       *
       * # <weight>
       *
       * TODO: get actual weight
       *
       * # </weight>
       */
      setUnitsPerSecond: AugmentedSubmittable<
        (
          assetId: Compact<u32> | AnyNumber | Uint8Array,
          unitsPerSecond: Compact<u128> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>, Compact<u128>]
      >;
      /**
       * Update an asset by its asset id in the asset manager.
       *
       * - `origin`: Caller of this extrinsic, the acess control is specfied by
       *   `ForceOrigin`.
       * - `asset_id`: AssetId to be updated.
       * - `location`: `location` to update the asset location.
       *
       * # <weight>
       *
       * TODO: get actual weight
       *
       * # </weight>
       */
      updateAssetLocation: AugmentedSubmittable<
        (
          assetId: Compact<u32> | AnyNumber | Uint8Array,
          location:
            | MantaPrimitivesAssetsAssetLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>, MantaPrimitivesAssetsAssetLocation]
      >;
      /**
       * Update an asset's metadata by its `asset_id`
       *
       * - `origin`: Caller of this extrinsic, the acess control is specfied by
       *   `ForceOrigin`.
       * - `asset_id`: AssetId to be updated.
       * - `metadata`: new `metadata` to be associated with `asset_id`.
       */
      updateAssetMetadata: AugmentedSubmittable<
        (
          assetId: Compact<u32> | AnyNumber | Uint8Array,
          metadata:
            | MantaPrimitivesAssetsAssetRegistrarMetadata
            | {
                name?: any;
                symbol?: any;
                decimals?: any;
                evmAddress?: any;
                isFrozen?: any;
                minBalance?: any;
                isSufficient?: any;
              }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>, MantaPrimitivesAssetsAssetRegistrarMetadata]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    authorship: {
      /**
       * Provide a set of uncles.
       */
      setUncles: AugmentedSubmittable<
        (
          newUncles:
            | Vec<SpRuntimeHeader>
            | (
                | SpRuntimeHeader
                | {
                    parentHash?: any;
                    number?: any;
                    stateRoot?: any;
                    extrinsicsRoot?: any;
                    digest?: any;
                  }
                | string
                | Uint8Array
              )[]
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<SpRuntimeHeader>]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    balances: {
      /**
       * Exactly as `transfer`, except the origin must be root and the source
       * account may be specified.
       *
       * # <weight>
       *
       * - Same as transfer, but additional read and write because the source
       *   account is not assumed to be in the overlay.
       *
       * # </weight>
       */
      forceTransfer: AugmentedSubmittable<
        (
          source:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array,
          dest:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array,
          value: Compact<u128> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [MultiAddress, MultiAddress, Compact<u128>]
      >;
      /**
       * Unreserve some balance from a user by force.
       *
       * Can only be called by ROOT.
       */
      forceUnreserve: AugmentedSubmittable<
        (
          who:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array,
          amount: u128 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [MultiAddress, u128]
      >;
      /**
       * Set the balances of a given account.
       *
       * This will alter `FreeBalance` and `ReservedBalance` in storage. it will
       * also alter the total issuance of the system (`TotalIssuance`)
       * appropriately. If the new free or reserved balance is below the
       * existential deposit, it will reset the account nonce
       * (`frame_system::AccountNonce`).
       *
       * The dispatch origin for this call is `root`.
       */
      setBalance: AugmentedSubmittable<
        (
          who:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array,
          newFree: Compact<u128> | AnyNumber | Uint8Array,
          newReserved: Compact<u128> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [MultiAddress, Compact<u128>, Compact<u128>]
      >;
      /**
       * Transfer some liquid free balance to another account.
       *
       * `transfer` will set the `FreeBalance` of the sender and receiver. If
       * the sender's account is below the existential deposit as a result of
       * the transfer, the account will be reaped.
       *
       * The dispatch origin for this call must be `Signed` by the transactor.
       *
       * # <weight>
       *
       * - Dependent on arguments but not critical, given proper implementations
       *   for input config types. See related functions below.
       * - It contains a limited number of reads and writes internally and no
       *   complex computation.
       *
       * Related functions:
       *
       * - `ensure_can_withdraw` is always called internally but has a bounded complexity.
       * - Transferring balances to accounts that did not exist before will cause
       *   `T::OnNewAccount::on_new_account` to be called.
       * - Removing enough funds from an account will trigger
       *   `T::DustRemoval::on_unbalanced`.
       * - `transfer_keep_alive` works the same way as `transfer`, but has an
       *   additional check that the transfer will not kill the origin account.
       * - Origin account is already in memory, so no DB operations for them.
       *
       * # </weight>
       */
      transfer: AugmentedSubmittable<
        (
          dest:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array,
          value: Compact<u128> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [MultiAddress, Compact<u128>]
      >;
      /**
       * Transfer the entire transferable balance from the caller account.
       *
       * NOTE: This function only attempts to transfer _transferable_ balances.
       * This means that any locked, reserved, or existential deposits (when
       * `keep_alive` is `true`), will not be transferred by this function. To
       * ensure that this function results in a killed account, you might need
       * to prepare the account by removing any reference counters, storage
       * deposits, etc...
       *
       * The dispatch origin of this call must be Signed.
       *
       * - `dest`: The recipient of the transfer.
       * - `keep_alive`: A boolean to determine if the `transfer_all` operation
       *   should send all of the funds the account has, causing the sender
       *   account to be killed (false), or transfer everything except at least
       *   the existential deposit, which will guarantee to keep the sender
       *   account alive (true). # <weight>
       * - O(1). Just like transfer, but reading the user's transferable balance
       *   first. #</weight>
       */
      transferAll: AugmentedSubmittable<
        (
          dest:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array,
          keepAlive: bool | boolean | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [MultiAddress, bool]
      >;
      /**
       * Same as the `transfer` call, but with a check that the transfer will
       * not kill the origin account.
       *
       * 99% of the time you want `transfer` instead.
       */
      transferKeepAlive: AugmentedSubmittable<
        (
          dest:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array,
          value: Compact<u128> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [MultiAddress, Compact<u128>]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    collatorSelection: {
      /**
       * Leave from collator set.
       */
      leaveIntent: AugmentedSubmittable<
        () => SubmittableExtrinsic<ApiType>,
        []
      >;
      /**
       * Register as candidate collator.
       */
      registerAsCandidate: AugmentedSubmittable<
        () => SubmittableExtrinsic<ApiType>,
        []
      >;
      /**
       * Register an specified candidate as collator.
       *
       * - `new_candidate`: Who is going to be collator.
       */
      registerCandidate: AugmentedSubmittable<
        (
          newCandidate: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Remove an specified collator.
       *
       * - `collator`: Who is going to be remove from collators set.
       */
      removeCollator: AugmentedSubmittable<
        (
          collator: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Set the amount held on reserved for candidate collator.
       *
       * `bond`: The amount held on reserved.
       */
      setCandidacyBond: AugmentedSubmittable<
        (bond: u128 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [u128]
      >;
      /**
       * Set how many candidate collator are allowed.
       *
       * `max`: The max number of candidates.
       */
      setDesiredCandidates: AugmentedSubmittable<
        (max: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [u32]
      >;
      /**
       * Set the collator performance percentile used as baseline for eviction
       *
       * `percentile`: x-th percentile of collator performance to use as eviction baseline
       */
      setEvictionBaseline: AugmentedSubmittable<
        (
          percentile: u8 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u8]
      >;
      /**
       * Set the tolerated underperformance percentage before evicting
       *
       * `percentage`: x% of missed blocks under eviction_baseline to tolerate
       */
      setEvictionTolerance: AugmentedSubmittable<
        (
          percentage: u8 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u8]
      >;
      /**
       * Set candidate collator as invulnerable.
       *
       * `new`: candidate collator.
       */
      setInvulnerables: AugmentedSubmittable<
        (
          updated: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<AccountId32>]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    council: {
      /**
       * Close a vote that is either approved, disapproved or whose voting
       * period has ended.
       *
       * May be called by any signed account in order to finish voting and close
       * the proposal.
       *
       * If called before the end of the voting period it will only close the
       * vote if it is has enough votes to be approved or disapproved.
       *
       * If called after the end of the voting period abstentions are counted as
       * rejections unless there is a prime member set and the prime member cast
       * an approval.
       *
       * If the close operation completes successfully with disapproval, the
       * transaction fee will be waived. Otherwise execution of the approved
       * operation will be charged to the caller.
       *
       * - `proposal_weight_bound`: The maximum amount of weight consumed by
       *   executing the closed proposal.
       * - `length_bound`: The upper bound for the length of the proposal in
       *   storage. Checked via `storage::read` so it is `size_of::<u32>() == 4`
       *   larger than the pure length.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(B + M + P1 + P2)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` is members-count (code- and governance-bounded)
       * - `P1` is the complexity of `proposal` preimage.
       * - `P2` is proposal-count (code-bounded)
       * - DB:
       * - 2 storage reads (`Members`: codec `O(M)`, `Prime`: codec `O(1)`)
       * - 3 mutations (`Voting`: codec `O(M)`, `ProposalOf`: codec `O(B)`,
       *   `Proposals`: codec `O(P2)`)
       * - Any mutations done while executing `proposal` (`P1`)
       * - Up to 3 events
       *
       * # </weight>
       */
      close: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array,
          index: Compact<u32> | AnyNumber | Uint8Array,
          proposalWeightBound: Compact<u64> | AnyNumber | Uint8Array,
          lengthBound: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, Compact<u32>, Compact<u64>, Compact<u32>]
      >;
      /**
       * Disapprove a proposal, close, and remove it from the system, regardless
       * of its current state.
       *
       * Must be called by the Root origin.
       *
       * Parameters:
       *
       * - `proposal_hash`: The hash of the proposal that should be disapproved.
       *
       * # <weight>
       *
       * Complexity: O(P) where P is the number of max proposals DB Weight:
       *
       * - Reads: Proposals
       * - Writes: Voting, Proposals, ProposalOf
       *
       * # </weight>
       */
      disapproveProposal: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Dispatch a proposal from a member using the `Member` origin.
       *
       * Origin must be a member of the collective.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(M + P)` where `M` members-count (code-bounded) and `P` complexity of
       *   dispatching `proposal`
       * - DB: 1 read (codec `O(M)`) + DB access of `proposal`
       * - 1 event
       *
       * # </weight>
       */
      execute: AugmentedSubmittable<
        (
          proposal:
            | Call
            | { callIndex?: any; args?: any }
            | string
            | Uint8Array,
          lengthBound: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Call, Compact<u32>]
      >;
      /**
       * Add a new proposal to either be voted on or executed directly.
       *
       * Requires the sender to be member.
       *
       * `threshold` determines whether `proposal` is executed directly
       * (`threshold < 2`) or put up for voting.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(B + M + P1)` or `O(B + M + P2)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` is members-count (code- and governance-bounded)
       * - Branching is influenced by `threshold` where:
       * - `P1` is proposal execution complexity (`threshold < 2`)
       * - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
       * - DB:
       * - 1 storage read `is_member` (codec `O(M)`)
       * - 1 storage read `ProposalOf::contains_key` (codec `O(1)`)
       * - DB accesses influenced by `threshold`:
       * - EITHER storage accesses done by `proposal` (`threshold < 2`)
       * - OR proposal insertion (`threshold <= 2`)
       * - 1 storage mutation `Proposals` (codec `O(P2)`)
       * - 1 storage mutation `ProposalCount` (codec `O(1)`)
       * - 1 storage write `ProposalOf` (codec `O(B)`)
       * - 1 storage write `Voting` (codec `O(M)`)
       * - 1 event
       *
       * # </weight>
       */
      propose: AugmentedSubmittable<
        (
          threshold: Compact<u32> | AnyNumber | Uint8Array,
          proposal:
            | Call
            | { callIndex?: any; args?: any }
            | string
            | Uint8Array,
          lengthBound: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>, Call, Compact<u32>]
      >;
      /**
       * Set the collective's membership.
       *
       * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
       * - `prime`: The prime member whose vote sets the default.
       * - `old_count`: The upper bound for the previous number of members in
       *   storage. Used for weight estimation.
       *
       * Requires root origin.
       *
       * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of
       * members, but the weight estimations rely on it to estimate dispatchable weight.
       *
       * # WARNING:
       *
       * The `pallet-collective` can also be managed by logic outside of the
       * pallet through the implementation of the trait [`ChangeMembers`]. Any
       * call to `set_members` must be careful that the member set doesn't get
       * out of sync with other logic managing the member set.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(MP + N)` where:
       * - `M` old-members-count (code- and governance-bounded)
       * - `N` new-members-count (code- and governance-bounded)
       * - `P` proposals-count (code-bounded)
       * - DB:
       * - 1 storage mutation (codec `O(M)` read, `O(N)` write) for reading and
       *   writing the members
       * - 1 storage read (codec `O(P)`) for reading the proposals
       * - `P` storage mutations (codec `O(M)`) for updating the votes for each proposal
       * - 1 storage write (codec `O(1)`) for deleting the old `prime` and setting
       *   the new one
       *
       * # </weight>
       */
      setMembers: AugmentedSubmittable<
        (
          newMembers: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[],
          prime: Option<AccountId32> | null | object | string | Uint8Array,
          oldCount: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<AccountId32>, Option<AccountId32>, u32]
      >;
      /**
       * Add an aye or nay vote for the sender to the given proposal.
       *
       * Requires the sender to be a member.
       *
       * Transaction fees will be waived if the member is voting on any
       * particular proposal for the first time and the call is successful.
       * Subsequent vote changes will charge a fee.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(M)` where `M` is members-count (code- and governance-bounded)
       * - DB:
       * - 1 storage read `Members` (codec `O(M)`)
       * - 1 storage mutation `Voting` (codec `O(M)`)
       * - 1 event
       *
       * # </weight>
       */
      vote: AugmentedSubmittable<
        (
          proposal: H256 | string | Uint8Array,
          index: Compact<u32> | AnyNumber | Uint8Array,
          approve: bool | boolean | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, Compact<u32>, bool]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    councilMembership: {
      /**
       * Add a member `who` to the set.
       *
       * May only be called from `T::AddOrigin`.
       */
      addMember: AugmentedSubmittable<
        (
          who: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Swap out the sending member for some other key `new`.
       *
       * May only be called from `Signed` origin of a current member.
       *
       * Prime membership is passed from the origin account to `new`, if extant.
       */
      changeKey: AugmentedSubmittable<
        (
          updated: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Remove the prime member if it exists.
       *
       * May only be called from `T::PrimeOrigin`.
       */
      clearPrime: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Remove a member `who` from the set.
       *
       * May only be called from `T::RemoveOrigin`.
       */
      removeMember: AugmentedSubmittable<
        (
          who: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Change the membership to a new set, disregarding the existing
       * membership. Be nice and pass `members` pre-sorted.
       *
       * May only be called from `T::ResetOrigin`.
       */
      resetMembers: AugmentedSubmittable<
        (
          members: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<AccountId32>]
      >;
      /**
       * Set the prime member. Must be a current member.
       *
       * May only be called from `T::PrimeOrigin`.
       */
      setPrime: AugmentedSubmittable<
        (
          who: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Swap out one member `remove` for another `add`.
       *
       * May only be called from `T::SwapOrigin`.
       *
       * Prime membership is _not_ passed from `remove` to `add`, if extant.
       */
      swapMember: AugmentedSubmittable<
        (
          remove: AccountId32 | string | Uint8Array,
          add: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, AccountId32]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    democracy: {
      /**
       * Permanently place a proposal into the blacklist. This prevents it from
       * ever being proposed again.
       *
       * If called on a queued public or external proposal, then this will
       * result in it being removed. If the `ref_index` supplied is an active
       * referendum with the proposal hash, then it will be cancelled.
       *
       * The dispatch origin of this call must be `BlacklistOrigin`.
       *
       * - `proposal_hash`: The proposal hash to blacklist permanently.
       * - `ref_index`: An ongoing referendum whose hash is `proposal_hash`, which
       *   will be cancelled.
       *
       * Weight: `O(p)` (though as this is an high-privilege dispatch, we assume
       * it has a reasonable value).
       */
      blacklist: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array,
          maybeRefIndex: Option<u32> | null | object | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, Option<u32>]
      >;
      /**
       * Remove a proposal.
       *
       * The dispatch origin of this call must be `CancelProposalOrigin`.
       *
       * - `prop_index`: The index of the proposal to cancel.
       *
       * Weight: `O(p)` where `p = PublicProps::<T>::decode_len()`
       */
      cancelProposal: AugmentedSubmittable<
        (
          propIndex: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>]
      >;
      /**
       * Cancel a proposal queued for enactment.
       *
       * The dispatch origin of this call must be _Root_.
       *
       * - `which`: The index of the referendum to cancel.
       *
       * Weight: `O(D)` where `D` is the items in the dispatch queue. Weighted
       * as `D = 10`.
       */
      cancelQueued: AugmentedSubmittable<
        (which: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [u32]
      >;
      /**
       * Remove a referendum.
       *
       * The dispatch origin of this call must be _Root_.
       *
       * - `ref_index`: The index of the referendum to cancel.
       *
       * # Weight: `O(1)`.
       */
      cancelReferendum: AugmentedSubmittable<
        (
          refIndex: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>]
      >;
      /**
       * Clears all public proposals.
       *
       * The dispatch origin of this call must be _Root_.
       *
       * Weight: `O(1)`.
       */
      clearPublicProposals: AugmentedSubmittable<
        () => SubmittableExtrinsic<ApiType>,
        []
      >;
      /**
       * Delegate the voting power (with some given conviction) of the sending account.
       *
       * The balance delegated is locked for as long as it's delegated, and
       * thereafter for the time appropriate for the conviction's lock period.
       *
       * The dispatch origin of this call must be _Signed_, and the signing
       * account must either:
       *
       * - Be delegating already; or
       * - Have no voting activity (if there is, then it will need to be
       *   removed/consolidated through `reap_vote` or `unvote`).
       * - `to`: The account whose voting the `target` account's voting power will follow.
       * - `conviction`: The conviction that will be attached to the delegated
       *   votes. When the account is undelegated, the funds will be locked for
       *   the corresponding period.
       * - `balance`: The amount of the account's balance to be used in
       *   delegating. This must not be more than the account's current balance.
       *
       * Emits `Delegated`.
       *
       * Weight: `O(R)` where R is the number of referendums the voter
       * delegating to has voted on. Weight is charged as if maximum votes.
       */
      delegate: AugmentedSubmittable<
        (
          to: AccountId32 | string | Uint8Array,
          conviction:
            | PalletDemocracyConviction
            | "None"
            | "Locked1x"
            | "Locked2x"
            | "Locked3x"
            | "Locked4x"
            | "Locked5x"
            | "Locked6x"
            | number
            | Uint8Array,
          balance: u128 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, PalletDemocracyConviction, u128]
      >;
      /**
       * Schedule an emergency cancellation of a referendum. Cannot happen twice
       * to the same referendum.
       *
       * The dispatch origin of this call must be `CancellationOrigin`.
       *
       * -`ref_index`: The index of the referendum to cancel.
       *
       * Weight: `O(1)`.
       */
      emergencyCancel: AugmentedSubmittable<
        (
          refIndex: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u32]
      >;
      /**
       * Enact a proposal from a referendum. For now we just make the weight be
       * the maximum.
       */
      enactProposal: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array,
          index: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, u32]
      >;
      /**
       * Schedule a referendum to be tabled once it is legal to schedule an
       * external referendum.
       *
       * The dispatch origin of this call must be `ExternalOrigin`.
       *
       * - `proposal_hash`: The preimage hash of the proposal.
       *
       * Weight: `O(V)` with V number of vetoers in the blacklist of proposal.
       * Decoding vec of length V. Charged as maximum
       */
      externalPropose: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Schedule a negative-turnout-bias referendum to be tabled next once it
       * is legal to schedule an external referendum.
       *
       * The dispatch of this call must be `ExternalDefaultOrigin`.
       *
       * - `proposal_hash`: The preimage hash of the proposal.
       *
       * Unlike `external_propose`, blacklisting has no effect on this and it
       * may replace a pre-scheduled `external_propose` call.
       *
       * Weight: `O(1)`
       */
      externalProposeDefault: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Schedule a majority-carries referendum to be tabled next once it is
       * legal to schedule an external referendum.
       *
       * The dispatch of this call must be `ExternalMajorityOrigin`.
       *
       * - `proposal_hash`: The preimage hash of the proposal.
       *
       * Unlike `external_propose`, blacklisting has no effect on this and it
       * may replace a pre-scheduled `external_propose` call.
       *
       * Weight: `O(1)`
       */
      externalProposeMajority: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Schedule the currently externally-proposed majority-carries referendum
       * to be tabled immediately. If there is no externally-proposed referendum
       * currently, or if there is one but it is not a majority-carries
       * referendum then it fails.
       *
       * The dispatch of this call must be `FastTrackOrigin`.
       *
       * - `proposal_hash`: The hash of the current external proposal.
       * - `voting_period`: The period that is allowed for voting on this
       *   proposal. Increased to `FastTrackVotingPeriod` if too low.
       * - `delay`: The number of block after voting has ended in approval and
       *   this should be enacted. This doesn't have a minimum amount.
       *
       * Emits `Started`.
       *
       * Weight: `O(1)`
       */
      fastTrack: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array,
          votingPeriod: u32 | AnyNumber | Uint8Array,
          delay: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, u32, u32]
      >;
      /**
       * Register the preimage for an upcoming proposal. This requires the
       * proposal to be in the dispatch queue. No deposit is needed. When this
       * call is successful, i.e. the preimage has not been uploaded before and
       * matches some imminent proposal, no fee is paid.
       *
       * The dispatch origin of this call must be _Signed_.
       *
       * - `encoded_proposal`: The preimage of a proposal.
       *
       * Emits `PreimageNoted`.
       *
       * Weight: `O(E)` with E size of `encoded_proposal` (protected by a
       * required deposit).
       */
      noteImminentPreimage: AugmentedSubmittable<
        (
          encodedProposal: Bytes | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Same as `note_imminent_preimage` but origin is `OperationalPreimageOrigin`.
       */
      noteImminentPreimageOperational: AugmentedSubmittable<
        (
          encodedProposal: Bytes | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Register the preimage for an upcoming proposal. This doesn't require
       * the proposal to be in the dispatch queue but does require a deposit,
       * returned once enacted.
       *
       * The dispatch origin of this call must be _Signed_.
       *
       * - `encoded_proposal`: The preimage of a proposal.
       *
       * Emits `PreimageNoted`.
       *
       * Weight: `O(E)` with E size of `encoded_proposal` (protected by a
       * required deposit).
       */
      notePreimage: AugmentedSubmittable<
        (
          encodedProposal: Bytes | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Same as `note_preimage` but origin is `OperationalPreimageOrigin`.
       */
      notePreimageOperational: AugmentedSubmittable<
        (
          encodedProposal: Bytes | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Propose a sensitive action to be taken.
       *
       * The dispatch origin of this call must be _Signed_ and the sender must
       * have funds to cover the deposit.
       *
       * - `proposal_hash`: The hash of the proposal preimage.
       * - `value`: The amount of deposit (must be at least `MinimumDeposit`).
       *
       * Emits `Proposed`.
       *
       * Weight: `O(p)`
       */
      propose: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array,
          value: Compact<u128> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, Compact<u128>]
      >;
      /**
       * Remove an expired proposal preimage and collect the deposit.
       *
       * The dispatch origin of this call must be _Signed_.
       *
       * - `proposal_hash`: The preimage hash of a proposal.
       * - `proposal_length_upper_bound`: an upper bound on length of the
       *   proposal. Extrinsic is weighted according to this value with no refund.
       *
       * This will only work after `VotingPeriod` blocks from the time that the
       * preimage was noted, if it's the same account doing it. If it's a
       * different account, then it'll only work an additional `EnactmentPeriod` later.
       *
       * Emits `PreimageReaped`.
       *
       * Weight: `O(D)` where D is length of proposal.
       */
      reapPreimage: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array,
          proposalLenUpperBound: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, Compact<u32>]
      >;
      /**
       * Remove a vote for a referendum.
       *
       * If the `target` is equal to the signer, then this function is exactly
       * equivalent to `remove_vote`. If not equal to the signer, then the vote
       * must have expired, either because the referendum was cancelled, because
       * the voter lost the referendum or because the conviction period is over.
       *
       * The dispatch origin of this call must be _Signed_.
       *
       * - `target`: The account of the vote to be removed; this account must have
       *   voted for referendum `index`.
       * - `index`: The index of referendum of the vote to be removed.
       *
       * Weight: `O(R + log R)` where R is the number of referenda that `target`
       * has voted on. Weight is calculated for the maximum number of vote.
       */
      removeOtherVote: AugmentedSubmittable<
        (
          target: AccountId32 | string | Uint8Array,
          index: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, u32]
      >;
      /**
       * Remove a vote for a referendum.
       *
       * If:
       *
       * - The referendum was cancelled, or
       * - The referendum is ongoing, or
       * - The referendum has ended such that
       * - The vote of the account was in opposition to the result; or
       * - There was no conviction to the account's vote; or
       * - The account made a split vote ...then the vote is removed cleanly and a
       *   following call to `unlock` may result in more funds being available.
       *
       * If, however, the referendum has ended and:
       *
       * - It finished corresponding to the vote of the account, and
       * - The account made a standard vote with conviction, and
       * - The lock period of the conviction is not over ...then the lock will be
       *   aggregated into the overall account's lock, which may involve
       *   _overlocking_ (where the two locks are combined into a single lock
       *   that is the maximum of both the amount locked and the time is it locked for).
       *
       * The dispatch origin of this call must be _Signed_, and the signer must
       * have a vote registered for referendum `index`.
       *
       * - `index`: The index of referendum of the vote to be removed.
       *
       * Weight: `O(R + log R)` where R is the number of referenda that `target`
       * has voted on. Weight is calculated for the maximum number of vote.
       */
      removeVote: AugmentedSubmittable<
        (index: u32 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [u32]
      >;
      /**
       * Signals agreement with a particular proposal.
       *
       * The dispatch origin of this call must be _Signed_ and the sender must
       * have funds to cover the deposit, equal to the original deposit.
       *
       * - `proposal`: The index of the proposal to second.
       * - `seconds_upper_bound`: an upper bound on the current number of seconds
       *   on this proposal. Extrinsic is weighted according to this value with
       *   no refund.
       *
       * Weight: `O(S)` where S is the number of seconds a proposal already has.
       */
      second: AugmentedSubmittable<
        (
          proposal: Compact<u32> | AnyNumber | Uint8Array,
          secondsUpperBound: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>, Compact<u32>]
      >;
      /**
       * Undelegate the voting power of the sending account.
       *
       * Tokens may be unlocked following once an amount of time consistent with
       * the lock period of the conviction with which the delegation was issued.
       *
       * The dispatch origin of this call must be _Signed_ and the signing
       * account must be currently delegating.
       *
       * Emits `Undelegated`.
       *
       * Weight: `O(R)` where R is the number of referendums the voter
       * delegating to has voted on. Weight is charged as if maximum votes.
       */
      undelegate: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Unlock tokens that have an expired lock.
       *
       * The dispatch origin of this call must be _Signed_.
       *
       * - `target`: The account to remove the lock on.
       *
       * Weight: `O(R)` with R number of vote of target.
       */
      unlock: AugmentedSubmittable<
        (
          target: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Veto and blacklist the external proposal hash.
       *
       * The dispatch origin of this call must be `VetoOrigin`.
       *
       * - `proposal_hash`: The preimage hash of the proposal to veto and blacklist.
       *
       * Emits `Vetoed`.
       *
       * Weight: `O(V + log(V))` where V is number of `existing vetoers`
       */
      vetoExternal: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Vote in a referendum. If `vote.is_aye()`, the vote is to enact the
       * proposal; otherwise it is a vote to keep the status quo.
       *
       * The dispatch origin of this call must be _Signed_.
       *
       * - `ref_index`: The index of the referendum to vote for.
       * - `vote`: The vote configuration.
       *
       * Weight: `O(R)` where R is the number of referendums the voter has voted on.
       */
      vote: AugmentedSubmittable<
        (
          refIndex: Compact<u32> | AnyNumber | Uint8Array,
          vote:
            | PalletDemocracyVoteAccountVote
            | { Standard: any }
            | { Split: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>, PalletDemocracyVoteAccountVote]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    dmpQueue: {
      /**
       * Service a single overweight message.
       *
       * - `origin`: Must pass `ExecuteOverweightOrigin`.
       * - `index`: The index of the overweight message to service.
       * - `weight_limit`: The amount of weight that message execution may take.
       *
       * Errors:
       *
       * - `Unknown`: Message of `index` is unknown.
       * - `OverLimit`: Message execution may use greater than `weight_limit`.
       *
       * Events:
       *
       * - `OverweightServiced`: On success.
       */
      serviceOverweight: AugmentedSubmittable<
        (
          index: u64 | AnyNumber | Uint8Array,
          weightLimit: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u64, u64]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    mantaPay: {
      /**
       * Transfers private assets encoded in `post`.
       *
       * # Note
       *
       * In this transaction, `origin` is just signing the `post` and is not
       * necessarily related to any of the participants in the transaction itself.
       */
      privateTransfer: AugmentedSubmittable<
        (
          post:
            | PalletMantaPayTransferPost
            | {
                assetId?: any;
                sources?: any;
                senderPosts?: any;
                receiverPosts?: any;
                sinks?: any;
                validityProof?: any;
              }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [PalletMantaPayTransferPost]
      >;
      /**
       * Convert the asset encoded in `post` to private asset.
       *
       * `origin`: the owner of the public asset. `origin` will pay the gas fee
       * for the conversion as well. `post`: encoded asset to be converted.
       */
      toPrivate: AugmentedSubmittable<
        (
          post:
            | PalletMantaPayTransferPost
            | {
                assetId?: any;
                sources?: any;
                senderPosts?: any;
                receiverPosts?: any;
                sinks?: any;
                validityProof?: any;
              }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [PalletMantaPayTransferPost]
      >;
      /**
       * Transforms some private assets into public ones using `post`, sending
       * the public assets to the `origin` account.
       */
      toPublic: AugmentedSubmittable<
        (
          post:
            | PalletMantaPayTransferPost
            | {
                assetId?: any;
                sources?: any;
                senderPosts?: any;
                receiverPosts?: any;
                sinks?: any;
                validityProof?: any;
              }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [PalletMantaPayTransferPost]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    multisig: {
      /**
       * Register approval for a dispatch to be made from a deterministic
       * composite account if approved by a total of `threshold - 1` of
       * `other_signatories`.
       *
       * Payment: `DepositBase` will be reserved if this is the first approval,
       * plus `threshold` times `DepositFactor`. It is returned once this
       * dispatch happens or is cancelled.
       *
       * The dispatch origin for this call must be _Signed_.
       *
       * - `threshold`: The total number of approvals for this dispatch before it
       *   is executed.
       * - `other_signatories`: The accounts (other than the sender) who can
       *   approve this dispatch. May not be empty.
       * - `maybe_timepoint`: If this is the first approval, then this must be
       *   `None`. If it is not the first approval, then it must be `Some`, with
       *   the timepoint (block number and transaction index) of the first
       *   approval transaction.
       * - `call_hash`: The hash of the call to be executed.
       *
       * NOTE: If this is the final approval, you will want to use `as_multi` instead.
       *
       * # <weight>
       *
       * - `O(S)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the
       *   number of signatories. `S` is capped by `MaxSignatories`, with weight
       *   being proportional.
       * - One encode & hash, both of complexity `O(S)`.
       * - Up to one binary search and insert (`O(logS + S)`).
       * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
       * - One event.
       * - Storage: inserts one item, value size bounded by `MaxSignatories`, with
       *   a deposit taken for its lifetime of `DepositBase + threshold * DepositFactor`.
       * - DB Weight:
       * - Read: Multisig Storage, [Caller Account]
       * - Write: Multisig Storage, [Caller Account]
       *
       * # </weight>
       */
      approveAsMulti: AugmentedSubmittable<
        (
          threshold: u16 | AnyNumber | Uint8Array,
          otherSignatories:
            | Vec<AccountId32>
            | (AccountId32 | string | Uint8Array)[],
          maybeTimepoint:
            | Option<PalletMultisigTimepoint>
            | null
            | object
            | string
            | Uint8Array,
          callHash: U8aFixed | string | Uint8Array,
          maxWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u16, Vec<AccountId32>, Option<PalletMultisigTimepoint>, U8aFixed, u64]
      >;
      /**
       * Register approval for a dispatch to be made from a deterministic
       * composite account if approved by a total of `threshold - 1` of
       * `other_signatories`.
       *
       * If there are enough, then dispatch the call.
       *
       * Payment: `DepositBase` will be reserved if this is the first approval,
       * plus `threshold` times `DepositFactor`. It is returned once this
       * dispatch happens or is cancelled.
       *
       * The dispatch origin for this call must be _Signed_.
       *
       * - `threshold`: The total number of approvals for this dispatch before it
       *   is executed.
       * - `other_signatories`: The accounts (other than the sender) who can
       *   approve this dispatch. May not be empty.
       * - `maybe_timepoint`: If this is the first approval, then this must be
       *   `None`. If it is not the first approval, then it must be `Some`, with
       *   the timepoint (block number and transaction index) of the first
       *   approval transaction.
       * - `call`: The call to be executed.
       *
       * NOTE: Unless this is the final approval, you will generally want to use
       * `approve_as_multi` instead, since it only requires a hash of the call.
       *
       * Result is equivalent to the dispatched result if `threshold` is exactly
       * `1`. Otherwise on success, result is `Ok` and the result from the
       * interior call, if it was executed, may be found in the deposited
       * `MultisigExecuted` event.
       *
       * # <weight>
       *
       * - `O(S + Z + Call)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the
       *   number of signatories. `S` is capped by `MaxSignatories`, with weight
       *   being proportional.
       * - One call encode & hash, both of complexity `O(Z)` where `Z` is tx-len.
       * - One encode & hash, both of complexity `O(S)`.
       * - Up to one binary search and insert (`O(logS + S)`).
       * - I/O: 1 read `O(S)`, up to 1 mutate `O(S)`. Up to one remove.
       * - One event.
       * - The weight of the `call`.
       * - Storage: inserts one item, value size bounded by `MaxSignatories`, with
       *   a deposit taken for its lifetime of `DepositBase + threshold * DepositFactor`.
       * - DB Weight:
       * - Reads: Multisig Storage, [Caller Account], Calls (if `store_call`)
       * - Writes: Multisig Storage, [Caller Account], Calls (if `store_call`)
       * - Plus Call Weight
       *
       * # </weight>
       */
      asMulti: AugmentedSubmittable<
        (
          threshold: u16 | AnyNumber | Uint8Array,
          otherSignatories:
            | Vec<AccountId32>
            | (AccountId32 | string | Uint8Array)[],
          maybeTimepoint:
            | Option<PalletMultisigTimepoint>
            | null
            | object
            | string
            | Uint8Array,
          call: WrapperKeepOpaque<Call> | object | string | Uint8Array,
          storeCall: bool | boolean | Uint8Array,
          maxWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          u16,
          Vec<AccountId32>,
          Option<PalletMultisigTimepoint>,
          WrapperKeepOpaque<Call>,
          bool,
          u64
        ]
      >;
      /**
       * Immediately dispatch a multi-signature call using a single approval
       * from the caller.
       *
       * The dispatch origin for this call must be _Signed_.
       *
       * - `other_signatories`: The accounts (other than the sender) who are part
       *   of the multi-signature, but do not participate in the approval process.
       * - `call`: The call to be executed.
       *
       * Result is equivalent to the dispatched result.
       *
       * # <weight>
       *
       * ## O(Z + C) where Z is the length of the call and C its execution weight.
       *
       * - DB Weight: None
       * - Plus Call Weight
       *
       * # </weight>
       */
      asMultiThreshold1: AugmentedSubmittable<
        (
          otherSignatories:
            | Vec<AccountId32>
            | (AccountId32 | string | Uint8Array)[],
          call: Call | { callIndex?: any; args?: any } | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<AccountId32>, Call]
      >;
      /**
       * Cancel a pre-existing, on-going multisig transaction. Any deposit
       * reserved previously for this operation will be unreserved on success.
       *
       * The dispatch origin for this call must be _Signed_.
       *
       * - `threshold`: The total number of approvals for this dispatch before it
       *   is executed.
       * - `other_signatories`: The accounts (other than the sender) who can
       *   approve this dispatch. May not be empty.
       * - `timepoint`: The timepoint (block number and transaction index) of the
       *   first approval transaction for this dispatch.
       * - `call_hash`: The hash of the call to be executed.
       *
       * # <weight>
       *
       * - `O(S)`.
       * - Up to one balance-reserve or unreserve operation.
       * - One passthrough operation, one insert, both `O(S)` where `S` is the
       *   number of signatories. `S` is capped by `MaxSignatories`, with weight
       *   being proportional.
       * - One encode & hash, both of complexity `O(S)`.
       * - One event.
       * - I/O: 1 read `O(S)`, one remove.
       * - Storage: removes one item.
       * - DB Weight:
       * - Read: Multisig Storage, [Caller Account], Refund Account, Calls
       * - Write: Multisig Storage, [Caller Account], Refund Account, Calls
       *
       * # </weight>
       */
      cancelAsMulti: AugmentedSubmittable<
        (
          threshold: u16 | AnyNumber | Uint8Array,
          otherSignatories:
            | Vec<AccountId32>
            | (AccountId32 | string | Uint8Array)[],
          timepoint:
            | PalletMultisigTimepoint
            | { height?: any; index?: any }
            | string
            | Uint8Array,
          callHash: U8aFixed | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u16, Vec<AccountId32>, PalletMultisigTimepoint, U8aFixed]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    parachainSystem: {
      authorizeUpgrade: AugmentedSubmittable<
        (codeHash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      enactAuthorizedUpgrade: AugmentedSubmittable<
        (code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Set the current validation data.
       *
       * This should be invoked exactly once per block. It will panic at the
       * finalization phase if the call was not invoked.
       *
       * The dispatch origin for this call must be `Inherent`
       *
       * As a side effect, this function upgrades the current validation
       * function if the appropriate time has come.
       */
      setValidationData: AugmentedSubmittable<
        (
          data:
            | CumulusPrimitivesParachainInherentParachainInherentData
            | {
                validationData?: any;
                relayChainState?: any;
                downwardMessages?: any;
                horizontalMessages?: any;
              }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [CumulusPrimitivesParachainInherentParachainInherentData]
      >;
      sudoSendUpwardMessage: AugmentedSubmittable<
        (message: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    polkadotXcm: {
      /**
       * Execute an XCM message from a local, signed, origin.
       *
       * An event is deposited indicating whether `msg` could be executed
       * completely or only partially.
       *
       * No more than `max_weight` will be used in its attempted execution. If
       * this is less than the maximum amount of weight that the message could
       * take to be executed, then no execution attempt will be made.
       *
       * NOTE: A successful return to this does _not_ imply that the `msg` was
       * executed successfully to completion; only that _some_ of it was executed.
       */
      execute: AugmentedSubmittable<
        (
          message:
            | XcmVersionedXcm
            | { V0: any }
            | { V1: any }
            | { V2: any }
            | string
            | Uint8Array,
          maxWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [XcmVersionedXcm, u64]
      >;
      /**
       * Set a safe XCM version (the version that XCM should be encoded with if
       * the most recent version a destination can accept is unknown).
       *
       * - `origin`: Must be Root.
       * - `maybe_xcm_version`: The default XCM encoding version, or `None` to disable.
       */
      forceDefaultXcmVersion: AugmentedSubmittable<
        (
          maybeXcmVersion: Option<u32> | null | object | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Option<u32>]
      >;
      /**
       * Ask a location to notify us regarding their XCM version and any changes to it.
       *
       * - `origin`: Must be Root.
       * - `location`: The location to which we should subscribe for XCM version
       *   notifications.
       */
      forceSubscribeVersionNotify: AugmentedSubmittable<
        (
          location:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [XcmVersionedMultiLocation]
      >;
      /**
       * Require that a particular destination should no longer notify us
       * regarding any XCM version changes.
       *
       * - `origin`: Must be Root.
       * - `location`: The location to which we are currently subscribed for XCM
       *   version notifications which we no longer desire.
       */
      forceUnsubscribeVersionNotify: AugmentedSubmittable<
        (
          location:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [XcmVersionedMultiLocation]
      >;
      /**
       * Extoll that a particular destination can be communicated with through a
       * particular version of XCM.
       *
       * - `origin`: Must be Root.
       * - `location`: The destination that is being described.
       * - `xcm_version`: The latest version of XCM that `location` supports.
       */
      forceXcmVersion: AugmentedSubmittable<
        (
          location:
            | XcmV1MultiLocation
            | { parents?: any; interior?: any }
            | string
            | Uint8Array,
          xcmVersion: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [XcmV1MultiLocation, u32]
      >;
      /**
       * Transfer some assets from the local chain to the sovereign account of a
       * destination chain and forward a notification XCM.
       *
       * Fee payment on the destination side is made from the first asset listed
       * in the `assets` vector.
       *
       * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
       * - `dest`: Destination context for the assets. Will typically be
       *   `X2(Parent, Parachain(..))` to send from parachain to parachain, or
       *   `X1(Parachain(..))` to send from relay to parachain.
       * - `beneficiary`: A beneficiary location for the assets in the context of
       *   `dest`. Will generally be an `AccountId32` value.
       * - `assets`: The assets to be withdrawn. This should include the assets
       *   used to pay the fee on the `dest` side.
       * - `fee_asset_item`: The index into `assets` of the item which should be
       *   used to pay fees.
       * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
       */
      limitedReserveTransferAssets: AugmentedSubmittable<
        (
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          beneficiary:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          assets:
            | XcmVersionedMultiAssets
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          feeAssetItem: u32 | AnyNumber | Uint8Array,
          weightLimit:
            | XcmV2WeightLimit
            | { Unlimited: any }
            | { Limited: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          XcmVersionedMultiLocation,
          XcmVersionedMultiLocation,
          XcmVersionedMultiAssets,
          u32,
          XcmV2WeightLimit
        ]
      >;
      /**
       * Teleport some assets from the local chain to some destination chain.
       *
       * Fee payment on the destination side is made from the first asset listed
       * in the `assets` vector.
       *
       * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
       * - `dest`: Destination context for the assets. Will typically be
       *   `X2(Parent, Parachain(..))` to send from parachain to parachain, or
       *   `X1(Parachain(..))` to send from relay to parachain.
       * - `beneficiary`: A beneficiary location for the assets in the context of
       *   `dest`. Will generally be an `AccountId32` value.
       * - `assets`: The assets to be withdrawn. The first item should be the
       *   currency used to to pay the fee on the `dest` side. May not be empty.
       * - `fee_asset_item`: The index into `assets` of the item which should be
       *   used to pay fees.
       * - `weight_limit`: The remote-side weight limit, if any, for the XCM fee purchase.
       */
      limitedTeleportAssets: AugmentedSubmittable<
        (
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          beneficiary:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          assets:
            | XcmVersionedMultiAssets
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          feeAssetItem: u32 | AnyNumber | Uint8Array,
          weightLimit:
            | XcmV2WeightLimit
            | { Unlimited: any }
            | { Limited: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          XcmVersionedMultiLocation,
          XcmVersionedMultiLocation,
          XcmVersionedMultiAssets,
          u32,
          XcmV2WeightLimit
        ]
      >;
      /**
       * Transfer some assets from the local chain to the sovereign account of a
       * destination chain and forward a notification XCM.
       *
       * Fee payment on the destination side is made from the first asset listed
       * in the `assets` vector and fee-weight is calculated locally and thus
       * remote weights are assumed to be equal to local weights.
       *
       * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
       * - `dest`: Destination context for the assets. Will typically be
       *   `X2(Parent, Parachain(..))` to send from parachain to parachain, or
       *   `X1(Parachain(..))` to send from relay to parachain.
       * - `beneficiary`: A beneficiary location for the assets in the context of
       *   `dest`. Will generally be an `AccountId32` value.
       * - `assets`: The assets to be withdrawn. This should include the assets
       *   used to pay the fee on the `dest` side.
       * - `fee_asset_item`: The index into `assets` of the item which should be
       *   used to pay fees.
       */
      reserveTransferAssets: AugmentedSubmittable<
        (
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          beneficiary:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          assets:
            | XcmVersionedMultiAssets
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          feeAssetItem: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          XcmVersionedMultiLocation,
          XcmVersionedMultiLocation,
          XcmVersionedMultiAssets,
          u32
        ]
      >;
      send: AugmentedSubmittable<
        (
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          message:
            | XcmVersionedXcm
            | { V0: any }
            | { V1: any }
            | { V2: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [XcmVersionedMultiLocation, XcmVersionedXcm]
      >;
      /**
       * Teleport some assets from the local chain to some destination chain.
       *
       * Fee payment on the destination side is made from the first asset listed
       * in the `assets` vector and fee-weight is calculated locally and thus
       * remote weights are assumed to be equal to local weights.
       *
       * - `origin`: Must be capable of withdrawing the `assets` and executing XCM.
       * - `dest`: Destination context for the assets. Will typically be
       *   `X2(Parent, Parachain(..))` to send from parachain to parachain, or
       *   `X1(Parachain(..))` to send from relay to parachain.
       * - `beneficiary`: A beneficiary location for the assets in the context of
       *   `dest`. Will generally be an `AccountId32` value.
       * - `assets`: The assets to be withdrawn. The first item should be the
       *   currency used to to pay the fee on the `dest` side. May not be empty.
       * - `fee_asset_item`: The index into `assets` of the item which should be
       *   used to pay fees.
       */
      teleportAssets: AugmentedSubmittable<
        (
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          beneficiary:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          assets:
            | XcmVersionedMultiAssets
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          feeAssetItem: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          XcmVersionedMultiLocation,
          XcmVersionedMultiLocation,
          XcmVersionedMultiAssets,
          u32
        ]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    preimage: {
      /**
       * Register a preimage on-chain.
       *
       * If the preimage was previously requested, no fees or deposits are taken
       * for providing the preimage. Otherwise, a deposit is taken proportional
       * to the size of the preimage.
       */
      notePreimage: AugmentedSubmittable<
        (bytes: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Request a preimage be uploaded to the chain without paying any fees or deposits.
       *
       * If the preimage requests has already been provided on-chain, we
       * unreserve any deposit a user may have paid, and take the control of the
       * preimage out of their hands.
       */
      requestPreimage: AugmentedSubmittable<
        (hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Clear an unrequested preimage from the runtime storage.
       */
      unnotePreimage: AugmentedSubmittable<
        (hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Clear a previously made request for a preimage.
       *
       * NOTE: THIS MUST NOT BE CALLED ON `hash` MORE TIMES THAN `request_preimage`.
       */
      unrequestPreimage: AugmentedSubmittable<
        (hash: H256 | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    scheduler: {
      /**
       * Cancel an anonymously scheduled task.
       */
      cancel: AugmentedSubmittable<
        (
          when: u32 | AnyNumber | Uint8Array,
          index: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u32, u32]
      >;
      /**
       * Cancel a named scheduled task.
       */
      cancelNamed: AugmentedSubmittable<
        (id: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Anonymously schedule a task.
       */
      schedule: AugmentedSubmittable<
        (
          when: u32 | AnyNumber | Uint8Array,
          maybePeriodic:
            | Option<ITuple<[u32, u32]>>
            | null
            | object
            | string
            | Uint8Array,
          priority: u8 | AnyNumber | Uint8Array,
          call:
            | FrameSupportScheduleMaybeHashed
            | { Value: any }
            | { Hash: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u32, Option<ITuple<[u32, u32]>>, u8, FrameSupportScheduleMaybeHashed]
      >;
      /**
       * Anonymously schedule a task after a delay.
       *
       * # <weight>
       *
       * Same as [`schedule`].
       *
       * # </weight>
       */
      scheduleAfter: AugmentedSubmittable<
        (
          after: u32 | AnyNumber | Uint8Array,
          maybePeriodic:
            | Option<ITuple<[u32, u32]>>
            | null
            | object
            | string
            | Uint8Array,
          priority: u8 | AnyNumber | Uint8Array,
          call:
            | FrameSupportScheduleMaybeHashed
            | { Value: any }
            | { Hash: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u32, Option<ITuple<[u32, u32]>>, u8, FrameSupportScheduleMaybeHashed]
      >;
      /**
       * Schedule a named task.
       */
      scheduleNamed: AugmentedSubmittable<
        (
          id: Bytes | string | Uint8Array,
          when: u32 | AnyNumber | Uint8Array,
          maybePeriodic:
            | Option<ITuple<[u32, u32]>>
            | null
            | object
            | string
            | Uint8Array,
          priority: u8 | AnyNumber | Uint8Array,
          call:
            | FrameSupportScheduleMaybeHashed
            | { Value: any }
            | { Hash: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          Bytes,
          u32,
          Option<ITuple<[u32, u32]>>,
          u8,
          FrameSupportScheduleMaybeHashed
        ]
      >;
      /**
       * Schedule a named task after a delay.
       *
       * # <weight>
       *
       * Same as [`schedule_named`](Self::schedule_named).
       *
       * # </weight>
       */
      scheduleNamedAfter: AugmentedSubmittable<
        (
          id: Bytes | string | Uint8Array,
          after: u32 | AnyNumber | Uint8Array,
          maybePeriodic:
            | Option<ITuple<[u32, u32]>>
            | null
            | object
            | string
            | Uint8Array,
          priority: u8 | AnyNumber | Uint8Array,
          call:
            | FrameSupportScheduleMaybeHashed
            | { Value: any }
            | { Hash: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          Bytes,
          u32,
          Option<ITuple<[u32, u32]>>,
          u8,
          FrameSupportScheduleMaybeHashed
        ]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    session: {
      /**
       * Removes any session key(s) of the function caller.
       *
       * This doesn't take effect until the next session.
       *
       * The dispatch origin of this function must be Signed and the account
       * must be either be convertible to a validator ID using the chain's
       * typical addressing system (this usually means being a controller
       * account) or directly convertible into a validator ID (which usually
       * means being a stash account).
       *
       * # <weight>
       *
       * - Complexity: `O(1)` in number of key types. Actual cost depends on the
       *   number of length of `T::Keys::key_ids()` which is fixed.
       * - DbReads: `T::ValidatorIdOf`, `NextKeys`, `origin account`
       * - DbWrites: `NextKeys`, `origin account`
       * - DbWrites per key id: `KeyOwner`
       *
       * # </weight>
       */
      purgeKeys: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Sets the session key(s) of the function caller to `keys`. Allows an
       * account to set its session key prior to becoming a validator. This
       * doesn't take effect until the next session.
       *
       * The dispatch origin of this function must be signed.
       *
       * # <weight>
       *
       * - Complexity: `O(1)`. Actual cost depends on the number of length of
       *   `T::Keys::key_ids()` which is fixed.
       * - DbReads: `origin account`, `T::ValidatorIdOf`, `NextKeys`
       * - DbWrites: `origin account`, `NextKeys`
       * - DbReads per key id: `KeyOwner`
       * - DbWrites per key id: `KeyOwner`
       *
       * # </weight>
       */
      setKeys: AugmentedSubmittable<
        (
          keys:
            | DolphinRuntimeOpaqueSessionKeys
            | { aura?: any }
            | string
            | Uint8Array,
          proof: Bytes | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [DolphinRuntimeOpaqueSessionKeys, Bytes]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    sudo: {
      /**
       * Authenticates the current sudo key and sets the given AccountId (`new`)
       * as the new sudo key.
       *
       * The dispatch origin for this call must be _Signed_.
       *
       * # <weight>
       *
       * - O(1).
       * - Limited storage reads.
       * - One DB change.
       *
       * # </weight>
       */
      setKey: AugmentedSubmittable<
        (
          updated:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [MultiAddress]
      >;
      /**
       * Authenticates the sudo key and dispatches a function call with `Root` origin.
       *
       * The dispatch origin for this call must be _Signed_.
       *
       * # <weight>
       *
       * - O(1).
       * - Limited storage reads.
       * - One DB write (event).
       * - Weight of derivative `call` execution + 10,000.
       *
       * # </weight>
       */
      sudo: AugmentedSubmittable<
        (
          call: Call | { callIndex?: any; args?: any } | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Call]
      >;
      /**
       * Authenticates the sudo key and dispatches a function call with `Signed`
       * origin from a given account.
       *
       * The dispatch origin for this call must be _Signed_.
       *
       * # <weight>
       *
       * - O(1).
       * - Limited storage reads.
       * - One DB write (event).
       * - Weight of derivative `call` execution + 10,000.
       *
       * # </weight>
       */
      sudoAs: AugmentedSubmittable<
        (
          who:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array,
          call: Call | { callIndex?: any; args?: any } | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [MultiAddress, Call]
      >;
      /**
       * Authenticates the sudo key and dispatches a function call with `Root`
       * origin. This function does not check the weight of the call, and
       * instead allows the Sudo user to specify the weight of the call.
       *
       * The dispatch origin for this call must be _Signed_.
       *
       * # <weight>
       *
       * - O(1).
       * - The weight of this call is defined by the caller.
       *
       * # </weight>
       */
      sudoUncheckedWeight: AugmentedSubmittable<
        (
          call: Call | { callIndex?: any; args?: any } | string | Uint8Array,
          weight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Call, u64]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    system: {
      /**
       * A dispatch that will fill the block weight up to the given ratio.
       */
      fillBlock: AugmentedSubmittable<
        (
          ratio: Perbill | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Perbill]
      >;
      /**
       * Kill all storage items with a key that starts with the given prefix.
       *
       * **NOTE:** We rely on the Root origin to provide us the number of
       * subkeys under the prefix we are removing to accurately calculate the
       * weight of this function.
       */
      killPrefix: AugmentedSubmittable<
        (
          prefix: Bytes | string | Uint8Array,
          subkeys: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes, u32]
      >;
      /**
       * Kill some items from storage.
       */
      killStorage: AugmentedSubmittable<
        (
          keys: Vec<Bytes> | (Bytes | string | Uint8Array)[]
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<Bytes>]
      >;
      /**
       * Make some on-chain remark.
       *
       * # <weight>
       *
       * - `O(1)`
       *
       * # </weight>
       */
      remark: AugmentedSubmittable<
        (remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Make some on-chain remark and emit event.
       *
       * # <weight>
       *
       * - `O(b)` where b is the length of the remark.
       * - 1 event.
       *
       * # </weight>
       */
      remarkWithEvent: AugmentedSubmittable<
        (remark: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Set the new runtime code.
       *
       * # <weight>
       *
       * - `O(C + S)` where `C` length of `code` and `S` complexity of `can_set_code`
       * - 1 call to `can_set_code`: `O(S)` (calls `sp_io::misc::runtime_version`
       *   which is expensive).
       * - 1 storage write (codec `O(C)`).
       * - 1 digest item.
       * - 1 event. The weight of this function is dependent on the runtime, but
       *   generally this is very expensive. We will treat this as a full block.
       *
       * # </weight>
       */
      setCode: AugmentedSubmittable<
        (code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Set the new runtime code without doing any checks of the given `code`.
       *
       * # <weight>
       *
       * - `O(C)` where `C` length of `code`
       * - 1 storage write (codec `O(C)`).
       * - 1 digest item.
       * - 1 event. The weight of this function is dependent on the runtime. We
       *   will treat this as a full block. # </weight>
       */
      setCodeWithoutChecks: AugmentedSubmittable<
        (code: Bytes | string | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [Bytes]
      >;
      /**
       * Set the number of pages in the WebAssembly environment's heap.
       */
      setHeapPages: AugmentedSubmittable<
        (pages: u64 | AnyNumber | Uint8Array) => SubmittableExtrinsic<ApiType>,
        [u64]
      >;
      /**
       * Set some items of storage.
       */
      setStorage: AugmentedSubmittable<
        (
          items:
            | Vec<ITuple<[Bytes, Bytes]>>
            | [Bytes | string | Uint8Array, Bytes | string | Uint8Array][]
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<ITuple<[Bytes, Bytes]>>]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    technicalCommittee: {
      /**
       * Close a vote that is either approved, disapproved or whose voting
       * period has ended.
       *
       * May be called by any signed account in order to finish voting and close
       * the proposal.
       *
       * If called before the end of the voting period it will only close the
       * vote if it is has enough votes to be approved or disapproved.
       *
       * If called after the end of the voting period abstentions are counted as
       * rejections unless there is a prime member set and the prime member cast
       * an approval.
       *
       * If the close operation completes successfully with disapproval, the
       * transaction fee will be waived. Otherwise execution of the approved
       * operation will be charged to the caller.
       *
       * - `proposal_weight_bound`: The maximum amount of weight consumed by
       *   executing the closed proposal.
       * - `length_bound`: The upper bound for the length of the proposal in
       *   storage. Checked via `storage::read` so it is `size_of::<u32>() == 4`
       *   larger than the pure length.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(B + M + P1 + P2)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` is members-count (code- and governance-bounded)
       * - `P1` is the complexity of `proposal` preimage.
       * - `P2` is proposal-count (code-bounded)
       * - DB:
       * - 2 storage reads (`Members`: codec `O(M)`, `Prime`: codec `O(1)`)
       * - 3 mutations (`Voting`: codec `O(M)`, `ProposalOf`: codec `O(B)`,
       *   `Proposals`: codec `O(P2)`)
       * - Any mutations done while executing `proposal` (`P1`)
       * - Up to 3 events
       *
       * # </weight>
       */
      close: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array,
          index: Compact<u32> | AnyNumber | Uint8Array,
          proposalWeightBound: Compact<u64> | AnyNumber | Uint8Array,
          lengthBound: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, Compact<u32>, Compact<u64>, Compact<u32>]
      >;
      /**
       * Disapprove a proposal, close, and remove it from the system, regardless
       * of its current state.
       *
       * Must be called by the Root origin.
       *
       * Parameters:
       *
       * - `proposal_hash`: The hash of the proposal that should be disapproved.
       *
       * # <weight>
       *
       * Complexity: O(P) where P is the number of max proposals DB Weight:
       *
       * - Reads: Proposals
       * - Writes: Voting, Proposals, ProposalOf
       *
       * # </weight>
       */
      disapproveProposal: AugmentedSubmittable<
        (
          proposalHash: H256 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256]
      >;
      /**
       * Dispatch a proposal from a member using the `Member` origin.
       *
       * Origin must be a member of the collective.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(M + P)` where `M` members-count (code-bounded) and `P` complexity of
       *   dispatching `proposal`
       * - DB: 1 read (codec `O(M)`) + DB access of `proposal`
       * - 1 event
       *
       * # </weight>
       */
      execute: AugmentedSubmittable<
        (
          proposal:
            | Call
            | { callIndex?: any; args?: any }
            | string
            | Uint8Array,
          lengthBound: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Call, Compact<u32>]
      >;
      /**
       * Add a new proposal to either be voted on or executed directly.
       *
       * Requires the sender to be member.
       *
       * `threshold` determines whether `proposal` is executed directly
       * (`threshold < 2`) or put up for voting.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(B + M + P1)` or `O(B + M + P2)` where:
       * - `B` is `proposal` size in bytes (length-fee-bounded)
       * - `M` is members-count (code- and governance-bounded)
       * - Branching is influenced by `threshold` where:
       * - `P1` is proposal execution complexity (`threshold < 2`)
       * - `P2` is proposals-count (code-bounded) (`threshold >= 2`)
       * - DB:
       * - 1 storage read `is_member` (codec `O(M)`)
       * - 1 storage read `ProposalOf::contains_key` (codec `O(1)`)
       * - DB accesses influenced by `threshold`:
       * - EITHER storage accesses done by `proposal` (`threshold < 2`)
       * - OR proposal insertion (`threshold <= 2`)
       * - 1 storage mutation `Proposals` (codec `O(P2)`)
       * - 1 storage mutation `ProposalCount` (codec `O(1)`)
       * - 1 storage write `ProposalOf` (codec `O(B)`)
       * - 1 storage write `Voting` (codec `O(M)`)
       * - 1 event
       *
       * # </weight>
       */
      propose: AugmentedSubmittable<
        (
          threshold: Compact<u32> | AnyNumber | Uint8Array,
          proposal:
            | Call
            | { callIndex?: any; args?: any }
            | string
            | Uint8Array,
          lengthBound: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>, Call, Compact<u32>]
      >;
      /**
       * Set the collective's membership.
       *
       * - `new_members`: The new member list. Be nice to the chain and provide it sorted.
       * - `prime`: The prime member whose vote sets the default.
       * - `old_count`: The upper bound for the previous number of members in
       *   storage. Used for weight estimation.
       *
       * Requires root origin.
       *
       * NOTE: Does not enforce the expected `MaxMembers` limit on the amount of
       * members, but the weight estimations rely on it to estimate dispatchable weight.
       *
       * # WARNING:
       *
       * The `pallet-collective` can also be managed by logic outside of the
       * pallet through the implementation of the trait [`ChangeMembers`]. Any
       * call to `set_members` must be careful that the member set doesn't get
       * out of sync with other logic managing the member set.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(MP + N)` where:
       * - `M` old-members-count (code- and governance-bounded)
       * - `N` new-members-count (code- and governance-bounded)
       * - `P` proposals-count (code-bounded)
       * - DB:
       * - 1 storage mutation (codec `O(M)` read, `O(N)` write) for reading and
       *   writing the members
       * - 1 storage read (codec `O(P)`) for reading the proposals
       * - `P` storage mutations (codec `O(M)`) for updating the votes for each proposal
       * - 1 storage write (codec `O(1)`) for deleting the old `prime` and setting
       *   the new one
       *
       * # </weight>
       */
      setMembers: AugmentedSubmittable<
        (
          newMembers: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[],
          prime: Option<AccountId32> | null | object | string | Uint8Array,
          oldCount: u32 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<AccountId32>, Option<AccountId32>, u32]
      >;
      /**
       * Add an aye or nay vote for the sender to the given proposal.
       *
       * Requires the sender to be a member.
       *
       * Transaction fees will be waived if the member is voting on any
       * particular proposal for the first time and the call is successful.
       * Subsequent vote changes will charge a fee.
       *
       * # <weight>
       *
       * ## Weight
       *
       * - `O(M)` where `M` is members-count (code- and governance-bounded)
       * - DB:
       * - 1 storage read `Members` (codec `O(M)`)
       * - 1 storage mutation `Voting` (codec `O(M)`)
       * - 1 event
       *
       * # </weight>
       */
      vote: AugmentedSubmittable<
        (
          proposal: H256 | string | Uint8Array,
          index: Compact<u32> | AnyNumber | Uint8Array,
          approve: bool | boolean | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [H256, Compact<u32>, bool]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    technicalMembership: {
      /**
       * Add a member `who` to the set.
       *
       * May only be called from `T::AddOrigin`.
       */
      addMember: AugmentedSubmittable<
        (
          who: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Swap out the sending member for some other key `new`.
       *
       * May only be called from `Signed` origin of a current member.
       *
       * Prime membership is passed from the origin account to `new`, if extant.
       */
      changeKey: AugmentedSubmittable<
        (
          updated: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Remove the prime member if it exists.
       *
       * May only be called from `T::PrimeOrigin`.
       */
      clearPrime: AugmentedSubmittable<() => SubmittableExtrinsic<ApiType>, []>;
      /**
       * Remove a member `who` from the set.
       *
       * May only be called from `T::RemoveOrigin`.
       */
      removeMember: AugmentedSubmittable<
        (
          who: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Change the membership to a new set, disregarding the existing
       * membership. Be nice and pass `members` pre-sorted.
       *
       * May only be called from `T::ResetOrigin`.
       */
      resetMembers: AugmentedSubmittable<
        (
          members: Vec<AccountId32> | (AccountId32 | string | Uint8Array)[]
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<AccountId32>]
      >;
      /**
       * Set the prime member. Must be a current member.
       *
       * May only be called from `T::PrimeOrigin`.
       */
      setPrime: AugmentedSubmittable<
        (
          who: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32]
      >;
      /**
       * Swap out one member `remove` for another `add`.
       *
       * May only be called from `T::SwapOrigin`.
       *
       * Prime membership is _not_ passed from `remove` to `add`, if extant.
       */
      swapMember: AugmentedSubmittable<
        (
          remove: AccountId32 | string | Uint8Array,
          add: AccountId32 | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [AccountId32, AccountId32]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    timestamp: {
      /**
       * Set the current time.
       *
       * This call should be invoked exactly once per block. It will panic at
       * the finalization phase, if this call hasn't been invoked by that time.
       *
       * The timestamp should be greater than the previous one by the amount
       * specified by `MinimumPeriod`.
       *
       * The dispatch origin for this call must be `Inherent`.
       *
       * # <weight>
       *
       * - `O(1)` (Note that implementations of `OnTimestampSet` must also be `O(1)`)
       * - 1 storage read and 1 storage mutation (codec `O(1)`). (because of
       *   `DidUpdate::take` in `on_finalize`)
       * - 1 event handler `on_timestamp_set`. Must be `O(1)`.
       *
       * # </weight>
       */
      set: AugmentedSubmittable<
        (
          now: Compact<u64> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u64>]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    transactionPause: {
      /**
       * Pause an extrinsic by passing the extrinsic and corresponding pallet
       * names. Use names as they are written in the source code of the pallet.
       */
      pauseTransaction: AugmentedSubmittable<
        (
          palletName: Bytes | string | Uint8Array,
          functionName: Bytes | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes, Bytes]
      >;
      /**
       * Unpause an extrinsic by passing the extrinsic and corresponding pallet
       * names. Use names as they are written in the source code of the pallet.
       */
      unpauseTransaction: AugmentedSubmittable<
        (
          palletName: Bytes | string | Uint8Array,
          functionName: Bytes | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Bytes, Bytes]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    treasury: {
      /**
       * Approve a proposal. At a later time, the proposal will be allocated to
       * the beneficiary and the original deposit will be returned.
       *
       * May only be called from `T::ApproveOrigin`.
       *
       * # <weight>
       *
       * - Complexity: O(1).
       * - DbReads: `Proposals`, `Approvals`
       * - DbWrite: `Approvals`
       *
       * # </weight>
       */
      approveProposal: AugmentedSubmittable<
        (
          proposalId: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>]
      >;
      /**
       * Put forward a suggestion for spending. A deposit proportional to the
       * value is reserved and slashed if the proposal is rejected. It is
       * returned once the proposal is awarded.
       *
       * # <weight>
       *
       * - Complexity: O(1)
       * - DbReads: `ProposalCount`, `origin account`
       * - DbWrites: `ProposalCount`, `Proposals`, `origin account`
       *
       * # </weight>
       */
      proposeSpend: AugmentedSubmittable<
        (
          value: Compact<u128> | AnyNumber | Uint8Array,
          beneficiary:
            | MultiAddress
            | { Id: any }
            | { Index: any }
            | { Raw: any }
            | { Address32: any }
            | { Address20: any }
            | string
            | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u128>, MultiAddress]
      >;
      /**
       * Reject a proposed spend. The original deposit will be slashed.
       *
       * May only be called from `T::RejectOrigin`.
       *
       * # <weight>
       *
       * - Complexity: O(1)
       * - DbReads: `Proposals`, `rejected proposer account`
       * - DbWrites: `Proposals`, `rejected proposer account`
       *
       * # </weight>
       */
      rejectProposal: AugmentedSubmittable<
        (
          proposalId: Compact<u32> | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [Compact<u32>]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    utility: {
      /**
       * Send a call through an indexed pseudonym of the sender.
       *
       * Filter from origin are passed along. The call will be dispatched with
       * an origin which use the same filter as the origin of this call.
       *
       * NOTE: If you need to ensure that any account-based filtering is not
       * honored (i.e. because you expect `proxy` to have been used prior in the
       * call stack and you do not want the call restrictions to apply to any
       * sub-accounts), then use `as_multi_threshold_1` in the Multisig pallet instead.
       *
       * NOTE: Prior to version *12, this was called `as_limited_sub`.
       *
       * The dispatch origin for this call must be _Signed_.
       */
      asDerivative: AugmentedSubmittable<
        (
          index: u16 | AnyNumber | Uint8Array,
          call: Call | { callIndex?: any; args?: any } | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u16, Call]
      >;
      /**
       * Send a batch of dispatch calls.
       *
       * May be called from any origin.
       *
       * - `calls`: The calls to be dispatched from the same origin. The number of
       *   call must not exceed the constant: `batched_calls_limit` (available
       *   in constant metadata).
       *
       * If origin is root then call are dispatch without checking origin
       * filter. (This includes bypassing `frame_system::Config::BaseCallFilter`).
       *
       * # <weight>
       *
       * - Complexity: O(C) where C is the number of calls to be batched.
       *
       * # </weight>
       *
       * This will return `Ok` in all circumstances. To determine the success of
       * the batch, an event is deposited. If a call failed and the batch was
       * interrupted, then the `BatchInterrupted` event is deposited, along with
       * the number of successful calls made and the error of the failed call.
       * If all were successful, then the `BatchCompleted` event is deposited.
       */
      batch: AugmentedSubmittable<
        (
          calls:
            | Vec<Call>
            | (Call | { callIndex?: any; args?: any } | string | Uint8Array)[]
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<Call>]
      >;
      /**
       * Send a batch of dispatch calls and atomically execute them. The whole
       * transaction will rollback and fail if any of the calls failed.
       *
       * May be called from any origin.
       *
       * - `calls`: The calls to be dispatched from the same origin. The number of
       *   call must not exceed the constant: `batched_calls_limit` (available
       *   in constant metadata).
       *
       * If origin is root then call are dispatch without checking origin
       * filter. (This includes bypassing `frame_system::Config::BaseCallFilter`).
       *
       * # <weight>
       *
       * - Complexity: O(C) where C is the number of calls to be batched.
       *
       * # </weight>
       */
      batchAll: AugmentedSubmittable<
        (
          calls:
            | Vec<Call>
            | (Call | { callIndex?: any; args?: any } | string | Uint8Array)[]
        ) => SubmittableExtrinsic<ApiType>,
        [Vec<Call>]
      >;
      /**
       * Dispatches a function call with a provided origin.
       *
       * The dispatch origin for this call must be _Root_.
       *
       * # <weight>
       *
       * - O(1).
       * - Limited storage reads.
       * - One DB write (event).
       * - Weight of derivative `call` execution + T::WeightInfo::dispatch_as().
       *
       * # </weight>
       */
      dispatchAs: AugmentedSubmittable<
        (
          asOrigin:
            | DolphinRuntimeOriginCaller
            | { system: any }
            | { Void: any }
            | { Council: any }
            | { TechnicalCommittee: any }
            | { PolkadotXcm: any }
            | { CumulusXcm: any }
            | string
            | Uint8Array,
          call: Call | { callIndex?: any; args?: any } | string | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [DolphinRuntimeOriginCaller, Call]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    xcmpQueue: {
      /**
       * Services a single overweight XCM.
       *
       * - `origin`: Must pass `ExecuteOverweightOrigin`.
       * - `index`: The index of the overweight XCM to service
       * - `weight_limit`: The amount of weight that XCM execution may take.
       *
       * Errors:
       *
       * - `BadOverweightIndex`: XCM under `index` is not found in the
       *   `Overweight` storage map.
       * - `BadXcm`: XCM under `index` cannot be properly decoded into a valid XCM format.
       * - `WeightOverLimit`: XCM execution may use greater `weight_limit`.
       *
       * Events:
       *
       * - `OverweightServiced`: On success.
       */
      serviceOverweight: AugmentedSubmittable<
        (
          index: u64 | AnyNumber | Uint8Array,
          weightLimit: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [u64, u64]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
    xTokens: {
      /**
       * Transfer native currencies.
       *
       * `dest_weight` is the weight for XCM execution on the dest chain, and it
       * would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be received.
       *
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered by
       * the network, and if the receiving chain would handle messages correctly.
       */
      transfer: AugmentedSubmittable<
        (
          currencyId:
            | DolphinRuntimeCurrencyId
            | { MantaCurrency: any }
            | string
            | Uint8Array,
          amount: u128 | AnyNumber | Uint8Array,
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          destWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [DolphinRuntimeCurrencyId, u128, XcmVersionedMultiLocation, u64]
      >;
      /**
       * Transfer `MultiAsset`.
       *
       * `dest_weight` is the weight for XCM execution on the dest chain, and it
       * would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be received.
       *
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered by
       * the network, and if the receiving chain would handle messages correctly.
       */
      transferMultiasset: AugmentedSubmittable<
        (
          asset:
            | XcmVersionedMultiAsset
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          destWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [XcmVersionedMultiAsset, XcmVersionedMultiLocation, u64]
      >;
      /**
       * Transfer several `MultiAsset` specifying the item to be used as fee
       *
       * `dest_weight` is the weight for XCM execution on the dest chain, and it
       * would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be received.
       *
       * `fee_item` is index of the MultiAssets that we want to use for payment
       *
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered by
       * the network, and if the receiving chain would handle messages correctly.
       */
      transferMultiassets: AugmentedSubmittable<
        (
          assets:
            | XcmVersionedMultiAssets
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          feeItem: u32 | AnyNumber | Uint8Array,
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          destWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [XcmVersionedMultiAssets, u32, XcmVersionedMultiLocation, u64]
      >;
      /**
       * Transfer `MultiAsset` specifying the fee and amount as separate.
       *
       * `dest_weight` is the weight for XCM execution on the dest chain, and it
       * would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be received.
       *
       * `fee` is the multiasset to be spent to pay for execution in destination
       * chain. Both fee and amount will be subtracted form the callers balance
       * For now we only accept fee and asset having the same `MultiLocation` id.
       *
       * If `fee` is not high enough to cover for the execution costs in the
       * destination chain, then the assets will be trapped in the destination chain
       *
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered by
       * the network, and if the receiving chain would handle messages correctly.
       */
      transferMultiassetWithFee: AugmentedSubmittable<
        (
          asset:
            | XcmVersionedMultiAsset
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          fee:
            | XcmVersionedMultiAsset
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          destWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          XcmVersionedMultiAsset,
          XcmVersionedMultiAsset,
          XcmVersionedMultiLocation,
          u64
        ]
      >;
      /**
       * Transfer several currencies specifying the item to be used as fee
       *
       * `dest_weight` is the weight for XCM execution on the dest chain, and it
       * would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be received.
       *
       * `fee_item` is index of the currencies tuple that we want to use for payment
       *
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered by
       * the network, and if the receiving chain would handle messages correctly.
       */
      transferMulticurrencies: AugmentedSubmittable<
        (
          currencies:
            | Vec<ITuple<[DolphinRuntimeCurrencyId, u128]>>
            | [
                (
                  | DolphinRuntimeCurrencyId
                  | { MantaCurrency: any }
                  | string
                  | Uint8Array
                ),
                u128 | AnyNumber | Uint8Array
              ][],
          feeItem: u32 | AnyNumber | Uint8Array,
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          destWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [
          Vec<ITuple<[DolphinRuntimeCurrencyId, u128]>>,
          u32,
          XcmVersionedMultiLocation,
          u64
        ]
      >;
      /**
       * Transfer native currencies specifying the fee and amount as separate.
       *
       * `dest_weight` is the weight for XCM execution on the dest chain, and it
       * would be charged from the transferred assets. If set below
       * requirements, the execution may fail and assets wouldn't be received.
       *
       * `fee` is the amount to be spent to pay for execution in destination
       * chain. Both fee and amount will be subtracted form the callers balance.
       *
       * If `fee` is not high enough to cover for the execution costs in the
       * destination chain, then the assets will be trapped in the destination chain
       *
       * It's a no-op if any error on local XCM execution or message sending.
       * Note sending assets out per se doesn't guarantee they would be
       * received. Receiving depends on if the XCM message could be delivered by
       * the network, and if the receiving chain would handle messages correctly.
       */
      transferWithFee: AugmentedSubmittable<
        (
          currencyId:
            | DolphinRuntimeCurrencyId
            | { MantaCurrency: any }
            | string
            | Uint8Array,
          amount: u128 | AnyNumber | Uint8Array,
          fee: u128 | AnyNumber | Uint8Array,
          dest:
            | XcmVersionedMultiLocation
            | { V0: any }
            | { V1: any }
            | string
            | Uint8Array,
          destWeight: u64 | AnyNumber | Uint8Array
        ) => SubmittableExtrinsic<ApiType>,
        [DolphinRuntimeCurrencyId, u128, u128, XcmVersionedMultiLocation, u64]
      >;
      /**
       * Generic tx
       */
      [key: string]: SubmittableExtrinsicFunction<ApiType>;
    };
  } // AugmentedSubmittables
} // declare module
