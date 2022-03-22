// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api-base/types';
import type { Bytes, Vec, bool, u32, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { MemberCount, ProposalIndex } from '@polkadot/types/interfaces/collective';
import type { AuthorityId } from '@polkadot/types/interfaces/consensus';
import type { PropIndex, ReferendumIndex } from '@polkadot/types/interfaces/democracy';
import type { VoteThreshold } from '@polkadot/types/interfaces/elections';
import type { AuthorityList } from '@polkadot/types/interfaces/grandpa';
import type { RegistrarIndex } from '@polkadot/types/interfaces/identity';
import type { Kind, OpaqueTimeSlot } from '@polkadot/types/interfaces/offences';
import type { AccountId, AccountIndex, Balance, BlockNumber, Hash } from '@polkadot/types/interfaces/runtime';
import type { IdentificationTuple, SessionIndex } from '@polkadot/types/interfaces/session';
import type { DispatchError, DispatchInfo, DispatchResult } from '@polkadot/types/interfaces/system';
import type { Timepoint } from '@polkadot/types/interfaces/utility';
import type { Balance2 } from 'sample-polkadotjs-typegen/interfaces/treasuryRewards';
import type { VoteOutcome, VoteStage, VoteType } from 'sample-polkadotjs-typegen/interfaces/voting';

declare module '@polkadot/api-base/types/events' {
  export interface AugmentedEvents<ApiType extends ApiTypes> {
    balances: {
      /**
       * A balance was set by root (who, free, reserved).
       **/
      BalanceSet: AugmentedEvent<ApiType, [AccountId, Balance, Balance]>;
      /**
       * Some amount was deposited (e.g. for transaction fees).
       **/
      Deposit: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * A new account was created.
       **/
      NewAccount: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * An account was reaped.
       **/
      ReapedAccount: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * Transfer succeeded (from, to, value, fees).
       **/
      Transfer: AugmentedEvent<ApiType, [AccountId, AccountId, Balance, Balance]>;
    };
    contracts: {
      /**
       * Code with the specified hash has been stored.
       **/
      CodeStored: AugmentedEvent<ApiType, [Hash]>;
      /**
       * An event deposited upon execution of a contract from the account.
       **/
      ContractExecution: AugmentedEvent<ApiType, [AccountId, Bytes]>;
      /**
       * A call was dispatched from the given account. The bool signals whether it was
       * successful execution or not.
       **/
      Dispatched: AugmentedEvent<ApiType, [AccountId, bool]>;
      /**
       * Contract has been evicted and is now in tombstone state.
       * 
       * # Params
       * 
       * - `contract`: `AccountId`: The account ID of the evicted contract.
       * - `tombstone`: `bool`: True if the evicted contract left behind a tombstone.
       **/
      Evicted: AugmentedEvent<ApiType, [AccountId, bool]>;
      /**
       * Contract deployed by address at the specified address.
       **/
      Instantiated: AugmentedEvent<ApiType, [AccountId, AccountId]>;
      /**
       * Restoration for a contract has been initiated.
       * 
       * # Params
       * 
       * - `donor`: `AccountId`: Account ID of the restoring contract
       * - `dest`: `AccountId`: Account ID of the restored contract
       * - `code_hash`: `Hash`: Code hash of the restored contract
       * - `rent_allowance: `Balance`: Rent allowance of the restored contract
       * - `success`: `bool`: True if the restoration was successful
       **/
      Restored: AugmentedEvent<ApiType, [AccountId, AccountId, Hash, Balance, bool]>;
      /**
       * Triggered when the current schedule is updated.
       **/
      ScheduleUpdated: AugmentedEvent<ApiType, [u32]>;
      /**
       * Transfer happened `from` to `to` with given `value` as part of a `call` or `instantiate`.
       **/
      Transfer: AugmentedEvent<ApiType, [AccountId, AccountId, Balance]>;
    };
    council: {
      /**
       * A motion was approved by the required threshold.
       **/
      Approved: AugmentedEvent<ApiType, [Hash]>;
      /**
       * A motion was not approved by the required threshold.
       **/
      Disapproved: AugmentedEvent<ApiType, [Hash]>;
      /**
       * A motion was executed; `bool` is true if returned without error.
       **/
      Executed: AugmentedEvent<ApiType, [Hash, bool]>;
      /**
       * A single member did some action; `bool` is true if returned without error.
       **/
      MemberExecuted: AugmentedEvent<ApiType, [Hash, bool]>;
      /**
       * A motion (given hash) has been proposed (by given account) with a threshold (given
       * `MemberCount`).
       **/
      Proposed: AugmentedEvent<ApiType, [AccountId, ProposalIndex, Hash, MemberCount]>;
      /**
       * A motion (given hash) has been voted on by given account, leaving
       * a tally (yes votes and no votes given respectively as `MemberCount`).
       **/
      Voted: AugmentedEvent<ApiType, [AccountId, Hash, bool, MemberCount, MemberCount]>;
    };
    democracy: {
      /**
       * A referendum has been cancelled.
       **/
      Cancelled: AugmentedEvent<ApiType, [ReferendumIndex]>;
      /**
       * An account has delegated their vote to another account.
       **/
      Delegated: AugmentedEvent<ApiType, [AccountId, AccountId]>;
      /**
       * A proposal has been enacted.
       **/
      Executed: AugmentedEvent<ApiType, [ReferendumIndex, bool]>;
      /**
       * An external proposal has been tabled.
       **/
      ExternalTabled: AugmentedEvent<ApiType, []>;
      /**
       * A proposal has been rejected by referendum.
       **/
      NotPassed: AugmentedEvent<ApiType, [ReferendumIndex]>;
      /**
       * A proposal has been approved by referendum.
       **/
      Passed: AugmentedEvent<ApiType, [ReferendumIndex]>;
      /**
       * A proposal could not be executed because its preimage was invalid.
       **/
      PreimageInvalid: AugmentedEvent<ApiType, [Hash, ReferendumIndex]>;
      /**
       * A proposal could not be executed because its preimage was missing.
       **/
      PreimageMissing: AugmentedEvent<ApiType, [Hash, ReferendumIndex]>;
      /**
       * A proposal's preimage was noted, and the deposit taken.
       **/
      PreimageNoted: AugmentedEvent<ApiType, [Hash, AccountId, Balance]>;
      /**
       * A registered preimage was removed and the deposit collected by the reaper (last item).
       **/
      PreimageReaped: AugmentedEvent<ApiType, [Hash, AccountId, Balance, AccountId]>;
      /**
       * A proposal preimage was removed and used (the deposit was returned).
       **/
      PreimageUsed: AugmentedEvent<ApiType, [Hash, AccountId, Balance]>;
      /**
       * A motion has been proposed by a public account.
       **/
      Proposed: AugmentedEvent<ApiType, [PropIndex, Balance]>;
      /**
       * A referendum has begun.
       **/
      Started: AugmentedEvent<ApiType, [ReferendumIndex, VoteThreshold]>;
      /**
       * A public proposal has been tabled for referendum vote.
       **/
      Tabled: AugmentedEvent<ApiType, [PropIndex, Balance, Vec<AccountId>]>;
      /**
       * An account has cancelled a previous delegation operation.
       **/
      Undelegated: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * An external proposal has been vetoed.
       **/
      Vetoed: AugmentedEvent<ApiType, [AccountId, Hash, BlockNumber]>;
    };
    elections: {
      /**
       * No (or not enough) candidates existed for this round.
       **/
      EmptyTerm: AugmentedEvent<ApiType, []>;
      /**
       * A member has been removed. This should always be followed by either `NewTerm` ot
       * `EmptyTerm`.
       **/
      MemberKicked: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A member has renounced their candidacy.
       **/
      MemberRenounced: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A new term with new members. This indicates that enough candidates existed, not that
       * enough have has been elected. The inner value must be examined for this purpose.
       **/
      NewTerm: AugmentedEvent<ApiType, [Vec<ITuple<[AccountId, Balance]>>]>;
      /**
       * A voter (first element) was reported (byt the second element) with the the report being
       * successful or not (third element).
       **/
      VoterReported: AugmentedEvent<ApiType, [AccountId, AccountId, bool]>;
    };
    grandpa: {
      /**
       * New authority set has been applied.
       **/
      NewAuthorities: AugmentedEvent<ApiType, [AuthorityList]>;
      /**
       * Current authority set has been paused.
       **/
      Paused: AugmentedEvent<ApiType, []>;
      /**
       * Current authority set has been resumed.
       **/
      Resumed: AugmentedEvent<ApiType, []>;
    };
    identity: {
      /**
       * A name was cleared, and the given balance returned.
       **/
      IdentityCleared: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * A name was removed and the given balance slashed.
       **/
      IdentityKilled: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * A name was set or reset (which will remove all judgements).
       **/
      IdentitySet: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A judgement was given by a registrar.
       **/
      JudgementGiven: AugmentedEvent<ApiType, [AccountId, RegistrarIndex]>;
      /**
       * A judgement was asked from a registrar.
       **/
      JudgementRequested: AugmentedEvent<ApiType, [AccountId, RegistrarIndex]>;
      /**
       * A judgement request was retracted.
       **/
      JudgementUnrequested: AugmentedEvent<ApiType, [AccountId, RegistrarIndex]>;
      /**
       * A registrar was added.
       **/
      RegistrarAdded: AugmentedEvent<ApiType, [RegistrarIndex]>;
    };
    imOnline: {
      /**
       * At the end of the session, no offence was committed.
       **/
      AllGood: AugmentedEvent<ApiType, []>;
      /**
       * A new heartbeat was received from `AuthorityId`
       **/
      HeartbeatReceived: AugmentedEvent<ApiType, [AuthorityId]>;
      /**
       * At the end of the session, at least once validator was found to be offline.
       **/
      SomeOffline: AugmentedEvent<ApiType, [Vec<IdentificationTuple>]>;
    };
    indices: {
      /**
       * A new account index was assigned.
       * 
       * This event is not triggered when an existing index is reassigned
       * to another `AccountId`.
       **/
      NewAccountIndex: AugmentedEvent<ApiType, [AccountId, AccountIndex]>;
    };
    nicks: {
      /**
       * A name was changed.
       **/
      NameChanged: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A name was cleared, and the given balance returned.
       **/
      NameCleared: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * A name was forcibly set.
       **/
      NameForced: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A name was removed and the given balance slashed.
       **/
      NameKilled: AugmentedEvent<ApiType, [AccountId, Balance]>;
      /**
       * A name was set.
       **/
      NameSet: AugmentedEvent<ApiType, [AccountId]>;
    };
    offences: {
      /**
       * There is an offence reported of the given `kind` happened at the `session_index` and
       * (kind-specific) time slot. This event is not deposited for duplicate slashes.
       **/
      Offence: AugmentedEvent<ApiType, [Kind, OpaqueTimeSlot]>;
    };
    session: {
      /**
       * New session has happened. Note that the argument is the session index, not the block
       * number as the type might suggest.
       **/
      NewSession: AugmentedEvent<ApiType, [SessionIndex]>;
    };
    signaling: {
      /**
       * Emitted when commit stage begins: (ProposalHash, VoteId, CommitEndTime)
       **/
      CommitStarted: AugmentedEvent<ApiType, [Hash, u64, BlockNumber]>;
      /**
       * Emitted at proposal creation: (Creator, ProposalHash)
       **/
      NewProposal: AugmentedEvent<ApiType, [AccountId, Hash]>;
      /**
       * Emitted when voting is completed: (ProposalHash, VoteId, VoteResults)
       **/
      VotingCompleted: AugmentedEvent<ApiType, [Hash, u64]>;
      /**
       * Emitted when voting begins: (ProposalHash, VoteId, VotingEndTime)
       **/
      VotingStarted: AugmentedEvent<ApiType, [Hash, u64, BlockNumber]>;
    };
    staking: {
      /**
       * An old slashing report from a prior era was discarded because it could
       * not be processed.
       **/
      OldSlashingReportDiscarded: AugmentedEvent<ApiType, [SessionIndex]>;
      /**
       * All validators have been rewarded by the first balance; the second is the remainder
       * from the maximum amount of reward.
       **/
      Reward: AugmentedEvent<ApiType, [Balance, Balance]>;
      /**
       * One validator (and its nominators) has been slashed by the given amount.
       **/
      Slash: AugmentedEvent<ApiType, [AccountId, Balance]>;
    };
    sudo: {
      /**
       * The sudoer just switched identity; the old key is supplied.
       **/
      KeyChanged: AugmentedEvent<ApiType, [AccountId]>;
      /**
       * A sudo just took place.
       **/
      Sudid: AugmentedEvent<ApiType, [bool]>;
      /**
       * A sudo just took place.
       **/
      SudoAsDone: AugmentedEvent<ApiType, [bool]>;
    };
    system: {
      /**
       * `:code` was updated.
       **/
      CodeUpdated: AugmentedEvent<ApiType, []>;
      /**
       * An extrinsic failed.
       **/
      ExtrinsicFailed: AugmentedEvent<ApiType, [DispatchError, DispatchInfo]>;
      /**
       * An extrinsic completed successfully.
       **/
      ExtrinsicSuccess: AugmentedEvent<ApiType, [DispatchInfo]>;
    };
    treasury: {
      /**
       * Some funds have been allocated.
       **/
      Awarded: AugmentedEvent<ApiType, [ProposalIndex, Balance, AccountId]>;
      /**
       * Some of our funds have been burnt.
       **/
      Burnt: AugmentedEvent<ApiType, [Balance]>;
      /**
       * Some funds have been deposited.
       **/
      Deposit: AugmentedEvent<ApiType, [Balance]>;
      /**
       * A new tip suggestion has been opened.
       **/
      NewTip: AugmentedEvent<ApiType, [Hash]>;
      /**
       * New proposal.
       **/
      Proposed: AugmentedEvent<ApiType, [ProposalIndex]>;
      /**
       * A proposal was rejected; funds were slashed.
       **/
      Rejected: AugmentedEvent<ApiType, [ProposalIndex, Balance]>;
      /**
       * Spending has finished; this is the amount that rolls over until next spend.
       **/
      Rollover: AugmentedEvent<ApiType, [Balance]>;
      /**
       * We have ended a spend period and will now allocate funds.
       **/
      Spending: AugmentedEvent<ApiType, [Balance]>;
      /**
       * A tip suggestion has been closed.
       **/
      TipClosed: AugmentedEvent<ApiType, [Hash, AccountId, Balance]>;
      /**
       * A tip suggestion has reached threshold and is closing.
       **/
      TipClosing: AugmentedEvent<ApiType, [Hash]>;
      /**
       * A tip suggestion has been retracted.
       **/
      TipRetracted: AugmentedEvent<ApiType, [Hash]>;
    };
    treasuryReward: {
      TreasuryMinting: AugmentedEvent<ApiType, [Balance, Balance2, BlockNumber]>;
    };
    utility: {
      /**
       * Batch of dispatches completed fully with no error.
       **/
      BatchCompleted: AugmentedEvent<ApiType, []>;
      /**
       * Batch of dispatches did not complete fully. Index of first failing dispatch given, as
       * well as the error.
       **/
      BatchInterrupted: AugmentedEvent<ApiType, [u32, DispatchError]>;
      /**
       * A multisig operation has been approved by someone. First param is the account that is
       * approving, third is the multisig account.
       **/
      MultisigApproval: AugmentedEvent<ApiType, [AccountId, Timepoint, AccountId]>;
      /**
       * A multisig operation has been cancelled. First param is the account that is
       * cancelling, third is the multisig account.
       **/
      MultisigCancelled: AugmentedEvent<ApiType, [AccountId, Timepoint, AccountId]>;
      /**
       * A multisig operation has been executed. First param is the account that is
       * approving, third is the multisig account.
       **/
      MultisigExecuted: AugmentedEvent<ApiType, [AccountId, Timepoint, AccountId, DispatchResult]>;
      /**
       * A new multisig operation has begun. First param is the account that is approving,
       * second is the multisig account.
       **/
      NewMultisig: AugmentedEvent<ApiType, [AccountId, AccountId]>;
    };
    voting: {
      /**
       * vote stage transition (id, old stage, new stage)
       **/
      VoteAdvanced: AugmentedEvent<ApiType, [u64, VoteStage, VoteStage]>;
      /**
       * user commits
       **/
      VoteCommitted: AugmentedEvent<ApiType, [u64, AccountId]>;
      /**
       * new vote (id, creator, type of vote)
       **/
      VoteCreated: AugmentedEvent<ApiType, [u64, AccountId, VoteType]>;
      /**
       * user reveals a vote
       **/
      VoteRevealed: AugmentedEvent<ApiType, [u64, AccountId, Vec<VoteOutcome>]>;
    };
  } // AugmentedEvents
} // declare module
