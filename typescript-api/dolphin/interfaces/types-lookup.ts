// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

declare module '@polkadot/types/lookup' {
  import type { Data } from '@polkadot/types';
  import type { Bytes, Compact, Enum, Null, Option, Struct, U8aFixed, Vec, bool, u16, u32, u64 } from '@polkadot/types-codec';
  import type { ITuple } from '@polkadot/types-codec/types';
  import type { MemberCount, ProposalIndex } from '@polkadot/types/interfaces/collective';
  import type { AuthorityId } from '@polkadot/types/interfaces/consensus';
  import type { CodeHash, Gas, Schedule } from '@polkadot/types/interfaces/contracts';
  import type { Conviction, PropIndex, Proposal, ReferendumIndex } from '@polkadot/types/interfaces/democracy';
  import type { Vote, VoteThreshold } from '@polkadot/types/interfaces/elections';
  import type { Signature } from '@polkadot/types/interfaces/extrinsics';
  import type { AuthorityList } from '@polkadot/types/interfaces/grandpa';
  import type { IdentityFields, IdentityInfo, IdentityJudgement, RegistrarIndex } from '@polkadot/types/interfaces/identity';
  import type { Heartbeat } from '@polkadot/types/interfaces/imOnline';
  import type { Kind, OpaqueTimeSlot } from '@polkadot/types/interfaces/offences';
  import type { AccountId, AccountIndex, Balance, BalanceOf, BlockNumber, Call, ChangesTrieConfiguration, Hash, Header, KeyValue, LookupSource, Moment } from '@polkadot/types/interfaces/runtime';
  import type { IdentificationTuple, Keys, SessionIndex } from '@polkadot/types/interfaces/session';
  import type { EraIndex, RewardDestination, ValidatorPrefs } from '@polkadot/types/interfaces/staking';
  import type { DispatchError, DispatchInfo, DispatchResult, Key } from '@polkadot/types/interfaces/system';
  import type { Timepoint } from '@polkadot/types/interfaces/utility';

  /** @name PalletSystemCall (10) */
  export interface PalletSystemCall extends Enum {
    readonly isFillBlock: boolean;
    readonly isRemark: boolean;
    readonly asRemark: {
      readonly remark: Bytes;
    } & Struct;
    readonly isSetHeapPages: boolean;
    readonly asSetHeapPages: {
      readonly pages: u64;
    } & Struct;
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetCodeWithoutChecks: boolean;
    readonly asSetCodeWithoutChecks: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetChangesTrieConfig: boolean;
    readonly asSetChangesTrieConfig: {
      readonly changesTrieConfig: Option<ChangesTrieConfiguration>;
    } & Struct;
    readonly isSetStorage: boolean;
    readonly asSetStorage: {
      readonly items: Vec<KeyValue>;
    } & Struct;
    readonly isKillStorage: boolean;
    readonly asKillStorage: {
      readonly keys_: Vec<Key>;
    } & Struct;
    readonly isKillPrefix: boolean;
    readonly asKillPrefix: {
      readonly prefix: Key;
    } & Struct;
    readonly type: 'FillBlock' | 'Remark' | 'SetHeapPages' | 'SetCode' | 'SetCodeWithoutChecks' | 'SetChangesTrieConfig' | 'SetStorage' | 'KillStorage' | 'KillPrefix';
  }

  /** @name PalletSystemError (11) */
  export interface PalletSystemError extends Enum {
    readonly isInvalidSpecName: boolean;
    readonly isSpecVersionNotAllowedToDecrease: boolean;
    readonly isImplVersionNotAllowedToDecrease: boolean;
    readonly isSpecOrImplVersionNeedToIncrease: boolean;
    readonly isFailedToExtractRuntimeVersion: boolean;
    readonly type: 'InvalidSpecName' | 'SpecVersionNotAllowedToDecrease' | 'ImplVersionNotAllowedToDecrease' | 'SpecOrImplVersionNeedToIncrease' | 'FailedToExtractRuntimeVersion';
  }

  /** @name PalletSystemEvent (14) */
  export interface PalletSystemEvent extends Enum {
    readonly isExtrinsicSuccess: boolean;
    readonly asExtrinsicSuccess: DispatchInfo;
    readonly isExtrinsicFailed: boolean;
    readonly asExtrinsicFailed: ITuple<[DispatchError, DispatchInfo]>;
    readonly isCodeUpdated: boolean;
    readonly type: 'ExtrinsicSuccess' | 'ExtrinsicFailed' | 'CodeUpdated';
  }

