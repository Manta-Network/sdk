// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api-base/types';
import type { Data } from '@polkadot/types';
import type { Bytes, Option, U8aFixed, Vec, bool, u32, u64 } from '@polkadot/types-codec';
import type { AnyNumber, ITuple } from '@polkadot/types-codec/types';
import type { UncleEntryItem } from '@polkadot/types/interfaces/authorship';
import type { BalanceLock, VestingSchedule } from '@polkadot/types/interfaces/balances';
import type { ProposalIndex, Votes } from '@polkadot/types/interfaces/collective';
import type { AuthorityId } from '@polkadot/types/interfaces/consensus';
import type { CodeHash, ContractInfo, Gas, PrefabWasmModule, Schedule } from '@polkadot/types/interfaces/contracts';
import type { Conviction, PropIndex, Proposal, ReferendumIndex, ReferendumInfo } from '@polkadot/types/interfaces/democracy';
import type { Vote, VoteThreshold } from '@polkadot/types/interfaces/elections';
import type { AuthorityList, SetId, StoredPendingChange, StoredState } from '@polkadot/types/interfaces/grandpa';
import type { RegistrarInfo, Registration } from '@polkadot/types/interfaces/identity';
import type { AuthIndex } from '@polkadot/types/interfaces/imOnline';
import type { Kind, OffenceDetails, OpaqueTimeSlot, ReportIdOf } from '@polkadot/types/interfaces/offences';
import type { AccountId, AccountIndex, Balance, BalanceOf, BlockNumber, Hash, Index, KeyTypeId, Moment, Perbill, ValidatorId, Weight } from '@polkadot/types/interfaces/runtime';
import type { Keys, SessionIndex } from '@polkadot/types/interfaces/session';
import type { EraIndex, EraPoints, Exposure, Forcing, MomentOf, Nominations, RewardDestination, SlashingSpans, SpanIndex, SpanRecord, StakingLedger, UnappliedSlash, ValidatorPrefs } from '@polkadot/types/interfaces/staking';
import type { DigestOf, EventIndex, EventRecord } from '@polkadot/types/interfaces/system';
import type { OpenTip, TreasuryProposal } from '@polkadot/types/interfaces/treasury';
import type { Multiplier } from '@polkadot/types/interfaces/txpayment';
import type { Multisig } from '@polkadot/types/interfaces/utility';
import type { Observable } from '@polkadot/types/types';
import type { ProposalRecord } from 'sample-polkadotjs-typegen/interfaces/signaling';
import type { VoteRecord } from 'sample-polkadotjs-typegen/interfaces/voting';

