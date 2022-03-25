// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from "@polkadot/api-base/types";

declare module "@polkadot/api-base/types/errors" {
  export interface AugmentedErrors<ApiType extends ApiTypes> {
    assetManager: {
      /**
       * Asset already registered.
       */
      AssetAlreadyRegistered: AugmentedError<ApiType>;
      /**
       * Error creating asset, e.g. error returned from the implementation layer.
       */
      ErrorCreatingAsset: AugmentedError<ApiType>;
      /**
       * Location already exists.
       */
      LocationAlreadyExists: AugmentedError<ApiType>;
      /**
       * Update a non-exist asset
       */
      UpdateNonExistAsset: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    assets: {
      /**
       * The asset-account already exists.
       */
      AlreadyExists: AugmentedError<ApiType>;
      /**
       * Invalid metadata given.
       */
      BadMetadata: AugmentedError<ApiType>;
      /**
       * Invalid witness data given.
       */
      BadWitness: AugmentedError<ApiType>;
      /**
       * Account balance must be greater than or equal to the transfer amount.
       */
      BalanceLow: AugmentedError<ApiType>;
      /**
       * The origin account is frozen.
       */
      Frozen: AugmentedError<ApiType>;
      /**
       * The asset ID is already taken.
       */
      InUse: AugmentedError<ApiType>;
      /**
       * Minimum balance should be non-zero.
       */
      MinBalanceZero: AugmentedError<ApiType>;
      /**
       * The account to alter does not exist.
       */
      NoAccount: AugmentedError<ApiType>;
      /**
       * The asset-account doesn't have an associated deposit.
       */
      NoDeposit: AugmentedError<ApiType>;
      /**
       * The signing account has no permission to do the operation.
       */
      NoPermission: AugmentedError<ApiType>;
      /**
       * Unable to increment the consumer reference counters on the account.
       * Either no provider reference exists to allow a non-zero balance of a
       * non-self-sufficient asset, or the maximum number of consumers has been reached.
       */
      NoProvider: AugmentedError<ApiType>;
      /**
       * No approval exists that would allow the transfer.
       */
      Unapproved: AugmentedError<ApiType>;
      /**
       * The given asset ID is unknown.
       */
      Unknown: AugmentedError<ApiType>;
      /**
       * The operation would result in funds being burned.
       */
      WouldBurn: AugmentedError<ApiType>;
      /**
       * The source account would not survive the transfer and it needs to stay alive.
       */
      WouldDie: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    authorship: {
      /**
       * The uncle is genesis.
       */
      GenesisUncle: AugmentedError<ApiType>;
      /**
       * The uncle parent not in the chain.
       */
      InvalidUncleParent: AugmentedError<ApiType>;
      /**
       * The uncle isn't recent enough to be included.
       */
      OldUncle: AugmentedError<ApiType>;
      /**
       * The uncle is too high in chain.
       */
      TooHighUncle: AugmentedError<ApiType>;
      /**
       * Too many uncles.
       */
      TooManyUncles: AugmentedError<ApiType>;
      /**
       * The uncle is already included.
       */
      UncleAlreadyIncluded: AugmentedError<ApiType>;
      /**
       * Uncles already set in the block.
       */
      UnclesAlreadySet: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    balances: {
      /**
       * Beneficiary account must pre-exist
       */
      DeadAccount: AugmentedError<ApiType>;
      /**
       * Value too low to create account due to existential deposit
       */
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * A vesting schedule already exists for this account
       */
      ExistingVestingSchedule: AugmentedError<ApiType>;
      /**
       * Balance too low to send value
       */
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Transfer/payment would kill account
       */
      KeepAlive: AugmentedError<ApiType>;
      /**
       * Account liquidity restrictions prevent withdrawal
       */
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Number of named reserves exceed MaxReserves
       */
      TooManyReserves: AugmentedError<ApiType>;
      /**
       * Vesting balance too high to send value
       */
      VestingBalance: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    collatorSelection: {
      /**
       * User is already a candidate
       */
      AlreadyCandidate: AugmentedError<ApiType>;
      /**
       * User is already an Invulnerable
       */
      AlreadyInvulnerable: AugmentedError<ApiType>;
      /**
       * Account has no associated validator ID
       */
      NoAssociatedValidatorId: AugmentedError<ApiType>;
      /**
       * Removing invulnerable collators is not allowed
       */
      NotAllowRemoveInvulnerable: AugmentedError<ApiType>;
      /**
       * User is not a candidate
       */
      NotCandidate: AugmentedError<ApiType>;
      /**
       * Permission issue
       */
      Permission: AugmentedError<ApiType>;
      /**
       * Too many candidates
       */
      TooManyCandidates: AugmentedError<ApiType>;
      /**
       * Unknown error
       */
      Unknown: AugmentedError<ApiType>;
      /**
       * Validator ID is not yet registered
       */
      ValidatorNotRegistered: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    council: {
      /**
       * Members are already initialized!
       */
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       */
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       */
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       */
      NotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       */
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       */
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       */
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       */
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       */
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       */
      WrongProposalWeight: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    councilMembership: {
      /**
       * Already a member.
       */
      AlreadyMember: AugmentedError<ApiType>;
      /**
       * Not a member.
       */
      NotMember: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    cumulusXcm: {
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    democracy: {
      /**
       * Cannot cancel the same proposal twice
       */
      AlreadyCanceled: AugmentedError<ApiType>;
      /**
       * The account is already delegating.
       */
      AlreadyDelegating: AugmentedError<ApiType>;
      /**
       * Identity may not veto a proposal twice
       */
      AlreadyVetoed: AugmentedError<ApiType>;
      /**
       * Preimage already noted
       */
      DuplicatePreimage: AugmentedError<ApiType>;
      /**
       * Proposal already made
       */
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Imminent
       */
      Imminent: AugmentedError<ApiType>;
      /**
       * The instant referendum origin is currently disallowed.
       */
      InstantNotAllowed: AugmentedError<ApiType>;
      /**
       * Too high a balance was provided that the account cannot afford.
       */
      InsufficientFunds: AugmentedError<ApiType>;
      /**
       * Invalid hash
       */
      InvalidHash: AugmentedError<ApiType>;
      /**
       * Maximum number of votes reached.
       */
      MaxVotesReached: AugmentedError<ApiType>;
      /**
       * No proposals waiting
       */
      NoneWaiting: AugmentedError<ApiType>;
      /**
       * Delegation to oneself makes no sense.
       */
      Nonsense: AugmentedError<ApiType>;
      /**
       * The actor has no permission to conduct the action.
       */
      NoPermission: AugmentedError<ApiType>;
      /**
       * No external proposal
       */
      NoProposal: AugmentedError<ApiType>;
      /**
       * The account is not currently delegating.
       */
      NotDelegating: AugmentedError<ApiType>;
      /**
       * Not imminent
       */
      NotImminent: AugmentedError<ApiType>;
      /**
       * Next external proposal not simple majority
       */
      NotSimpleMajority: AugmentedError<ApiType>;
      /**
       * The given account did not vote on the referendum.
       */
      NotVoter: AugmentedError<ApiType>;
      /**
       * Invalid preimage
       */
      PreimageInvalid: AugmentedError<ApiType>;
      /**
       * Preimage not found
       */
      PreimageMissing: AugmentedError<ApiType>;
      /**
       * Proposal still blacklisted
       */
      ProposalBlacklisted: AugmentedError<ApiType>;
      /**
       * Proposal does not exist
       */
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * Vote given for invalid referendum
       */
      ReferendumInvalid: AugmentedError<ApiType>;
      /**
       * Too early
       */
      TooEarly: AugmentedError<ApiType>;
      /**
       * Maximum number of proposals reached.
       */
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Value too low
       */
      ValueLow: AugmentedError<ApiType>;
      /**
       * The account currently has votes attached to it and the operation cannot
       * succeed until these are removed, either through `unvote` or `reap_vote`.
       */
      VotesExist: AugmentedError<ApiType>;
      /**
       * Invalid upper bound.
       */
      WrongUpperBound: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    dmpQueue: {
      /**
       * The amount of weight given is possibly not enough for executing the message.
       */
      OverLimit: AugmentedError<ApiType>;
      /**
       * The message index given is unknown.
       */
      Unknown: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    mantaPay: {
      /**
       * Asset Registered
       *
       * An asset present in this transfer has already been registered to the ledger.
       */
      AssetRegistered: AugmentedError<ApiType>;
      /**
       * Asset Spent
       *
       * An asset present in this transfer has already been spent.
       */
      AssetSpent: AugmentedError<ApiType>;
      /**
       * Balance Low
       *
       * Attempted to withdraw from balance which was smaller than the withdrawl amount.
       */
      BalanceLow: AugmentedError<ApiType>;
      /**
       * Duplicate Register
       *
       * There were multiple register entries for the same underlying asset in
       * this transfer.
       */
      DuplicateRegister: AugmentedError<ApiType>;
      /**
       * Duplicate Spend
       *
       * There were multiple spend entries for the same underlying asset in this transfer.
       */
      DuplicateSpend: AugmentedError<ApiType>;
      /**
       * Invalid Proof
       *
       * The submitted proof did not pass validation, or errored during validation.
       */
      InvalidProof: AugmentedError<ApiType>;
      /**
       * Invalid Shape
       *
       * The transfer had an invalid shape.
       */
      InvalidShape: AugmentedError<ApiType>;
      /**
       * Invalid Sink Account
       *
       * At least one of the sink accounts in invalid.
       */
      InvalidSinkAccount: AugmentedError<ApiType>;
      /**
       * Invalid Source Account
       *
       * At least one of the source accounts is invalid.
       */
      InvalidSourceAccount: AugmentedError<ApiType>;
      /**
       * Invalid UTXO Accumulator Output
       *
       * The sender was constructed on an invalid version of the ledger state.
       */
      InvalidUtxoAccumulatorOutput: AugmentedError<ApiType>;
      /**
       * Ledger Internal Error
       *
       * Internal error caused by ledger internals (Ideally should never happen).
       */
      LedgerUpdateError: AugmentedError<ApiType>;
      /**
       * Uninitialized Supply
       *
       * Supply of the given Asset Id has not yet been initialized.
       */
      UninitializedSupply: AugmentedError<ApiType>;
      /**
       * Zero Transfer
       *
       * Public transfers cannot include amounts equal to zero.
       */
      ZeroTransfer: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    multisig: {
      /**
       * Call is already approved by this signatory.
       */
      AlreadyApproved: AugmentedError<ApiType>;
      /**
       * The data to be stored is already stored.
       */
      AlreadyStored: AugmentedError<ApiType>;
      /**
       * The maximum weight information provided was too low.
       */
      MaxWeightTooLow: AugmentedError<ApiType>;
      /**
       * Threshold must be 2 or greater.
       */
      MinimumThreshold: AugmentedError<ApiType>;
      /**
       * Call doesn't need any (more) approvals.
       */
      NoApprovalsNeeded: AugmentedError<ApiType>;
      /**
       * Multisig operation not found when attempting to cancel.
       */
      NotFound: AugmentedError<ApiType>;
      /**
       * No timepoint was given, yet the multisig operation is already underway.
       */
      NoTimepoint: AugmentedError<ApiType>;
      /**
       * Only the account that originally created the multisig is able to cancel it.
       */
      NotOwner: AugmentedError<ApiType>;
      /**
       * The sender was contained in the other signatories; it shouldn't be.
       */
      SenderInSignatories: AugmentedError<ApiType>;
      /**
       * The signatories were provided out of order; they should be ordered.
       */
      SignatoriesOutOfOrder: AugmentedError<ApiType>;
      /**
       * There are too few signatories in the list.
       */
      TooFewSignatories: AugmentedError<ApiType>;
      /**
       * There are too many signatories in the list.
       */
      TooManySignatories: AugmentedError<ApiType>;
      /**
       * A timepoint was given, yet no multisig operation is underway.
       */
      UnexpectedTimepoint: AugmentedError<ApiType>;
      /**
       * A different timepoint was given to the multisig operation that is underway.
       */
      WrongTimepoint: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    parachainSystem: {
      /**
       * The inherent which supplies the host configuration did not run this block
       */
      HostConfigurationNotAvailable: AugmentedError<ApiType>;
      /**
       * No code upgrade has been authorized.
       */
      NothingAuthorized: AugmentedError<ApiType>;
      /**
       * No validation function upgrade is currently scheduled.
       */
      NotScheduled: AugmentedError<ApiType>;
      /**
       * Attempt to upgrade validation function while existing upgrade pending
       */
      OverlappingUpgrades: AugmentedError<ApiType>;
      /**
       * Polkadot currently prohibits this parachain from upgrading its
       * validation function
       */
      ProhibitedByPolkadot: AugmentedError<ApiType>;
      /**
       * The supplied validation function has compiled into a blob larger than
       * Polkadot is willing to run
       */
      TooBig: AugmentedError<ApiType>;
      /**
       * The given code upgrade has not been authorized.
       */
      Unauthorized: AugmentedError<ApiType>;
      /**
       * The inherent which supplies the validation data did not run this block
       */
      ValidationDataNotAvailable: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    polkadotXcm: {
      /**
       * The location is invalid since it already has a subscription from us.
       */
      AlreadySubscribed: AugmentedError<ApiType>;
      /**
       * The given location could not be used (e.g. because it cannot be
       * expressed in the desired version of XCM).
       */
      BadLocation: AugmentedError<ApiType>;
      /**
       * The version of the `Versioned` value used is not able to be interpreted.
       */
      BadVersion: AugmentedError<ApiType>;
      /**
       * Could not re-anchor the assets to declare the fees for the destination chain.
       */
      CannotReanchor: AugmentedError<ApiType>;
      /**
       * The destination `MultiLocation` provided cannot be inverted.
       */
      DestinationNotInvertible: AugmentedError<ApiType>;
      /**
       * The assets to be sent are empty.
       */
      Empty: AugmentedError<ApiType>;
      /**
       * The message execution fails the filter.
       */
      Filtered: AugmentedError<ApiType>;
      /**
       * Origin is invalid for sending.
       */
      InvalidOrigin: AugmentedError<ApiType>;
      /**
       * The referenced subscription could not be found.
       */
      NoSubscription: AugmentedError<ApiType>;
      /**
       * There was some other issue (i.e. not to do with routing) in sending the
       * message. Perhaps a lack of space for buffering the message.
       */
      SendFailure: AugmentedError<ApiType>;
      /**
       * Too many assets have been attempted for transfer.
       */
      TooManyAssets: AugmentedError<ApiType>;
      /**
       * The desired destination was unreachable, generally because there is a
       * no way of routing to it.
       */
      Unreachable: AugmentedError<ApiType>;
      /**
       * The message's weight could not be determined.
       */
      UnweighableMessage: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    preimage: {
      /**
       * Preimage has already been noted on-chain.
       */
      AlreadyNoted: AugmentedError<ApiType>;
      /**
       * The user is not authorized to perform this action.
       */
      NotAuthorized: AugmentedError<ApiType>;
      /**
       * The preimage cannot be removed since it has not yet been noted.
       */
      NotNoted: AugmentedError<ApiType>;
      /**
       * The preimage request cannot be removed since no outstanding requests exist.
       */
      NotRequested: AugmentedError<ApiType>;
      /**
       * A preimage may not be removed when there are outstanding requests.
       */
      Requested: AugmentedError<ApiType>;
      /**
       * Preimage is too large to store on-chain.
       */
      TooLarge: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    scheduler: {
      /**
       * Failed to schedule a call
       */
      FailedToSchedule: AugmentedError<ApiType>;
      /**
       * Cannot find the scheduled call.
       */
      NotFound: AugmentedError<ApiType>;
      /**
       * Reschedule failed because it does not change scheduled time.
       */
      RescheduleNoChange: AugmentedError<ApiType>;
      /**
       * Given target block number is in the past.
       */
      TargetBlockNumberInPast: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    session: {
      /**
       * Registered duplicate key.
       */
      DuplicatedKey: AugmentedError<ApiType>;
      /**
       * Invalid ownership proof.
       */
      InvalidProof: AugmentedError<ApiType>;
      /**
       * Key setting account is not live, so it's impossible to associate keys.
       */
      NoAccount: AugmentedError<ApiType>;
      /**
       * No associated validator ID for account.
       */
      NoAssociatedValidatorId: AugmentedError<ApiType>;
      /**
       * No keys are associated with this account.
       */
      NoKeys: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    sudo: {
      /**
       * Sender must be the Sudo account
       */
      RequireSudo: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    system: {
      /**
       * The origin filter prevent the call to be dispatched.
       */
      CallFiltered: AugmentedError<ApiType>;
      /**
       * Failed to extract the runtime version from the new runtime.
       *
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       */
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       */
      InvalidSpecName: AugmentedError<ApiType>;
      /**
       * Suicide called when the account has non-default composite data.
       */
      NonDefaultComposite: AugmentedError<ApiType>;
      /**
       * There is a non-zero reference count preventing the account from being purged.
       */
      NonZeroRefCount: AugmentedError<ApiType>;
      /**
       * The specification version is not allowed to decrease between the
       * current runtime and the new runtime.
       */
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    technicalCommittee: {
      /**
       * Members are already initialized!
       */
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       */
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       */
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       */
      NotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       */
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       */
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       */
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       */
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       */
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       */
      WrongProposalWeight: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    technicalMembership: {
      /**
       * Already a member.
       */
      AlreadyMember: AugmentedError<ApiType>;
      /**
       * Not a member.
       */
      NotMember: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    transactionPause: {
      /**
       * Can not pause
       */
      CannotPause: AugmentedError<ApiType>;
      /**
       * Invalid character encoding
       */
      InvalidCharacter: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    treasury: {
      /**
       * Proposer's balance is too low.
       */
      InsufficientProposersBalance: AugmentedError<ApiType>;
      /**
       * No proposal or bounty at that index.
       */
      InvalidIndex: AugmentedError<ApiType>;
      /**
       * Too many approvals in the queue.
       */
      TooManyApprovals: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    utility: {
      /**
       * Too many calls batched.
       */
      TooManyCalls: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    xcmpQueue: {
      /**
       * Bad overweight index.
       */
      BadOverweightIndex: AugmentedError<ApiType>;
      /**
       * Bad XCM data.
       */
      BadXcm: AugmentedError<ApiType>;
      /**
       * Bad XCM origin.
       */
      BadXcmOrigin: AugmentedError<ApiType>;
      /**
       * Failed to send XCM message.
       */
      FailedToSend: AugmentedError<ApiType>;
      /**
       * Provided weight is possibly not enough to execute the message.
       */
      WeightOverLimit: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
    xTokens: {
      /**
       * Asset has no reserve location.
       */
      AssetHasNoReserve: AugmentedError<ApiType>;
      /**
       * The specified index does not exist in a MultiAssets struct
       */
      AssetIndexNonExistent: AugmentedError<ApiType>;
      /**
       * The version of the `Versioned` value used is not able to be interpreted.
       */
      BadVersion: AugmentedError<ApiType>;
      /**
       * Could not re-anchor the assets to declare the fees for the destination chain.
       */
      CannotReanchor: AugmentedError<ApiType>;
      /**
       * The destination `MultiLocation` provided cannot be inverted.
       */
      DestinationNotInvertible: AugmentedError<ApiType>;
      /**
       * We tried sending distinct asset and fee but they have different reserve chains
       */
      DistinctReserveForAssetAndFee: AugmentedError<ApiType>;
      /**
       * The fee amount was zero when the fee specification extrinsic is being used.
       */
      FeeCannotBeZero: AugmentedError<ApiType>;
      /**
       * Could not get ancestry of asset reserve location.
       */
      InvalidAncestry: AugmentedError<ApiType>;
      /**
       * Invalid transfer destination.
       */
      InvalidDest: AugmentedError<ApiType>;
      /**
       * Not cross-chain transfer.
       */
      NotCrossChainTransfer: AugmentedError<ApiType>;
      /**
       * Currency is not cross-chain transferable.
       */
      NotCrossChainTransferableCurrency: AugmentedError<ApiType>;
      /**
       * Not fungible asset.
       */
      NotFungible: AugmentedError<ApiType>;
      /**
       * The number of assets to be sent is over the maximum
       */
      TooManyAssetsBeingSent: AugmentedError<ApiType>;
      /**
       * The message's weight could not be determined.
       */
      UnweighableMessage: AugmentedError<ApiType>;
      /**
       * XCM execution failed.
       */
      XcmExecutionFailed: AugmentedError<ApiType>;
      /**
       * Generic error
       */
      [key: string]: AugmentedError<ApiType>;
    };
  } // AugmentedErrors
} // declare module