  /** @name PalletUtilityCall (30) */
  export interface PalletUtilityCall extends Enum {
    readonly isBatch: boolean;
    readonly asBatch: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isAsSub: boolean;
    readonly asAsSub: {
      readonly index: u16;
      readonly call: Call;
    } & Struct;
    readonly isAsMulti: boolean;
    readonly asAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId>;
      readonly maybeTimepoint: Option<Timepoint>;
      readonly call: Call;
    } & Struct;
    readonly isApproveAsMulti: boolean;
    readonly asApproveAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId>;
      readonly maybeTimepoint: Option<Timepoint>;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly isCancelAsMulti: boolean;
    readonly asCancelAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId>;
      readonly timepoint: Timepoint;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly type: 'Batch' | 'AsSub' | 'AsMulti' | 'ApproveAsMulti' | 'CancelAsMulti';
  }

  /** @name PalletUtilityError (31) */
  export interface PalletUtilityError extends Enum {
    readonly isZeroThreshold: boolean;
    readonly isAlreadyApproved: boolean;
    readonly isNoApprovalsNeeded: boolean;
    readonly isTooFewSignatories: boolean;
    readonly isTooManySignatories: boolean;
    readonly isSignatoriesOutOfOrder: boolean;
    readonly isSenderInSignatories: boolean;
    readonly isNotFound: boolean;
    readonly isNotOwner: boolean;
    readonly isNoTimepoint: boolean;
    readonly isWrongTimepoint: boolean;
    readonly isUnexpectedTimepoint: boolean;
    readonly type: 'ZeroThreshold' | 'AlreadyApproved' | 'NoApprovalsNeeded' | 'TooFewSignatories' | 'TooManySignatories' | 'SignatoriesOutOfOrder' | 'SenderInSignatories' | 'NotFound' | 'NotOwner' | 'NoTimepoint' | 'WrongTimepoint' | 'UnexpectedTimepoint';
  }

  /** @name PalletUtilityEvent (33) */
  export interface PalletUtilityEvent extends Enum {
    readonly isBatchInterrupted: boolean;
    readonly asBatchInterrupted: ITuple<[u32, DispatchError]>;
    readonly isBatchCompleted: boolean;
    readonly isNewMultisig: boolean;
    readonly asNewMultisig: ITuple<[AccountId, AccountId]>;
    readonly isMultisigApproval: boolean;
    readonly asMultisigApproval: ITuple<[AccountId, Timepoint, AccountId]>;
    readonly isMultisigExecuted: boolean;
    readonly asMultisigExecuted: ITuple<[AccountId, Timepoint, AccountId, DispatchResult]>;
    readonly isMultisigCancelled: boolean;
    readonly asMultisigCancelled: ITuple<[AccountId, Timepoint, AccountId]>;
    readonly type: 'BatchInterrupted' | 'BatchCompleted' | 'NewMultisig' | 'MultisigApproval' | 'MultisigExecuted' | 'MultisigCancelled';
  }

  /** @name PalletTimestampCall (37) */
  export interface PalletTimestampCall extends Enum {
    readonly isSet: boolean;
    readonly asSet: {
      readonly now: Compact<Moment>;
    } & Struct;
    readonly type: 'Set';
  }

  /** @name PalletAuthorshipCall (41) */
  export interface PalletAuthorshipCall extends Enum {
    readonly isSetUncles: boolean;
    readonly asSetUncles: {
      readonly newUncles: Vec<Header>;
    } & Struct;
    readonly type: 'SetUncles';
  }

  /** @name PalletAuthorshipError (42) */
  export interface PalletAuthorshipError extends Enum {
    readonly isInvalidUncleParent: boolean;
    readonly isUnclesAlreadySet: boolean;
    readonly isTooManyUncles: boolean;
    readonly isGenesisUncle: boolean;
    readonly isTooHighUncle: boolean;
    readonly isUncleAlreadyIncluded: boolean;
    readonly isOldUncle: boolean;
    readonly type: 'InvalidUncleParent' | 'UnclesAlreadySet' | 'TooManyUncles' | 'GenesisUncle' | 'TooHighUncle' | 'UncleAlreadyIncluded' | 'OldUncle';
  }

  /** @name PalletIndicesCall (44) */
  export type PalletIndicesCall = Null;

  /** @name PalletIndicesEvent (46) */
  export interface PalletIndicesEvent extends Enum {
    readonly isNewAccountIndex: boolean;
    readonly asNewAccountIndex: ITuple<[AccountId, AccountIndex]>;
    readonly type: 'NewAccountIndex';
  }

  /** @name PalletBalancesCall (49) */
  export interface PalletBalancesCall extends Enum {
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly dest: LookupSource;
      readonly value: Compact<Balance>;
    } & Struct;
    readonly isSetBalance: boolean;
    readonly asSetBalance: {
      readonly who: LookupSource;
      readonly newFree: Compact<Balance>;
      readonly newReserved: Compact<Balance>;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly source: LookupSource;
      readonly dest: LookupSource;
      readonly value: Compact<Balance>;
    } & Struct;
    readonly isTransferKeepAlive: boolean;
    readonly asTransferKeepAlive: {
      readonly dest: LookupSource;
      readonly value: Compact<Balance>;
    } & Struct;
    readonly type: 'Transfer' | 'SetBalance' | 'ForceTransfer' | 'TransferKeepAlive';
  }

  /** @name PalletBalancesError (51) */
  export interface PalletBalancesError extends Enum {
    readonly isVestingBalance: boolean;
    readonly isLiquidityRestrictions: boolean;
    readonly isOverflow: boolean;
    readonly isInsufficientBalance: boolean;
    readonly isExistentialDeposit: boolean;
    readonly isKeepAlive: boolean;
    readonly isExistingVestingSchedule: boolean;
    readonly isDeadAccount: boolean;
    readonly type: 'VestingBalance' | 'LiquidityRestrictions' | 'Overflow' | 'InsufficientBalance' | 'ExistentialDeposit' | 'KeepAlive' | 'ExistingVestingSchedule' | 'DeadAccount';
  }

  /** @name PalletBalancesEvent (52) */
  export interface PalletBalancesEvent extends Enum {
    readonly isNewAccount: boolean;
    readonly asNewAccount: ITuple<[AccountId, Balance]>;
    readonly isReapedAccount: boolean;
    readonly asReapedAccount: ITuple<[AccountId, Balance]>;
    readonly isTransfer: boolean;
    readonly asTransfer: ITuple<[AccountId, AccountId, Balance, Balance]>;
    readonly isBalanceSet: boolean;
    readonly asBalanceSet: ITuple<[AccountId, Balance, Balance]>;
    readonly isDeposit: boolean;
    readonly asDeposit: ITuple<[AccountId, Balance]>;
    readonly type: 'NewAccount' | 'ReapedAccount' | 'Transfer' | 'BalanceSet' | 'Deposit';
  }

  /** @name PalletStakingCall (64) */
  export interface PalletStakingCall extends Enum {
    readonly isBond: boolean;
    readonly asBond: {
      readonly controller: LookupSource;
      readonly value: Compact<BalanceOf>;
      readonly payee: RewardDestination;
    } & Struct;
    readonly isBondExtra: boolean;
    readonly asBondExtra: {
      readonly maxAdditional: Compact<BalanceOf>;
    } & Struct;
    readonly isUnbond: boolean;
    readonly asUnbond: {
      readonly value: Compact<BalanceOf>;
    } & Struct;
    readonly isWithdrawUnbonded: boolean;
    readonly isValidate: boolean;
    readonly asValidate: {
      readonly prefs: ValidatorPrefs;
    } & Struct;
    readonly isNominate: boolean;
    readonly asNominate: {
      readonly targets: Vec<LookupSource>;
    } & Struct;
    readonly isChill: boolean;
    readonly isSetPayee: boolean;
    readonly asSetPayee: {
      readonly payee: RewardDestination;
    } & Struct;
    readonly isSetController: boolean;
    readonly asSetController: {
      readonly controller: LookupSource;
    } & Struct;
    readonly isSetValidatorCount: boolean;
    readonly asSetValidatorCount: {
      readonly new_: Compact<u32>;
    } & Struct;
    readonly isForceNoEras: boolean;
    readonly isForceNewEra: boolean;
    readonly isSetInvulnerables: boolean;
    readonly asSetInvulnerables: {
      readonly validators: Vec<AccountId>;
    } & Struct;
    readonly isForceUnstake: boolean;
    readonly asForceUnstake: {
      readonly stash: AccountId;
    } & Struct;
    readonly isForceNewEraAlways: boolean;
    readonly isCancelDeferredSlash: boolean;
    readonly asCancelDeferredSlash: {
      readonly era: EraIndex;
      readonly slashIndices: Vec<u32>;
    } & Struct;
    readonly isRebond: boolean;
    readonly asRebond: {
      readonly value: Compact<BalanceOf>;
    } & Struct;
    readonly type: 'Bond' | 'BondExtra' | 'Unbond' | 'WithdrawUnbonded' | 'Validate' | 'Nominate' | 'Chill' | 'SetPayee' | 'SetController' | 'SetValidatorCount' | 'ForceNoEras' | 'ForceNewEra' | 'SetInvulnerables' | 'ForceUnstake' | 'ForceNewEraAlways' | 'CancelDeferredSlash' | 'Rebond';
  }

  /** @name PalletStakingError (66) */
  export interface PalletStakingError extends Enum {
    readonly isNotController: boolean;
    readonly isNotStash: boolean;
    readonly isAlreadyBonded: boolean;
    readonly isAlreadyPaired: boolean;
    readonly isEmptyTargets: boolean;
    readonly isDuplicateIndex: boolean;
    readonly isInvalidSlashIndex: boolean;
    readonly isInsufficientValue: boolean;
    readonly isNoMoreChunks: boolean;
    readonly isNoUnlockChunk: boolean;
    readonly type: 'NotController' | 'NotStash' | 'AlreadyBonded' | 'AlreadyPaired' | 'EmptyTargets' | 'DuplicateIndex' | 'InvalidSlashIndex' | 'InsufficientValue' | 'NoMoreChunks' | 'NoUnlockChunk';
  }

  /** @name PalletStakingEvent (67) */
  export interface PalletStakingEvent extends Enum {
    readonly isReward: boolean;
    readonly asReward: ITuple<[Balance, Balance]>;
    readonly isSlash: boolean;
    readonly asSlash: ITuple<[AccountId, Balance]>;
    readonly isOldSlashingReportDiscarded: boolean;
    readonly asOldSlashingReportDiscarded: SessionIndex;
    readonly type: 'Reward' | 'Slash' | 'OldSlashingReportDiscarded';
  }

  /** @name PalletSessionCall (84) */
  export interface PalletSessionCall extends Enum {
    readonly isSetKeys: boolean;
    readonly asSetKeys: {
      readonly keys_: Keys;
      readonly proof: Bytes;
    } & Struct;
    readonly type: 'SetKeys';
  }

  /** @name PalletSessionError (85) */
  export interface PalletSessionError extends Enum {
    readonly isInvalidProof: boolean;
    readonly isNoAssociatedValidatorId: boolean;
    readonly isDuplicatedKey: boolean;
    readonly type: 'InvalidProof' | 'NoAssociatedValidatorId' | 'DuplicatedKey';
  }

  /** @name PalletSessionEvent (86) */
  export interface PalletSessionEvent extends Enum {
    readonly isNewSession: boolean;
    readonly asNewSession: SessionIndex;
    readonly type: 'NewSession';
  }

  /** @name PalletDemocracyCall (98) */
  export interface PalletDemocracyCall extends Enum {
    readonly isPropose: boolean;
    readonly asPropose: {
      readonly proposalHash: Hash;
      readonly value: Compact<BalanceOf>;
    } & Struct;
    readonly isSecond: boolean;
    readonly asSecond: {
      readonly proposal: Compact<PropIndex>;
    } & Struct;
    readonly isVote: boolean;
    readonly asVote: {
      readonly refIndex: Compact<ReferendumIndex>;
      readonly vote: Vote;
    } & Struct;
    readonly isProxyVote: boolean;
    readonly asProxyVote: {
      readonly refIndex: Compact<ReferendumIndex>;
      readonly vote: Vote;
    } & Struct;
    readonly isEmergencyCancel: boolean;
    readonly asEmergencyCancel: {
      readonly refIndex: ReferendumIndex;
    } & Struct;
    readonly isExternalPropose: boolean;
    readonly asExternalPropose: {
      readonly proposalHash: Hash;
    } & Struct;
    readonly isExternalProposeMajority: boolean;
    readonly asExternalProposeMajority: {
      readonly proposalHash: Hash;
    } & Struct;
    readonly isExternalProposeDefault: boolean;
    readonly asExternalProposeDefault: {
      readonly proposalHash: Hash;
    } & Struct;
    readonly isFastTrack: boolean;
    readonly asFastTrack: {
      readonly proposalHash: Hash;
      readonly votingPeriod: BlockNumber;
      readonly delay: BlockNumber;
    } & Struct;
    readonly isVetoExternal: boolean;
    readonly asVetoExternal: {
      readonly proposalHash: Hash;
    } & Struct;
    readonly isCancelReferendum: boolean;
    readonly asCancelReferendum: {
      readonly refIndex: Compact<ReferendumIndex>;
    } & Struct;
    readonly isCancelQueued: boolean;
    readonly asCancelQueued: {
      readonly which: ReferendumIndex;
    } & Struct;
    readonly isSetProxy: boolean;
    readonly asSetProxy: {
      readonly proxy: AccountId;
    } & Struct;
    readonly isResignProxy: boolean;
    readonly isRemoveProxy: boolean;
    readonly asRemoveProxy: {
      readonly proxy: AccountId;
    } & Struct;
    readonly isDelegate: boolean;
    readonly asDelegate: {
      readonly to: AccountId;
      readonly conviction: Conviction;
    } & Struct;
    readonly isUndelegate: boolean;
    readonly isClearPublicProposals: boolean;
    readonly isNotePreimage: boolean;
    readonly asNotePreimage: {
      readonly encodedProposal: Bytes;
    } & Struct;
    readonly isNoteImminentPreimage: boolean;
    readonly asNoteImminentPreimage: {
      readonly encodedProposal: Bytes;
    } & Struct;
    readonly isReapPreimage: boolean;
    readonly asReapPreimage: {
      readonly proposalHash: Hash;
    } & Struct;
    readonly type: 'Propose' | 'Second' | 'Vote' | 'ProxyVote' | 'EmergencyCancel' | 'ExternalPropose' | 'ExternalProposeMajority' | 'ExternalProposeDefault' | 'FastTrack' | 'VetoExternal' | 'CancelReferendum' | 'CancelQueued' | 'SetProxy' | 'ResignProxy' | 'RemoveProxy' | 'Delegate' | 'Undelegate' | 'ClearPublicProposals' | 'NotePreimage' | 'NoteImminentPreimage' | 'ReapPreimage';
  }

  /** @name PalletDemocracyError (99) */
  export interface PalletDemocracyError extends Enum {
    readonly isValueLow: boolean;
    readonly isProposalMissing: boolean;
    readonly isNotProxy: boolean;
    readonly isBadIndex: boolean;
    readonly isAlreadyCanceled: boolean;
    readonly isDuplicateProposal: boolean;
    readonly isProposalBlacklisted: boolean;
    readonly isNotSimpleMajority: boolean;
    readonly isInvalidHash: boolean;
    readonly isNoProposal: boolean;
    readonly isAlreadyVetoed: boolean;
    readonly isAlreadyProxy: boolean;
    readonly isWrongProxy: boolean;
    readonly isNotDelegated: boolean;
    readonly isDuplicatePreimage: boolean;
    readonly isNotImminent: boolean;
    readonly isEarly: boolean;
    readonly isImminent: boolean;
    readonly isPreimageMissing: boolean;
    readonly isReferendumInvalid: boolean;
    readonly isPreimageInvalid: boolean;
    readonly isNoneWaiting: boolean;
    readonly type: 'ValueLow' | 'ProposalMissing' | 'NotProxy' | 'BadIndex' | 'AlreadyCanceled' | 'DuplicateProposal' | 'ProposalBlacklisted' | 'NotSimpleMajority' | 'InvalidHash' | 'NoProposal' | 'AlreadyVetoed' | 'AlreadyProxy' | 'WrongProxy' | 'NotDelegated' | 'DuplicatePreimage' | 'NotImminent' | 'Early' | 'Imminent' | 'PreimageMissing' | 'ReferendumInvalid' | 'PreimageInvalid' | 'NoneWaiting';
  }

  /** @name PalletDemocracyEvent (102) */
  export interface PalletDemocracyEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: ITuple<[PropIndex, Balance]>;
    readonly isTabled: boolean;
    readonly asTabled: ITuple<[PropIndex, Balance, Vec<AccountId>]>;
    readonly isExternalTabled: boolean;
    readonly isStarted: boolean;
    readonly asStarted: ITuple<[ReferendumIndex, VoteThreshold]>;
    readonly isPassed: boolean;
    readonly asPassed: ReferendumIndex;
    readonly isNotPassed: boolean;
    readonly asNotPassed: ReferendumIndex;
    readonly isCancelled: boolean;
    readonly asCancelled: ReferendumIndex;
    readonly isExecuted: boolean;
    readonly asExecuted: ITuple<[ReferendumIndex, bool]>;
    readonly isDelegated: boolean;
    readonly asDelegated: ITuple<[AccountId, AccountId]>;
    readonly isUndelegated: boolean;
    readonly asUndelegated: AccountId;
    readonly isVetoed: boolean;
    readonly asVetoed: ITuple<[AccountId, Hash, BlockNumber]>;
    readonly isPreimageNoted: boolean;
    readonly asPreimageNoted: ITuple<[Hash, AccountId, Balance]>;
    readonly isPreimageUsed: boolean;
    readonly asPreimageUsed: ITuple<[Hash, AccountId, Balance]>;
    readonly isPreimageInvalid: boolean;
    readonly asPreimageInvalid: ITuple<[Hash, ReferendumIndex]>;
    readonly isPreimageMissing: boolean;
    readonly asPreimageMissing: ITuple<[Hash, ReferendumIndex]>;
    readonly isPreimageReaped: boolean;
    readonly asPreimageReaped: ITuple<[Hash, AccountId, Balance, AccountId]>;
    readonly type: 'Proposed' | 'Tabled' | 'ExternalTabled' | 'Started' | 'Passed' | 'NotPassed' | 'Cancelled' | 'Executed' | 'Delegated' | 'Undelegated' | 'Vetoed' | 'PreimageNoted' | 'PreimageUsed' | 'PreimageInvalid' | 'PreimageMissing' | 'PreimageReaped';
  }

  /** @name PalletCouncilCall (115) */
  export interface PalletCouncilCall extends Enum {
    readonly isSetMembers: boolean;
    readonly asSetMembers: {
      readonly newMembers: Vec<AccountId>;
    } & Struct;
    readonly isExecute: boolean;
    readonly asExecute: {
      readonly proposal: Proposal;
    } & Struct;
    readonly isPropose: boolean;
    readonly asPropose: {
      readonly threshold: Compact<MemberCount>;
      readonly proposal: Proposal;
    } & Struct;
    readonly isVote: boolean;
    readonly asVote: {
      readonly proposal: Hash;
      readonly index: Compact<ProposalIndex>;
      readonly approve: bool;
    } & Struct;
    readonly type: 'SetMembers' | 'Execute' | 'Propose' | 'Vote';
  }

  /** @name PalletCouncilError (116) */
  export interface PalletCouncilError extends Enum {
    readonly isNotMember: boolean;
    readonly isDuplicateProposal: boolean;
    readonly isProposalMissing: boolean;
    readonly isWrongIndex: boolean;
    readonly isDuplicateVote: boolean;
    readonly isAlreadyInitialized: boolean;
    readonly type: 'NotMember' | 'DuplicateProposal' | 'ProposalMissing' | 'WrongIndex' | 'DuplicateVote' | 'AlreadyInitialized';
  }

  /** @name PalletCouncilEvent (119) */
  export interface PalletCouncilEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: ITuple<[AccountId, ProposalIndex, Hash, MemberCount]>;
    readonly isVoted: boolean;
    readonly asVoted: ITuple<[AccountId, Hash, bool, MemberCount, MemberCount]>;
    readonly isApproved: boolean;
    readonly asApproved: Hash;
    readonly isDisapproved: boolean;
    readonly asDisapproved: Hash;
    readonly isExecuted: boolean;
    readonly asExecuted: ITuple<[Hash, bool]>;
    readonly isMemberExecuted: boolean;
    readonly asMemberExecuted: ITuple<[Hash, bool]>;
    readonly type: 'Proposed' | 'Voted' | 'Approved' | 'Disapproved' | 'Executed' | 'MemberExecuted';
  }

  /** @name PalletElectionsCall (122) */
  export interface PalletElectionsCall extends Enum {
    readonly isVote: boolean;
    readonly asVote: {
      readonly votes: Vec<AccountId>;
      readonly value: Compact<BalanceOf>;
    } & Struct;
    readonly isRemoveVoter: boolean;
    readonly isReportDefunctVoter: boolean;
    readonly asReportDefunctVoter: {
      readonly target: LookupSource;
    } & Struct;
    readonly isSubmitCandidacy: boolean;
    readonly isRenounceCandidacy: boolean;
    readonly isRemoveMember: boolean;
    readonly asRemoveMember: {
      readonly who: LookupSource;
    } & Struct;
    readonly type: 'Vote' | 'RemoveVoter' | 'ReportDefunctVoter' | 'SubmitCandidacy' | 'RenounceCandidacy' | 'RemoveMember';
  }

  /** @name PalletElectionsError (123) */
  export interface PalletElectionsError extends Enum {
    readonly isUnableToVote: boolean;
    readonly isNoVotes: boolean;
    readonly isTooManyVotes: boolean;
    readonly isMaximumVotesExceeded: boolean;
    readonly isLowBalance: boolean;
    readonly isUnableToPayBond: boolean;
    readonly isMustBeVoter: boolean;
    readonly isReportSelf: boolean;
    readonly isDuplicatedCandidate: boolean;
    readonly isMemberSubmit: boolean;
    readonly isRunnerSubmit: boolean;
    readonly isInsufficientCandidateFunds: boolean;
    readonly isInvalidOrigin: boolean;
    readonly isNotMember: boolean;
    readonly type: 'UnableToVote' | 'NoVotes' | 'TooManyVotes' | 'MaximumVotesExceeded' | 'LowBalance' | 'UnableToPayBond' | 'MustBeVoter' | 'ReportSelf' | 'DuplicatedCandidate' | 'MemberSubmit' | 'RunnerSubmit' | 'InsufficientCandidateFunds' | 'InvalidOrigin' | 'NotMember';
  }

  /** @name PalletElectionsEvent (125) */
  export interface PalletElectionsEvent extends Enum {
    readonly isNewTerm: boolean;
    readonly asNewTerm: Vec<ITuple<[AccountId, Balance]>>;
    readonly isEmptyTerm: boolean;
    readonly isMemberKicked: boolean;
    readonly asMemberKicked: AccountId;
    readonly isMemberRenounced: boolean;
    readonly asMemberRenounced: AccountId;
    readonly isVoterReported: boolean;
    readonly asVoterReported: ITuple<[AccountId, AccountId, bool]>;
    readonly type: 'NewTerm' | 'EmptyTerm' | 'MemberKicked' | 'MemberRenounced' | 'VoterReported';
  }

  /** @name PalletFinalityTrackerCall (128) */
  export interface PalletFinalityTrackerCall extends Enum {
    readonly isFinalHint: boolean;
    readonly asFinalHint: {
      readonly hint: Compact<BlockNumber>;
    } & Struct;
    readonly type: 'FinalHint';
  }

  /** @name PalletFinalityTrackerError (129) */
  export interface PalletFinalityTrackerError extends Enum {
    readonly isAlreadyUpdated: boolean;
    readonly isBadHint: boolean;
    readonly type: 'AlreadyUpdated' | 'BadHint';
  }

  /** @name PalletGrandpaCall (130) */
  export interface PalletGrandpaCall extends Enum {
    readonly isReportMisbehavior: boolean;
    readonly asReportMisbehavior: {
      readonly report: Bytes;
    } & Struct;
    readonly type: 'ReportMisbehavior';
  }

  /** @name PalletGrandpaError (131) */
  export interface PalletGrandpaError extends Enum {
    readonly isPauseFailed: boolean;
    readonly isResumeFailed: boolean;
    readonly isChangePending: boolean;
    readonly isTooSoon: boolean;
    readonly type: 'PauseFailed' | 'ResumeFailed' | 'ChangePending' | 'TooSoon';
  }

  /** @name PalletGrandpaEvent (133) */
  export interface PalletGrandpaEvent extends Enum {
    readonly isNewAuthorities: boolean;
    readonly asNewAuthorities: AuthorityList;
    readonly isPaused: boolean;
    readonly isResumed: boolean;
    readonly type: 'NewAuthorities' | 'Paused' | 'Resumed';
  }

  /** @name PalletTreasuryCall (138) */
  export interface PalletTreasuryCall extends Enum {
    readonly isProposeSpend: boolean;
    readonly asProposeSpend: {
      readonly value: Compact<BalanceOf>;
      readonly beneficiary: LookupSource;
    } & Struct;
    readonly isRejectProposal: boolean;
    readonly asRejectProposal: {
      readonly proposalId: Compact<ProposalIndex>;
    } & Struct;
    readonly isApproveProposal: boolean;
    readonly asApproveProposal: {
      readonly proposalId: Compact<ProposalIndex>;
    } & Struct;
    readonly isReportAwesome: boolean;
    readonly asReportAwesome: {
      readonly reason: Bytes;
      readonly who: AccountId;
    } & Struct;
    readonly isRetractTip: boolean;
    readonly asRetractTip: {
      readonly hash_: Hash;
    } & Struct;
    readonly isTipNew: boolean;
    readonly asTipNew: {
      readonly reason: Bytes;
      readonly who: AccountId;
      readonly tipValue: BalanceOf;
    } & Struct;
    readonly isTip: boolean;
    readonly asTip: {
      readonly hash_: Hash;
      readonly tipValue: BalanceOf;
    } & Struct;
    readonly isCloseTip: boolean;
    readonly asCloseTip: {
      readonly hash_: Hash;
    } & Struct;
    readonly type: 'ProposeSpend' | 'RejectProposal' | 'ApproveProposal' | 'ReportAwesome' | 'RetractTip' | 'TipNew' | 'Tip' | 'CloseTip';
  }

  /** @name PalletTreasuryError (141) */
  export interface PalletTreasuryError extends Enum {
    readonly isInsufficientProposersBalance: boolean;
    readonly isInvalidProposalIndex: boolean;
    readonly isReasonTooBig: boolean;
    readonly isAlreadyKnown: boolean;
    readonly isUnknownTip: boolean;
    readonly isNotFinder: boolean;
    readonly isStillOpen: boolean;
    readonly isPremature: boolean;
    readonly type: 'InsufficientProposersBalance' | 'InvalidProposalIndex' | 'ReasonTooBig' | 'AlreadyKnown' | 'UnknownTip' | 'NotFinder' | 'StillOpen' | 'Premature';
  }

  /** @name PalletTreasuryEvent (142) */
  export interface PalletTreasuryEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: ProposalIndex;
    readonly isSpending: boolean;
    readonly asSpending: Balance;
    readonly isAwarded: boolean;
    readonly asAwarded: ITuple<[ProposalIndex, Balance, AccountId]>;
    readonly isRejected: boolean;
    readonly asRejected: ITuple<[ProposalIndex, Balance]>;
    readonly isBurnt: boolean;
    readonly asBurnt: Balance;
    readonly isRollover: boolean;
    readonly asRollover: Balance;
    readonly isDeposit: boolean;
    readonly asDeposit: Balance;
    readonly isNewTip: boolean;
    readonly asNewTip: Hash;
    readonly isTipClosing: boolean;
    readonly asTipClosing: Hash;
    readonly isTipClosed: boolean;
    readonly asTipClosed: ITuple<[Hash, AccountId, Balance]>;
    readonly isTipRetracted: boolean;
    readonly asTipRetracted: Hash;
    readonly type: 'Proposed' | 'Spending' | 'Awarded' | 'Rejected' | 'Burnt' | 'Rollover' | 'Deposit' | 'NewTip' | 'TipClosing' | 'TipClosed' | 'TipRetracted';
  }

  /** @name PalletContractsCall (150) */
  export interface PalletContractsCall extends Enum {
    readonly isUpdateSchedule: boolean;
    readonly asUpdateSchedule: {
      readonly schedule: Schedule;
    } & Struct;
    readonly isPutCode: boolean;
    readonly asPutCode: {
      readonly gasLimit: Compact<Gas>;
      readonly code: Bytes;
    } & Struct;
    readonly isCall: boolean;
    readonly asCall: {
      readonly dest: LookupSource;
      readonly value: Compact<BalanceOf>;
      readonly gasLimit: Compact<Gas>;
      readonly data: Bytes;
    } & Struct;
    readonly isInstantiate: boolean;
    readonly asInstantiate: {
      readonly endowment: Compact<BalanceOf>;
      readonly gasLimit: Compact<Gas>;
      readonly codeHash: CodeHash;
      readonly data: Bytes;
    } & Struct;
    readonly isClaimSurcharge: boolean;
    readonly asClaimSurcharge: {
      readonly dest: AccountId;
      readonly auxSender: Option<AccountId>;
    } & Struct;
    readonly type: 'UpdateSchedule' | 'PutCode' | 'Call' | 'Instantiate' | 'ClaimSurcharge';
  }

  /** @name PalletContractsError (152) */
  export interface PalletContractsError extends Enum {
    readonly isInvalidScheduleVersion: boolean;
    readonly isInvalidSurchargeClaim: boolean;
    readonly isInvalidSourceContract: boolean;
    readonly isInvalidDestinationContract: boolean;
    readonly isInvalidTombstone: boolean;
    readonly isInvalidContractOrigin: boolean;
    readonly type: 'InvalidScheduleVersion' | 'InvalidSurchargeClaim' | 'InvalidSourceContract' | 'InvalidDestinationContract' | 'InvalidTombstone' | 'InvalidContractOrigin';
  }

  /** @name PalletContractsEvent (153) */
  export interface PalletContractsEvent extends Enum {
    readonly isTransfer: boolean;
    readonly asTransfer: ITuple<[AccountId, AccountId, Balance]>;
    readonly isInstantiated: boolean;
    readonly asInstantiated: ITuple<[AccountId, AccountId]>;
    readonly isEvicted: boolean;
    readonly asEvicted: ITuple<[AccountId, bool]>;
    readonly isRestored: boolean;
    readonly asRestored: ITuple<[AccountId, AccountId, Hash, Balance, bool]>;
    readonly isCodeStored: boolean;
    readonly asCodeStored: Hash;
    readonly isScheduleUpdated: boolean;
    readonly asScheduleUpdated: u32;
    readonly isDispatched: boolean;
    readonly asDispatched: ITuple<[AccountId, bool]>;
    readonly isContractExecution: boolean;
    readonly asContractExecution: ITuple<[AccountId, Bytes]>;
    readonly type: 'Transfer' | 'Instantiated' | 'Evicted' | 'Restored' | 'CodeStored' | 'ScheduleUpdated' | 'Dispatched' | 'ContractExecution';
  }

  /** @name PalletIdentityCall (162) */
  export interface PalletIdentityCall extends Enum {
    readonly isAddRegistrar: boolean;
    readonly asAddRegistrar: {
      readonly account: AccountId;
    } & Struct;
    readonly isSetIdentity: boolean;
    readonly asSetIdentity: {
      readonly info: IdentityInfo;
    } & Struct;
    readonly isSetSubs: boolean;
    readonly asSetSubs: {
      readonly subs: Vec<ITuple<[AccountId, Data]>>;
    } & Struct;
    readonly isClearIdentity: boolean;
    readonly isRequestJudgement: boolean;
    readonly asRequestJudgement: {
      readonly regIndex: Compact<RegistrarIndex>;
      readonly maxFee: Compact<BalanceOf>;
    } & Struct;
    readonly isCancelRequest: boolean;
    readonly asCancelRequest: {
      readonly regIndex: RegistrarIndex;
    } & Struct;
    readonly isSetFee: boolean;
    readonly asSetFee: {
      readonly index: Compact<RegistrarIndex>;
      readonly fee: Compact<BalanceOf>;
    } & Struct;
    readonly isSetAccountId: boolean;
    readonly asSetAccountId: {
      readonly index: Compact<RegistrarIndex>;
      readonly new_: AccountId;
    } & Struct;
    readonly isSetFields: boolean;
    readonly asSetFields: {
      readonly index: Compact<RegistrarIndex>;
      readonly fields: IdentityFields;
    } & Struct;
    readonly isProvideJudgement: boolean;
    readonly asProvideJudgement: {
      readonly regIndex: Compact<RegistrarIndex>;
      readonly target: LookupSource;
      readonly judgement: IdentityJudgement;
    } & Struct;
    readonly isKillIdentity: boolean;
    readonly asKillIdentity: {
      readonly target: LookupSource;
    } & Struct;
    readonly type: 'AddRegistrar' | 'SetIdentity' | 'SetSubs' | 'ClearIdentity' | 'RequestJudgement' | 'CancelRequest' | 'SetFee' | 'SetAccountId' | 'SetFields' | 'ProvideJudgement' | 'KillIdentity';
  }

  /** @name PalletIdentityError (163) */
  export interface PalletIdentityError extends Enum {
    readonly isTooManySubAccounts: boolean;
    readonly isNotFound: boolean;
    readonly isNotNamed: boolean;
    readonly isEmptyIndex: boolean;
    readonly isFeeChanged: boolean;
    readonly isNoIdentity: boolean;
    readonly isStickyJudgement: boolean;
    readonly isJudgementGiven: boolean;
    readonly isInvalidJudgement: boolean;
    readonly isInvalidIndex: boolean;
    readonly isInvalidTarget: boolean;
    readonly isTooManyFields: boolean;
    readonly type: 'TooManySubAccounts' | 'NotFound' | 'NotNamed' | 'EmptyIndex' | 'FeeChanged' | 'NoIdentity' | 'StickyJudgement' | 'JudgementGiven' | 'InvalidJudgement' | 'InvalidIndex' | 'InvalidTarget' | 'TooManyFields';
  }

  /** @name PalletIdentityEvent (164) */
  export interface PalletIdentityEvent extends Enum {
    readonly isIdentitySet: boolean;
    readonly asIdentitySet: AccountId;
    readonly isIdentityCleared: boolean;
    readonly asIdentityCleared: ITuple<[AccountId, Balance]>;
    readonly isIdentityKilled: boolean;
    readonly asIdentityKilled: ITuple<[AccountId, Balance]>;
    readonly isJudgementRequested: boolean;
    readonly asJudgementRequested: ITuple<[AccountId, RegistrarIndex]>;
    readonly isJudgementUnrequested: boolean;
    readonly asJudgementUnrequested: ITuple<[AccountId, RegistrarIndex]>;
    readonly isJudgementGiven: boolean;
    readonly asJudgementGiven: ITuple<[AccountId, RegistrarIndex]>;
    readonly isRegistrarAdded: boolean;
    readonly asRegistrarAdded: RegistrarIndex;
    readonly type: 'IdentitySet' | 'IdentityCleared' | 'IdentityKilled' | 'JudgementRequested' | 'JudgementUnrequested' | 'JudgementGiven' | 'RegistrarAdded';
  }

  /** @name PalletImOnlineCall (170) */
  export interface PalletImOnlineCall extends Enum {
    readonly isHeartbeat: boolean;
    readonly asHeartbeat: {
      readonly heartbeat: Heartbeat;
      readonly signature: Signature;
    } & Struct;
    readonly type: 'Heartbeat';
  }

  /** @name PalletImOnlineError (171) */
  export interface PalletImOnlineError extends Enum {
    readonly isInvalidKey: boolean;
    readonly isDuplicatedHeartbeat: boolean;
    readonly type: 'InvalidKey' | 'DuplicatedHeartbeat';
  }

  /** @name PalletImOnlineEvent (174) */
  export interface PalletImOnlineEvent extends Enum {
    readonly isHeartbeatReceived: boolean;
    readonly asHeartbeatReceived: AuthorityId;
    readonly isAllGood: boolean;
    readonly isSomeOffline: boolean;
    readonly asSomeOffline: Vec<IdentificationTuple>;
    readonly type: 'HeartbeatReceived' | 'AllGood' | 'SomeOffline';
  }

  /** @name PalletAuthorityDiscoveryCall (179) */
  export type PalletAuthorityDiscoveryCall = Null;

  /** @name PalletOffencesCall (180) */
  export type PalletOffencesCall = Null;

  /** @name PalletOffencesEvent (183) */
  export interface PalletOffencesEvent extends Enum {
    readonly isOffence: boolean;
    readonly asOffence: ITuple<[Kind, OpaqueTimeSlot]>;
    readonly type: 'Offence';
  }

  /** @name PalletRandomnessCollectiveFlipCall (188) */
  export type PalletRandomnessCollectiveFlipCall = Null;

  /** @name PalletNicksCall (189) */
  export interface PalletNicksCall extends Enum {
    readonly isSetName: boolean;
    readonly asSetName: {
      readonly name: Bytes;
    } & Struct;
    readonly isClearName: boolean;
    readonly isKillName: boolean;
    readonly asKillName: {
      readonly target: LookupSource;
    } & Struct;
    readonly isForceName: boolean;
    readonly asForceName: {
      readonly target: LookupSource;
      readonly name: Bytes;
    } & Struct;
    readonly type: 'SetName' | 'ClearName' | 'KillName' | 'ForceName';
  }

  /** @name PalletNicksError (190) */
  export interface PalletNicksError extends Enum {
    readonly isTooShort: boolean;
    readonly isTooLong: boolean;
    readonly isUnnamed: boolean;
    readonly type: 'TooShort' | 'TooLong' | 'Unnamed';
  }

  /** @name PalletNicksEvent (191) */
  export interface PalletNicksEvent extends Enum {
    readonly isNameSet: boolean;
    readonly asNameSet: AccountId;
    readonly isNameForced: boolean;
    readonly asNameForced: AccountId;
    readonly isNameChanged: boolean;
    readonly asNameChanged: AccountId;
    readonly isNameCleared: boolean;
    readonly asNameCleared: ITuple<[AccountId, Balance]>;
    readonly isNameKilled: boolean;
    readonly asNameKilled: ITuple<[AccountId, Balance]>;
    readonly type: 'NameSet' | 'NameForced' | 'NameChanged' | 'NameCleared' | 'NameKilled';
  }

  /** @name PalletSudoCall (193) */
  export interface PalletSudoCall extends Enum {
    readonly isSudo: boolean;
    readonly asSudo: {
      readonly proposal: Proposal;
    } & Struct;
    readonly isSetKey: boolean;
    readonly asSetKey: {
      readonly new_: LookupSource;
    } & Struct;
    readonly isSudoAs: boolean;
    readonly asSudoAs: {
      readonly who: LookupSource;
      readonly proposal: Proposal;
    } & Struct;
    readonly type: 'Sudo' | 'SetKey' | 'SudoAs';
  }

  /** @name PalletSudoError (194) */
  export interface PalletSudoError extends Enum {
    readonly isRequireSudo: boolean;
    readonly type: 'RequireSudo';
  }

  /** @name PalletSudoEvent (195) */
  export interface PalletSudoEvent extends Enum {
    readonly isSudid: boolean;
    readonly asSudid: bool;
    readonly isKeyChanged: boolean;
    readonly asKeyChanged: AccountId;
    readonly isSudoAsDone: boolean;
    readonly asSudoAsDone: bool;
    readonly type: 'Sudid' | 'KeyChanged' | 'SudoAsDone';
  }

  /** @name PalletSignalingCall (201) */
  export interface PalletSignalingCall extends Enum {
    readonly isCreateProposal: boolean;
    readonly asCreateProposal: {
      readonly title: ProposalTitle;
      readonly contents: ProposalContents;
      readonly outcomes: Vec<VoteOutcome>;
      readonly voteType: VoteType;
      readonly tallyType: TallyType;
    } & Struct;
    readonly isAdvanceProposal: boolean;
    readonly asAdvanceProposal: {
      readonly proposalHash: Hash;
    } & Struct;
    readonly type: 'CreateProposal' | 'AdvanceProposal';
  }

  /** @name PalletSignalingError (202) */
  export interface PalletSignalingError extends Enum {
    readonly isVoteRecordDoesntExist: boolean;
    readonly type: 'VoteRecordDoesntExist';
  }

  /** @name PalletSignalingEvent (203) */
  export interface PalletSignalingEvent extends Enum {
    readonly isNewProposal: boolean;
    readonly asNewProposal: ITuple<[AccountId, Hash]>;
    readonly isCommitStarted: boolean;
    readonly asCommitStarted: ITuple<[Hash, u64, BlockNumber]>;
    readonly isVotingStarted: boolean;
    readonly asVotingStarted: ITuple<[Hash, u64, BlockNumber]>;
    readonly isVotingCompleted: boolean;
    readonly asVotingCompleted: ITuple<[Hash, u64]>;
    readonly type: 'NewProposal' | 'CommitStarted' | 'VotingStarted' | 'VotingCompleted';
  }

  /** @name PalletVotingCall (208) */
  export interface PalletVotingCall extends Enum {
    readonly isCommit: boolean;
    readonly asCommit: {
      readonly voteId: u64;
      readonly commit: VoteOutcome;
    } & Struct;
    readonly isReveal: boolean;
    readonly asReveal: {
      readonly voteId: u64;
      readonly vote: Vec<VoteOutcome>;
      readonly secret: Option<VoteOutcome>;
    } & Struct;
    readonly type: 'Commit' | 'Reveal';
  }

  /** @name PalletVotingError (209) */
  export interface PalletVotingError extends Enum {
    readonly isVoteCompleted: boolean;
    readonly type: 'VoteCompleted';
  }

  /** @name PalletVotingEvent (211) */
  export interface PalletVotingEvent extends Enum {
    readonly isVoteCreated: boolean;
    readonly asVoteCreated: ITuple<[u64, AccountId, VoteType]>;
    readonly isVoteAdvanced: boolean;
    readonly asVoteAdvanced: ITuple<[u64, VoteStage, VoteStage]>;
    readonly isVoteCommitted: boolean;
    readonly asVoteCommitted: ITuple<[u64, AccountId]>;
    readonly isVoteRevealed: boolean;
    readonly asVoteRevealed: ITuple<[u64, AccountId, Vec<VoteOutcome>]>;
    readonly type: 'VoteCreated' | 'VoteAdvanced' | 'VoteCommitted' | 'VoteRevealed';
  }

  /** @name PalletTreasuryRewardCall (213) */
  export type PalletTreasuryRewardCall = Null;

  /** @name PalletTreasuryRewardEvent (215) */
  export interface PalletTreasuryRewardEvent extends Enum {
    readonly isTreasuryMinting: boolean;
    readonly asTreasuryMinting: ITuple<[Balance, Balance2, BlockNumber]>;
    readonly type: 'TreasuryMinting';
  }

} // declare module