declare module '@polkadot/api-base/types/storage' {
  export interface AugmentedQueries<ApiType extends ApiTypes> {
    authorship: {
      /**
       * Author of current block.
       **/
      author: AugmentedQuery<ApiType, () => Observable<Option<AccountId>>, []>;
      /**
       * Whether uncles were already set in this block.
       **/
      didSetUncles: AugmentedQuery<ApiType, () => Observable<bool>, []>;
      /**
       * Uncles
       **/
      uncles: AugmentedQuery<ApiType, () => Observable<Vec<UncleEntryItem>>, []>;
    };
    balances: {
      /**
       * The 'free' balance of a given account.
       * 
       * This is the only balance that matters in terms of most operations on tokens. It
       * alone is used to determine the balance when in the contract execution environment. When this
       * balance falls below the value of `ExistentialDeposit`, then the 'current account' is
       * deleted: specifically `FreeBalance`. Further, the `OnFreeBalanceZero` callback
       * is invoked, giving a chance to external modules to clean up data associated with
       * the deleted account.
       * 
       * `frame_system::AccountNonce` is also deleted if `ReservedBalance` is also zero (it also gets
       * collapsed to zero if it ever becomes less than `ExistentialDeposit`.
       **/
      freeBalance: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Balance>, [AccountId]>;
      /**
       * Any liquidity locks on some account balances.
       **/
      locks: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Vec<BalanceLock>>, [AccountId]>;
      /**
       * The amount of the balance of a given account that is externally reserved; this can still get
       * slashed, but gets slashed last of all.
       * 
       * This balance is a 'reserve' balance that other subsystems use in order to set aside tokens
       * that are still 'owned' by the account holder, but which are suspendable.
       * 
       * When this balance falls below the value of `ExistentialDeposit`, then this 'reserve account'
       * is deleted: specifically, `ReservedBalance`.
       * 
       * `frame_system::AccountNonce` is also deleted if `FreeBalance` is also zero (it also gets
       * collapsed to zero if it ever becomes less than `ExistentialDeposit`.)
       **/
      reservedBalance: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Balance>, [AccountId]>;
      /**
       * The total units issued in the system.
       **/
      totalIssuance: AugmentedQuery<ApiType, () => Observable<Balance>, []>;
      /**
       * Information regarding the vesting of a given account.
       **/
      vesting: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<VestingSchedule>>, [AccountId]>;
    };
    contracts: {
      /**
       * The subtrie counter.
       **/
      accountCounter: AugmentedQuery<ApiType, () => Observable<u64>, []>;
      /**
       * A mapping between an original code hash and instrumented wasm code, ready for execution.
       **/
      codeStorage: AugmentedQuery<ApiType, (arg: CodeHash | string | Uint8Array) => Observable<Option<PrefabWasmModule>>, [CodeHash]>;
      /**
       * The code associated with a given account.
       **/
      contractInfoOf: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<ContractInfo>>, [AccountId]>;
      /**
       * Current cost schedule for contracts.
       **/
      currentSchedule: AugmentedQuery<ApiType, () => Observable<Schedule>, []>;
      /**
       * The price of one unit of gas.
       **/
      gasPrice: AugmentedQuery<ApiType, () => Observable<BalanceOf>, []>;
      /**
       * Gas spent so far in this block.
       **/
      gasSpent: AugmentedQuery<ApiType, () => Observable<Gas>, []>;
      /**
       * A mapping from an original code hash to the original code, untouched by instrumentation.
       **/
      pristineCode: AugmentedQuery<ApiType, (arg: CodeHash | string | Uint8Array) => Observable<Option<Bytes>>, [CodeHash]>;
    };
    council: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId>>, []>;
      /**
       * Proposals so far.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Actual proposal for a given hash, if it's current.
       **/
      proposalOf: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<Option<Proposal>>, [Hash]>;
      /**
       * The hashes of the active proposals.
       **/
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<Hash>>, []>;
      /**
       * Votes on a given proposal, if it is ongoing.
       **/
      voting: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<Option<Votes>>, [Hash]>;
    };
    democracy: {
      /**
       * A record of who vetoed what. Maps proposal hash to a possible existent block number
       * (until when it may not be resubmitted) and who vetoed it.
       **/
      blacklist: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<Option<ITuple<[BlockNumber, Vec<AccountId>]>>>, [Hash]>;
      /**
       * Record of all proposals that have been subject to emergency cancellation.
       **/
      cancellations: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<bool>, [Hash]>;
      /**
       * Get the account (and lock periods) to which another account is delegating vote.
       **/
      delegations: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<ITuple<[AccountId, Conviction]>>, [AccountId]>;
      /**
       * Those who have locked a deposit.
       **/
      depositOf: AugmentedQuery<ApiType, (arg: PropIndex | AnyNumber | Uint8Array) => Observable<Option<ITuple<[BalanceOf, Vec<AccountId>]>>>, [PropIndex]>;
      /**
       * Queue of successful referenda to be dispatched. Stored ordered by block number.
       **/
      dispatchQueue: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[BlockNumber, Hash, ReferendumIndex]>>>, []>;
      /**
       * True if the last referendum tabled was submitted externally. False if it was a public
       * proposal.
       **/
      lastTabledWasExternal: AugmentedQuery<ApiType, () => Observable<bool>, []>;
      /**
       * The lowest referendum index representing an unbaked referendum. Equal to
       * `ReferendumCount` if there isn't a unbaked referendum.
       **/
      lowestUnbaked: AugmentedQuery<ApiType, () => Observable<ReferendumIndex>, []>;
      /**
       * The referendum to be tabled whenever it would be valid to table an external proposal.
       * This happens when a referendum needs to be tabled and one of two conditions are met:
       * - `LastTabledWasExternal` is `false`; or
       * - `PublicProps` is empty.
       **/
      nextExternal: AugmentedQuery<ApiType, () => Observable<Option<ITuple<[Hash, VoteThreshold]>>>, []>;
      /**
       * Map of hashes to the proposal preimage, along with who registered it and their deposit.
       * The block number is the block at which it was deposited.
       **/
      preimages: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<Option<ITuple<[Bytes, AccountId, BalanceOf, BlockNumber]>>>, [Hash]>;
      /**
       * Who is able to vote for whom. Value is the fund-holding account, key is the
       * vote-transaction-sending account.
       **/
      proxy: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<AccountId>>, [AccountId]>;
      /**
       * The number of (public) proposals that have been made so far.
       **/
      publicPropCount: AugmentedQuery<ApiType, () => Observable<PropIndex>, []>;
      /**
       * The public proposals. Unsorted. The second item is the proposal's hash.
       **/
      publicProps: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[PropIndex, Hash, AccountId]>>>, []>;
      /**
       * The next free referendum index, aka the number of referenda started so far.
       **/
      referendumCount: AugmentedQuery<ApiType, () => Observable<ReferendumIndex>, []>;
      /**
       * Information concerning any given referendum.
       **/
      referendumInfoOf: AugmentedQuery<ApiType, (arg: ReferendumIndex | AnyNumber | Uint8Array) => Observable<Option<ReferendumInfo>>, [ReferendumIndex]>;
      /**
       * Get the vote in a given referendum of a particular voter. The result is meaningful only
       * if `voters_for` includes the voter when called with the referendum (you'll get the
       * default `Vote` value otherwise). If you don't want to check `voters_for`, then you can
       * also check for simple existence with `VoteOf::exists` first.
       **/
      voteOf: AugmentedQuery<ApiType, (arg: ITuple<[ReferendumIndex, AccountId]> | [ReferendumIndex | AnyNumber | Uint8Array, AccountId | string | Uint8Array]) => Observable<Vote>, [ITuple<[ReferendumIndex, AccountId]>]>;
      /**
       * Get the voters for the current proposal.
       **/
      votersFor: AugmentedQuery<ApiType, (arg: ReferendumIndex | AnyNumber | Uint8Array) => Observable<Vec<AccountId>>, [ReferendumIndex]>;
    };
    elections: {
      /**
       * The present candidate list. Sorted based on account-id. A current member or a runner can
       * never enter this vector and is always implicitly assumed to be a candidate.
       **/
      candidates: AugmentedQuery<ApiType, () => Observable<Vec<AccountId>>, []>;
      /**
       * The total number of vote rounds that have happened, excluding the upcoming one.
       **/
      electionRounds: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * The current elected membership. Sorted based on account id.
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[AccountId, BalanceOf]>>>, []>;
      /**
       * The current runners_up. Sorted based on low to high merit (worse to best runner).
       **/
      runnersUp: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[AccountId, BalanceOf]>>>, []>;
      /**
       * Locked stake of a voter.
       **/
      stakeOf: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<BalanceOf>, [AccountId]>;
      /**
       * Votes of a particular voter, with the round index of the votes.
       **/
      votesOf: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Vec<AccountId>>, [AccountId]>;
    };
    grandpa: {
      /**
       * DEPRECATED
       * 
       * This used to store the current authority set, which has been migrated to the well-known
       * GRANDPA_AUTHORITES_KEY unhashed key.
       **/
      authorities: AugmentedQuery<ApiType, () => Observable<AuthorityList>, []>;
      /**
       * The number of changes (both in terms of keys and underlying economic responsibilities)
       * in the "set" of Grandpa validators from genesis.
       **/
      currentSetId: AugmentedQuery<ApiType, () => Observable<SetId>, []>;
      /**
       * next block number where we can force a change.
       **/
      nextForced: AugmentedQuery<ApiType, () => Observable<Option<BlockNumber>>, []>;
      /**
       * Pending change: (signaled at, scheduled change).
       **/
      pendingChange: AugmentedQuery<ApiType, () => Observable<Option<StoredPendingChange>>, []>;
      /**
       * A mapping from grandpa set ID to the index of the *most recent* session for which its members were responsible.
       **/
      setIdSession: AugmentedQuery<ApiType, (arg: SetId | AnyNumber | Uint8Array) => Observable<Option<SessionIndex>>, [SetId]>;
      /**
       * `true` if we are currently stalled.
       **/
      stalled: AugmentedQuery<ApiType, () => Observable<Option<ITuple<[BlockNumber, BlockNumber]>>>, []>;
      /**
       * State of the current authority set.
       **/
      state: AugmentedQuery<ApiType, () => Observable<StoredState>, []>;
    };
    identity: {
      /**
       * Information that is pertinent to identify the entity behind an account.
       **/
      identityOf: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<Registration>>, [AccountId]>;
      /**
       * The set of registrars. Not expected to get very big as can only be added through a
       * special origin (likely a council motion).
       * 
       * The index into this can be cast to `RegistrarIndex` to get a valid value.
       **/
      registrars: AugmentedQuery<ApiType, () => Observable<Vec<Option<RegistrarInfo>>>, []>;
      /**
       * Alternative "sub" identities of this account.
       * 
       * The first item is the deposit, the second is a vector of the accounts.
       **/
      subsOf: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<ITuple<[BalanceOf, Vec<AccountId>]>>, [AccountId]>;
      /**
       * The super-identity of an alternative "sub" identity together with its name, within that
       * context. If the account is not some other account's sub-identity, then just `None`.
       **/
      superOf: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<ITuple<[AccountId, Data]>>>, [AccountId]>;
    };
    imOnline: {
      /**
       * For each session index, we keep a mapping of `T::ValidatorId` to the
       * number of blocks authored by the given authority.
       **/
      authoredBlocks: AugmentedQuery<ApiType, (arg1: SessionIndex | AnyNumber | Uint8Array, arg2: ValidatorId | string | Uint8Array) => Observable<u32>, [SessionIndex, ValidatorId]>;
      /**
       * The block number after which it's ok to send heartbeats in current session.
       * 
       * At the beginning of each session we set this to a value that should
       * fall roughly in the middle of the session duration.
       * The idea is to first wait for the validators to produce a block
       * in the current session, so that the heartbeat later on will not be necessary.
       **/
      heartbeatAfter: AugmentedQuery<ApiType, () => Observable<BlockNumber>, []>;
      /**
       * The current set of keys that may issue a heartbeat.
       **/
      keys: AugmentedQuery<ApiType, () => Observable<Vec<AuthorityId>>, []>;
      /**
       * For each session index, we keep a mapping of `AuthIndex`
       * to `offchain::OpaqueNetworkState`.
       **/
      receivedHeartbeats: AugmentedQuery<ApiType, (arg1: SessionIndex | AnyNumber | Uint8Array, arg2: AuthIndex | AnyNumber | Uint8Array) => Observable<Option<Bytes>>, [SessionIndex, AuthIndex]>;
    };
    indices: {
      /**
       * The enumeration sets.
       **/
      enumSet: AugmentedQuery<ApiType, (arg: AccountIndex | AnyNumber | Uint8Array) => Observable<Vec<AccountId>>, [AccountIndex]>;
      /**
       * The next free enumeration set.
       **/
      nextEnumSet: AugmentedQuery<ApiType, () => Observable<AccountIndex>, []>;
    };
    nicks: {
      /**
       * The lookup table for names.
       **/
      nameOf: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<ITuple<[Bytes, BalanceOf]>>>, [AccountId]>;
    };
    offences: {
      /**
       * A vector of reports of the same kind that happened at the same time slot.
       **/
      concurrentReportsIndex: AugmentedQuery<ApiType, (arg1: Kind | string | Uint8Array, arg2: OpaqueTimeSlot | string | Uint8Array) => Observable<Vec<ReportIdOf>>, [Kind, OpaqueTimeSlot]>;
      /**
       * The primary structure that holds all offence records keyed by report identifiers.
       **/
      reports: AugmentedQuery<ApiType, (arg: ReportIdOf | string | Uint8Array) => Observable<Option<OffenceDetails>>, [ReportIdOf]>;
      /**
       * Enumerates all reports of a kind along with the time they happened.
       * 
       * All reports are sorted by the time of offence.
       * 
       * Note that the actual type of this mapping is `Vec<u8>`, this is because values of
       * different types are not supported at the moment so we are doing the manual serialization.
       **/
      reportsByKindIndex: AugmentedQuery<ApiType, (arg: Kind | string | Uint8Array) => Observable<Bytes>, [Kind]>;
    };
    randomnessCollectiveFlip: {
      /**
       * Series of block headers from the last 81 blocks that acts as random seed material. This
       * is arranged as a ring buffer with `block_number % 81` being the index into the `Vec` of
       * the oldest hash.
       **/
      randomMaterial: AugmentedQuery<ApiType, () => Observable<Vec<Hash>>, []>;
    };
    session: {
      /**
       * Current index of the session.
       **/
      currentIndex: AugmentedQuery<ApiType, () => Observable<SessionIndex>, []>;
      /**
       * Indices of disabled validators.
       * 
       * The set is cleared when `on_session_ending` returns a new set of identities.
       **/
      disabledValidators: AugmentedQuery<ApiType, () => Observable<Vec<u32>>, []>;
      /**
       * The owner of a key. The second key is the `KeyTypeId` + the encoded key.
       * 
       * The first key is always `DEDUP_KEY_PREFIX` to have all the data in the same branch of
       * the trie. Having all data in the same branch should prevent slowing down other queries.
       **/
      keyOwner: AugmentedQuery<ApiType, (arg1: Bytes | string | Uint8Array, arg2: ITuple<[KeyTypeId, Bytes]> | [KeyTypeId | AnyNumber | Uint8Array, Bytes | string | Uint8Array]) => Observable<Option<ValidatorId>>, [Bytes, ITuple<[KeyTypeId, Bytes]>]>;
      /**
       * The next session keys for a validator.
       * 
       * The first key is always `DEDUP_KEY_PREFIX` to have all the data in the same branch of
       * the trie. Having all data in the same branch should prevent slowing down other queries.
       **/
      nextKeys: AugmentedQuery<ApiType, (arg1: Bytes | string | Uint8Array, arg2: ValidatorId | string | Uint8Array) => Observable<Option<Keys>>, [Bytes, ValidatorId]>;
      /**
       * True if the underlying economic identities or weighting behind the validators
       * has changed in the queued validator set.
       **/
      queuedChanged: AugmentedQuery<ApiType, () => Observable<bool>, []>;
      /**
       * The queued keys for the next session. When the next session begins, these keys
       * will be used to determine the validator's session keys.
       **/
      queuedKeys: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[ValidatorId, Keys]>>>, []>;
      /**
       * The current set of validators.
       **/
      validators: AugmentedQuery<ApiType, () => Observable<Vec<ValidatorId>>, []>;
    };
    signaling: {
      /**
       * A list of active proposals along with the time at which they complete.
       **/
      activeProposals: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[Hash, BlockNumber]>>>, []>;
      /**
       * A list of completed proposals, pending deletion
       **/
      completedProposals: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[Hash, BlockNumber]>>>, []>;
      /**
       * A list of all extant proposals.
       **/
      inactiveProposals: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[Hash, BlockNumber]>>>, []>;
      /**
       * The total number of proposals created thus far.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * Registration bond
       **/
      proposalCreationBond: AugmentedQuery<ApiType, () => Observable<BalanceOf>, []>;
      /**
       * Map for retrieving the information about any proposal from its hash.
       **/
      proposalOf: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<Option<ProposalRecord>>, [Hash]>;
      /**
       * Amount of time a proposal remains in "Voting" stage.
       **/
      votingLength: AugmentedQuery<ApiType, () => Observable<BlockNumber>, []>;
    };
    staking: {
      /**
       * Map from all locked "stash" accounts to the controller account.
       **/
      bonded: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<AccountId>>, [AccountId]>;
      /**
       * A mapping from still-bonded eras to the first session index of that era.
       **/
      bondedEras: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[EraIndex, SessionIndex]>>>, []>;
      /**
       * The amount of currency given to reporters of a slash event which was
       * canceled by extraordinary circumstances (e.g. governance).
       **/
      canceledSlashPayout: AugmentedQuery<ApiType, () => Observable<BalanceOf>, []>;
      /**
       * The currently elected validator set keyed by stash account ID.
       **/
      currentElected: AugmentedQuery<ApiType, () => Observable<Vec<AccountId>>, []>;
      /**
       * The current era index.
       **/
      currentEra: AugmentedQuery<ApiType, () => Observable<EraIndex>, []>;
      /**
       * Rewards for the current era. Using indices of current elected set.
       **/
      currentEraPointsEarned: AugmentedQuery<ApiType, () => Observable<EraPoints>, []>;
      /**
       * The start of the current era.
       **/
      currentEraStart: AugmentedQuery<ApiType, () => Observable<MomentOf>, []>;
      /**
       * The session index at which the current era started.
       **/
      currentEraStartSessionIndex: AugmentedQuery<ApiType, () => Observable<SessionIndex>, []>;
      /**
       * The earliest era for which we have a pending, unapplied slash.
       **/
      earliestUnappliedSlash: AugmentedQuery<ApiType, () => Observable<Option<EraIndex>>, []>;
      /**
       * True if the next session change will be a new era regardless of index.
       **/
      forceEra: AugmentedQuery<ApiType, () => Observable<Forcing>, []>;
      /**
       * Any validators that may never be slashed or forcibly kicked. It's a Vec since they're
       * easy to initialize and the performance hit is minimal (we expect no more than four
       * invulnerables) and restricted to testnets.
       **/
      invulnerables: AugmentedQuery<ApiType, () => Observable<Vec<AccountId>>, []>;
      /**
       * Map from all (unlocked) "controller" accounts to the info regarding the staking.
       **/
      ledger: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<StakingLedger>>, [AccountId]>;
      /**
       * Minimum number of staking participants before emergency conditions are imposed.
       **/
      minimumValidatorCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * The map from nominator stash key to the set of stash keys of all validators to nominate.
       * 
       * NOTE: is private so that we can ensure upgraded before all typical accesses.
       * Direct storage APIs can still bypass this protection.
       **/
      nominators: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<Nominations>>, [AccountId]>;
      /**
       * All slashing events on nominators, mapped by era to the highest slash value of the era.
       **/
      nominatorSlashInEra: AugmentedQuery<ApiType, (arg1: EraIndex | AnyNumber | Uint8Array, arg2: AccountId | string | Uint8Array) => Observable<Option<BalanceOf>>, [EraIndex, AccountId]>;
      /**
       * Where the reward payment should be made. Keyed by stash.
       **/
      payee: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<RewardDestination>, [AccountId]>;
      /**
       * Slashing spans for stash accounts.
       **/
      slashingSpans: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Option<SlashingSpans>>, [AccountId]>;
      /**
       * The percentage of the slash that is distributed to reporters.
       * 
       * The rest of the slashed value is handled by the `Slash`.
       **/
      slashRewardFraction: AugmentedQuery<ApiType, () => Observable<Perbill>, []>;
      /**
       * The amount of balance actively at stake for each validator slot, currently.
       * 
       * This is used to derive rewards and punishments.
       **/
      slotStake: AugmentedQuery<ApiType, () => Observable<BalanceOf>, []>;
      /**
       * Records information about the maximum slash of a stash within a slashing span,
       * as well as how much reward has been paid out.
       **/
      spanSlash: AugmentedQuery<ApiType, (arg: ITuple<[AccountId, SpanIndex]> | [AccountId | string | Uint8Array, SpanIndex | AnyNumber | Uint8Array]) => Observable<SpanRecord>, [ITuple<[AccountId, SpanIndex]>]>;
      /**
       * Nominators for a particular account that is in action right now. You can't iterate
       * through validators here, but you can find them in the Session module.
       * 
       * This is keyed by the stash account.
       **/
      stakers: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Exposure>, [AccountId]>;
      /**
       * The version of storage for upgrade.
       **/
      storageVersion: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * All unapplied slashes that are queued for later.
       **/
      unappliedSlashes: AugmentedQuery<ApiType, (arg: EraIndex | AnyNumber | Uint8Array) => Observable<Vec<UnappliedSlash>>, [EraIndex]>;
      /**
       * The ideal number of staking participants.
       **/
      validatorCount: AugmentedQuery<ApiType, () => Observable<u32>, []>;
      /**
       * The map from (wannabe) validator stash key to the preferences of that validator.
       **/
      validators: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<ValidatorPrefs>, [AccountId]>;
      /**
       * All slashing events on validators, mapped by era to the highest slash proportion
       * and slash value of the era.
       **/
      validatorSlashInEra: AugmentedQuery<ApiType, (arg1: EraIndex | AnyNumber | Uint8Array, arg2: AccountId | string | Uint8Array) => Observable<Option<ITuple<[Perbill, BalanceOf]>>>, [EraIndex, AccountId]>;
    };
    sudo: {
      /**
       * The `AccountId` of the sudo key.
       **/
      key: AugmentedQuery<ApiType, () => Observable<AccountId>, []>;
    };
    system: {
      /**
       * Extrinsics nonce for accounts.
       **/
      accountNonce: AugmentedQuery<ApiType, (arg: AccountId | string | Uint8Array) => Observable<Index>, [AccountId]>;
      /**
       * Total length (in bytes) for all extrinsics put together, for the current block.
       **/
      allExtrinsicsLen: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
      /**
       * Total weight for all extrinsics put together, for the current block.
       **/
      allExtrinsicsWeight: AugmentedQuery<ApiType, () => Observable<Option<Weight>>, []>;
      /**
       * Map of block numbers to block hashes.
       **/
      blockHash: AugmentedQuery<ApiType, (arg: BlockNumber | AnyNumber | Uint8Array) => Observable<Hash>, [BlockNumber]>;
      /**
       * Digest of the current block, also part of the block header.
       **/
      digest: AugmentedQuery<ApiType, () => Observable<DigestOf>, []>;
      /**
       * The number of events in the `Events<T>` list.
       **/
      eventCount: AugmentedQuery<ApiType, () => Observable<EventIndex>, []>;
      /**
       * Events deposited for the current block.
       **/
      events: AugmentedQuery<ApiType, () => Observable<Vec<EventRecord>>, []>;
      /**
       * Mapping between a topic (represented by T::Hash) and a vector of indexes
       * of events in the `<Events<T>>` list.
       * 
       * All topic vectors have deterministic storage locations depending on the topic. This
       * allows light-clients to leverage the changes trie storage tracking mechanism and
       * in case of changes fetch the list of events of interest.
       * 
       * The value has the type `(T::BlockNumber, EventIndex)` because if we used only just
       * the `EventIndex` then in case if the topic has the same contents on the next block
       * no notification will be triggered thus the event might be lost.
       **/
      eventTopics: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<Vec<ITuple<[BlockNumber, EventIndex]>>>, [Hash]>;
      /**
       * Total extrinsics count for the current block.
       **/
      extrinsicCount: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []>;
      /**
       * Extrinsics data for the current block (maps an extrinsic's index to its data).
       **/
      extrinsicData: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>, [u32]>;
      /**
       * Extrinsics root of the current block, also part of the block header.
       **/
      extrinsicsRoot: AugmentedQuery<ApiType, () => Observable<Hash>, []>;
      /**
       * The current block number being processed. Set by `execute_block`.
       **/
      number: AugmentedQuery<ApiType, () => Observable<BlockNumber>, []>;
      /**
       * Hash of the previous block.
       **/
      parentHash: AugmentedQuery<ApiType, () => Observable<Hash>, []>;
    };
    timestamp: {
      /**
       * Did the timestamp get updated in this block?
       **/
      didUpdate: AugmentedQuery<ApiType, () => Observable<bool>, []>;
      /**
       * Current time for the current block.
       **/
      now: AugmentedQuery<ApiType, () => Observable<Moment>, []>;
    };
    transactionPayment: {
      nextFeeMultiplier: AugmentedQuery<ApiType, () => Observable<Multiplier>, []>;
    };
    treasury: {
      /**
       * Proposal indices that have been approved but not yet awarded.
       **/
      approvals: AugmentedQuery<ApiType, () => Observable<Vec<ProposalIndex>>, []>;
      /**
       * Number of proposals that have been made.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<ProposalIndex>, []>;
      /**
       * Proposals that have been made.
       **/
      proposals: AugmentedQuery<ApiType, (arg: ProposalIndex | AnyNumber | Uint8Array) => Observable<Option<TreasuryProposal>>, [ProposalIndex]>;
      /**
       * Simple preimage lookup from the reason's hash to the original data. Again, has an
       * insecure enumerable hash since the key is guaranteed to be the result of a secure hash.
       **/
      reasons: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<Option<Bytes>>, [Hash]>;
      /**
       * Tips that are not yet completed. Keyed by the hash of `(reason, who)` from the value.
       * This has the insecure enumerable hash function since the key itself is already
       * guaranteed to be a secure hash.
       **/
      tips: AugmentedQuery<ApiType, (arg: Hash | string | Uint8Array) => Observable<Option<OpenTip>>, [Hash]>;
    };
    treasuryReward: {
      /**
       * Current payout of module
       **/
      currentPayout: AugmentedQuery<ApiType, () => Observable<BalanceOf>, []>;
      /**
       * Interval in number of blocks to reward treasury
       **/
      mintingInterval: AugmentedQuery<ApiType, () => Observable<BlockNumber>, []>;
      /**
       * Current pot
       **/
      pot: AugmentedQuery<ApiType, () => Observable<Balance>, []>;
    };
    utility: {
      /**
       * The set of open multisig operations.
       **/
      multisigs: AugmentedQuery<ApiType, (arg1: AccountId | string | Uint8Array, arg2: U8aFixed | string | Uint8Array) => Observable<Option<Multisig>>, [AccountId, U8aFixed]>;
    };
    voting: {
      /**
       * The number of vote records that have been created
       **/
      voteRecordCount: AugmentedQuery<ApiType, () => Observable<u64>, []>;
      /**
       * The map of all vote records indexed by id
       **/
      voteRecords: AugmentedQuery<ApiType, (arg: u64 | AnyNumber | Uint8Array) => Observable<Option<VoteRecord>>, [u64]>;
    };
  } // AugmentedQueries
} // declare module
