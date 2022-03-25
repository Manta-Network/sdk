// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

/* eslint-disable sort-keys */

export default {
  /**
   * Lookup3: frame_system::AccountInfo<Index, pallet_balances::AccountData<Balance>>
   */
  FrameSystemAccountInfo: {
    nonce: "u32",
    consumers: "u32",
    providers: "u32",
    sufficients: "u32",
    data: "PalletBalancesAccountData",
  },
  /**
   * Lookup5: pallet_balances::AccountData<Balance>
   */
  PalletBalancesAccountData: {
    free: "u128",
    reserved: "u128",
    miscFrozen: "u128",
    feeFrozen: "u128",
  },
  /**
   * Lookup7: frame_support::weights::PerDispatchClass<T>
   */
  FrameSupportWeightsPerDispatchClassU64: {
    normal: "u64",
    operational: "u64",
    mandatory: "u64",
  },
  /**
   * Lookup11: sp_runtime::generic::digest::Digest
   */
  SpRuntimeDigest: {
    logs: "Vec<SpRuntimeDigestDigestItem>",
  },
  /**
   * Lookup13: sp_runtime::generic::digest::DigestItem
   */
  SpRuntimeDigestDigestItem: {
    _enum: {
      Other: "Bytes",
      __Unused1: "Null",
      __Unused2: "Null",
      __Unused3: "Null",
      Consensus: "([u8;4],Bytes)",
      Seal: "([u8;4],Bytes)",
      PreRuntime: "([u8;4],Bytes)",
      __Unused7: "Null",
      RuntimeEnvironmentUpdated: "Null",
    },
  },
  /**
   * Lookup16: frame_system::EventRecord<dolphin_runtime::Event, primitive_types::H256>
   */
  FrameSystemEventRecord: {
    phase: "FrameSystemPhase",
    event: "Event",
    topics: "Vec<H256>",
  },
  /**
   * Lookup18: frame_system::pallet::Event<T>
   */
  FrameSystemEvent: {
    _enum: {
      ExtrinsicSuccess: {
        dispatchInfo: "FrameSupportWeightsDispatchInfo",
      },
      ExtrinsicFailed: {
        dispatchError: "SpRuntimeDispatchError",
        dispatchInfo: "FrameSupportWeightsDispatchInfo",
      },
      CodeUpdated: "Null",
      NewAccount: {
        account: "AccountId32",
      },
      KilledAccount: {
        account: "AccountId32",
      },
      Remarked: {
        _alias: {
          hash_: "hash",
        },
        sender: "AccountId32",
        hash_: "H256",
      },
    },
  },
  /**
   * Lookup19: frame_support::weights::DispatchInfo
   */
  FrameSupportWeightsDispatchInfo: {
    weight: "u64",
    class: "FrameSupportWeightsDispatchClass",
    paysFee: "FrameSupportWeightsPays",
  },
  /**
   * Lookup20: frame_support::weights::DispatchClass
   */
  FrameSupportWeightsDispatchClass: {
    _enum: ["Normal", "Operational", "Mandatory"],
  },
  /**
   * Lookup21: frame_support::weights::Pays
   */
  FrameSupportWeightsPays: {
    _enum: ["Yes", "No"],
  },
  /**
   * Lookup22: sp_runtime::DispatchError
   */
  SpRuntimeDispatchError: {
    _enum: {
      Other: "Null",
      CannotLookup: "Null",
      BadOrigin: "Null",
      Module: {
        index: "u8",
        error: "u8",
      },
      ConsumerRemaining: "Null",
      NoProviders: "Null",
      TooManyConsumers: "Null",
      Token: "SpRuntimeTokenError",
      Arithmetic: "SpRuntimeArithmeticError",
    },
  },
  /**
   * Lookup23: sp_runtime::TokenError
   */
  SpRuntimeTokenError: {
    _enum: [
      "NoFunds",
      "WouldDie",
      "BelowMinimum",
      "CannotCreate",
      "UnknownAsset",
      "Frozen",
      "Unsupported",
    ],
  },
  /**
   * Lookup24: sp_runtime::ArithmeticError
   */
  SpRuntimeArithmeticError: {
    _enum: ["Underflow", "Overflow", "DivisionByZero"],
  },
  /**
   * Lookup25: cumulus_pallet_parachain_system::pallet::Event<T>
   */
  CumulusPalletParachainSystemEvent: {
    _enum: {
      ValidationFunctionStored: "Null",
      ValidationFunctionApplied: "u32",
      ValidationFunctionDiscarded: "Null",
      UpgradeAuthorized: "H256",
      DownwardMessagesReceived: "u32",
      DownwardMessagesProcessed: "(u64,H256)",
    },
  },
  /**
   * Lookup26: pallet_tx_pause::pallet::Event<T>
   */
  PalletTxPauseEvent: {
    _enum: {
      TransactionPaused: "(Bytes,Bytes)",
      TransactionUnpaused: "(Bytes,Bytes)",
    },
  },
  /**
   * Lookup27: pallet_balances::pallet::Event<T, I>
   */
  PalletBalancesEvent: {
    _enum: {
      Endowed: {
        account: "AccountId32",
        freeBalance: "u128",
      },
      DustLost: {
        account: "AccountId32",
        amount: "u128",
      },
      Transfer: {
        from: "AccountId32",
        to: "AccountId32",
        amount: "u128",
      },
      BalanceSet: {
        who: "AccountId32",
        free: "u128",
        reserved: "u128",
      },
      Reserved: {
        who: "AccountId32",
        amount: "u128",
      },
      Unreserved: {
        who: "AccountId32",
        amount: "u128",
      },
      ReserveRepatriated: {
        from: "AccountId32",
        to: "AccountId32",
        amount: "u128",
        destinationStatus: "FrameSupportTokensMiscBalanceStatus",
      },
      Deposit: {
        who: "AccountId32",
        amount: "u128",
      },
      Withdraw: {
        who: "AccountId32",
        amount: "u128",
      },
      Slashed: {
        who: "AccountId32",
        amount: "u128",
      },
    },
  },
  /**
   * Lookup28: frame_support::traits::tokens::misc::BalanceStatus
   */
  FrameSupportTokensMiscBalanceStatus: {
    _enum: ["Free", "Reserved"],
  },
  /**
   * Lookup29: pallet_democracy::pallet::Event<T>
   */
  PalletDemocracyEvent: {
    _enum: {
      Proposed: {
        proposalIndex: "u32",
        deposit: "u128",
      },
      Tabled: {
        proposalIndex: "u32",
        deposit: "u128",
        depositors: "Vec<AccountId32>",
      },
      ExternalTabled: "Null",
      Started: {
        refIndex: "u32",
        threshold: "PalletDemocracyVoteThreshold",
      },
      Passed: {
        refIndex: "u32",
      },
      NotPassed: {
        refIndex: "u32",
      },
      Cancelled: {
        refIndex: "u32",
      },
      Executed: {
        refIndex: "u32",
        result: "Result<Null, SpRuntimeDispatchError>",
      },
      Delegated: {
        who: "AccountId32",
        target: "AccountId32",
      },
      Undelegated: {
        account: "AccountId32",
      },
      Vetoed: {
        who: "AccountId32",
        proposalHash: "H256",
        until: "u32",
      },
      PreimageNoted: {
        proposalHash: "H256",
        who: "AccountId32",
        deposit: "u128",
      },
      PreimageUsed: {
        proposalHash: "H256",
        provider: "AccountId32",
        deposit: "u128",
      },
      PreimageInvalid: {
        proposalHash: "H256",
        refIndex: "u32",
      },
      PreimageMissing: {
        proposalHash: "H256",
        refIndex: "u32",
      },
      PreimageReaped: {
        proposalHash: "H256",
        provider: "AccountId32",
        deposit: "u128",
        reaper: "AccountId32",
      },
      Blacklisted: {
        proposalHash: "H256",
      },
      Voted: {
        voter: "AccountId32",
        refIndex: "u32",
        vote: "PalletDemocracyVoteAccountVote",
      },
      Seconded: {
        seconder: "AccountId32",
        propIndex: "u32",
      },
    },
  },
  /**
   * Lookup31: pallet_democracy::vote_threshold::VoteThreshold
   */
  PalletDemocracyVoteThreshold: {
    _enum: ["SuperMajorityApprove", "SuperMajorityAgainst", "SimpleMajority"],
  },
  /**
   * Lookup34: pallet_democracy::vote::AccountVote<Balance>
   */
  PalletDemocracyVoteAccountVote: {
    _enum: {
      Standard: {
        vote: "Vote",
        balance: "u128",
      },
      Split: {
        aye: "u128",
        nay: "u128",
      },
    },
  },
  /**
   * Lookup36: pallet_collective::pallet::Event<T, I>
   */
  PalletCollectiveEvent: {
    _enum: {
      Proposed: {
        account: "AccountId32",
        proposalIndex: "u32",
        proposalHash: "H256",
        threshold: "u32",
      },
      Voted: {
        account: "AccountId32",
        proposalHash: "H256",
        voted: "bool",
        yes: "u32",
        no: "u32",
      },
      Approved: {
        proposalHash: "H256",
      },
      Disapproved: {
        proposalHash: "H256",
      },
      Executed: {
        proposalHash: "H256",
        result: "Result<Null, SpRuntimeDispatchError>",
      },
      MemberExecuted: {
        proposalHash: "H256",
        result: "Result<Null, SpRuntimeDispatchError>",
      },
      Closed: {
        proposalHash: "H256",
        yes: "u32",
        no: "u32",
      },
    },
  },
  /**
   * Lookup38: pallet_membership::pallet::Event<T, I>
   */
  PalletMembershipEvent: {
    _enum: [
      "MemberAdded",
      "MemberRemoved",
      "MembersSwapped",
      "MembersReset",
      "KeyChanged",
      "Dummy",
    ],
  },
  /**
   * Lookup41: manta_collator_selection::pallet::Event<T>
   */
  MantaCollatorSelectionEvent: {
    _enum: {
      NewInvulnerables: "Vec<AccountId32>",
      NewDesiredCandidates: "u32",
      NewCandidacyBond: "u128",
      CandidateAdded: "(AccountId32,u128)",
      CandidateRemoved: "AccountId32",
    },
  },
  /**
   * Lookup42: pallet_session::pallet::Event
   */
  PalletSessionEvent: {
    _enum: {
      NewSession: {
        sessionIndex: "u32",
      },
    },
  },
  /**
   * Lookup43: pallet_treasury::pallet::Event<T, I>
   */
  PalletTreasuryEvent: {
    _enum: {
      Proposed: {
        proposalIndex: "u32",
      },
      Spending: {
        budgetRemaining: "u128",
      },
      Awarded: {
        proposalIndex: "u32",
        award: "u128",
        account: "AccountId32",
      },
      Rejected: {
        proposalIndex: "u32",
        slashed: "u128",
      },
      Burnt: {
        burntFunds: "u128",
      },
      Rollover: {
        rolloverBalance: "u128",
      },
      Deposit: {
        value: "u128",
      },
    },
  },
  /**
   * Lookup44: pallet_preimage::pallet::Event<T>
   */
  PalletPreimageEvent: {
    _enum: {
      Noted: {
        _alias: {
          hash_: "hash",
        },
        hash_: "H256",
      },
      Requested: {
        _alias: {
          hash_: "hash",
        },
        hash_: "H256",
      },
      Cleared: {
        _alias: {
          hash_: "hash",
        },
        hash_: "H256",
      },
    },
  },
  /**
   * Lookup45: pallet_scheduler::pallet::Event<T>
   */
  PalletSchedulerEvent: {
    _enum: {
      Scheduled: {
        when: "u32",
        index: "u32",
      },
      Canceled: {
        when: "u32",
        index: "u32",
      },
      Dispatched: {
        task: "(u32,u32)",
        id: "Option<Bytes>",
        result: "Result<Null, SpRuntimeDispatchError>",
      },
      CallLookupFailed: {
        task: "(u32,u32)",
        id: "Option<Bytes>",
        error: "FrameSupportScheduleLookupError",
      },
    },
  },
  /**
   * Lookup48: frame_support::traits::schedule::LookupError
   */
  FrameSupportScheduleLookupError: {
    _enum: ["Unknown", "BadFormat"],
  },
  /**
   * Lookup49: cumulus_pallet_xcmp_queue::pallet::Event<T>
   */
  CumulusPalletXcmpQueueEvent: {
    _enum: {
      Success: "Option<H256>",
      Fail: "(Option<H256>,XcmV2TraitsError)",
      BadVersion: "Option<H256>",
      BadFormat: "Option<H256>",
      UpwardMessageSent: "Option<H256>",
      XcmpMessageSent: "Option<H256>",
      OverweightEnqueued: "(u32,u32,u64,u64)",
      OverweightServiced: "(u64,u64)",
    },
  },
  /**
   * Lookup51: xcm::v2::traits::Error
   */
  XcmV2TraitsError: {
    _enum: {
      Overflow: "Null",
      Unimplemented: "Null",
      UntrustedReserveLocation: "Null",
      UntrustedTeleportLocation: "Null",
      MultiLocationFull: "Null",
      MultiLocationNotInvertible: "Null",
      BadOrigin: "Null",
      InvalidLocation: "Null",
      AssetNotFound: "Null",
      FailedToTransactAsset: "Null",
      NotWithdrawable: "Null",
      LocationCannotHold: "Null",
      ExceedsMaxMessageSize: "Null",
      DestinationUnsupported: "Null",
      Transport: "Null",
      Unroutable: "Null",
      UnknownClaim: "Null",
      FailedToDecode: "Null",
      MaxWeightInvalid: "Null",
      NotHoldingFees: "Null",
      TooExpensive: "Null",
      Trap: "u64",
      UnhandledXcmVersion: "Null",
      WeightLimitReached: "u64",
      Barrier: "Null",
      WeightNotComputable: "Null",
    },
  },
  /**
   * Lookup53: pallet_xcm::pallet::Event<T>
   */
  PalletXcmEvent: {
    _enum: {
      Attempted: "XcmV2TraitsOutcome",
      Sent: "(XcmV1MultiLocation,XcmV1MultiLocation,XcmV2Xcm)",
      UnexpectedResponse: "(XcmV1MultiLocation,u64)",
      ResponseReady: "(u64,XcmV2Response)",
      Notified: "(u64,u8,u8)",
      NotifyOverweight: "(u64,u8,u8,u64,u64)",
      NotifyDispatchError: "(u64,u8,u8)",
      NotifyDecodeFailed: "(u64,u8,u8)",
      InvalidResponder: "(XcmV1MultiLocation,u64,Option<XcmV1MultiLocation>)",
      InvalidResponderVersion: "(XcmV1MultiLocation,u64)",
      ResponseTaken: "u64",
      AssetsTrapped: "(H256,XcmV1MultiLocation,XcmVersionedMultiAssets)",
      VersionChangeNotified: "(XcmV1MultiLocation,u32)",
      SupportedVersionChanged: "(XcmV1MultiLocation,u32)",
      NotifyTargetSendFail: "(XcmV1MultiLocation,u64,XcmV2TraitsError)",
      NotifyTargetMigrationFail: "(XcmVersionedMultiLocation,u64)",
    },
  },
  /**
   * Lookup54: xcm::v2::traits::Outcome
   */
  XcmV2TraitsOutcome: {
    _enum: {
      Complete: "u64",
      Incomplete: "(u64,XcmV2TraitsError)",
      Error: "XcmV2TraitsError",
    },
  },
  /**
   * Lookup55: xcm::v1::multilocation::MultiLocation
   */
  XcmV1MultiLocation: {
    parents: "u8",
    interior: "XcmV1MultilocationJunctions",
  },
  /**
   * Lookup56: xcm::v1::multilocation::Junctions
   */
  XcmV1MultilocationJunctions: {
    _enum: {
      Here: "Null",
      X1: "XcmV1Junction",
      X2: "(XcmV1Junction,XcmV1Junction)",
      X3: "(XcmV1Junction,XcmV1Junction,XcmV1Junction)",
      X4: "(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)",
      X5: "(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)",
      X6: "(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)",
      X7: "(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)",
      X8: "(XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction,XcmV1Junction)",
    },
  },
  /**
   * Lookup57: xcm::v1::junction::Junction
   */
  XcmV1Junction: {
    _enum: {
      Parachain: "Compact<u32>",
      AccountId32: {
        network: "XcmV0JunctionNetworkId",
        id: "[u8;32]",
      },
      AccountIndex64: {
        network: "XcmV0JunctionNetworkId",
        index: "Compact<u64>",
      },
      AccountKey20: {
        network: "XcmV0JunctionNetworkId",
        key: "[u8;20]",
      },
      PalletInstance: "u8",
      GeneralIndex: "Compact<u128>",
      GeneralKey: "Bytes",
      OnlyChild: "Null",
      Plurality: {
        id: "XcmV0JunctionBodyId",
        part: "XcmV0JunctionBodyPart",
      },
    },
  },
  /**
   * Lookup59: xcm::v0::junction::NetworkId
   */
  XcmV0JunctionNetworkId: {
    _enum: {
      Any: "Null",
      Named: "Bytes",
      Polkadot: "Null",
      Kusama: "Null",
    },
  },
  /**
   * Lookup63: xcm::v0::junction::BodyId
   */
  XcmV0JunctionBodyId: {
    _enum: {
      Unit: "Null",
      Named: "Bytes",
      Index: "Compact<u32>",
      Executive: "Null",
      Technical: "Null",
      Legislative: "Null",
      Judicial: "Null",
    },
  },
  /**
   * Lookup64: xcm::v0::junction::BodyPart
   */
  XcmV0JunctionBodyPart: {
    _enum: {
      Voice: "Null",
      Members: {
        count: "Compact<u32>",
      },
      Fraction: {
        nom: "Compact<u32>",
        denom: "Compact<u32>",
      },
      AtLeastProportion: {
        nom: "Compact<u32>",
        denom: "Compact<u32>",
      },
      MoreThanProportion: {
        nom: "Compact<u32>",
        denom: "Compact<u32>",
      },
    },
  },
  /**
   * Lookup65: xcm::v2::Xcm<Call>
   */
  XcmV2Xcm: "Vec<XcmV2Instruction>",
  /**
   * Lookup67: xcm::v2::Instruction<Call>
   */
  XcmV2Instruction: {
    _enum: {
      WithdrawAsset: "XcmV1MultiassetMultiAssets",
      ReserveAssetDeposited: "XcmV1MultiassetMultiAssets",
      ReceiveTeleportedAsset: "XcmV1MultiassetMultiAssets",
      QueryResponse: {
        queryId: "Compact<u64>",
        response: "XcmV2Response",
        maxWeight: "Compact<u64>",
      },
      TransferAsset: {
        assets: "XcmV1MultiassetMultiAssets",
        beneficiary: "XcmV1MultiLocation",
      },
      TransferReserveAsset: {
        assets: "XcmV1MultiassetMultiAssets",
        dest: "XcmV1MultiLocation",
        xcm: "XcmV2Xcm",
      },
      Transact: {
        originType: "XcmV0OriginKind",
        requireWeightAtMost: "Compact<u64>",
        call: "XcmDoubleEncoded",
      },
      HrmpNewChannelOpenRequest: {
        sender: "Compact<u32>",
        maxMessageSize: "Compact<u32>",
        maxCapacity: "Compact<u32>",
      },
      HrmpChannelAccepted: {
        recipient: "Compact<u32>",
      },
      HrmpChannelClosing: {
        initiator: "Compact<u32>",
        sender: "Compact<u32>",
        recipient: "Compact<u32>",
      },
      ClearOrigin: "Null",
      DescendOrigin: "XcmV1MultilocationJunctions",
      ReportError: {
        queryId: "Compact<u64>",
        dest: "XcmV1MultiLocation",
        maxResponseWeight: "Compact<u64>",
      },
      DepositAsset: {
        assets: "XcmV1MultiassetMultiAssetFilter",
        maxAssets: "Compact<u32>",
        beneficiary: "XcmV1MultiLocation",
      },
      DepositReserveAsset: {
        assets: "XcmV1MultiassetMultiAssetFilter",
        maxAssets: "Compact<u32>",
        dest: "XcmV1MultiLocation",
        xcm: "XcmV2Xcm",
      },
      ExchangeAsset: {
        give: "XcmV1MultiassetMultiAssetFilter",
        receive: "XcmV1MultiassetMultiAssets",
      },
      InitiateReserveWithdraw: {
        assets: "XcmV1MultiassetMultiAssetFilter",
        reserve: "XcmV1MultiLocation",
        xcm: "XcmV2Xcm",
      },
      InitiateTeleport: {
        assets: "XcmV1MultiassetMultiAssetFilter",
        dest: "XcmV1MultiLocation",
        xcm: "XcmV2Xcm",
      },
      QueryHolding: {
        queryId: "Compact<u64>",
        dest: "XcmV1MultiLocation",
        assets: "XcmV1MultiassetMultiAssetFilter",
        maxResponseWeight: "Compact<u64>",
      },
      BuyExecution: {
        fees: "XcmV1MultiAsset",
        weightLimit: "XcmV2WeightLimit",
      },
      RefundSurplus: "Null",
      SetErrorHandler: "XcmV2Xcm",
      SetAppendix: "XcmV2Xcm",
      ClearError: "Null",
      ClaimAsset: {
        assets: "XcmV1MultiassetMultiAssets",
        ticket: "XcmV1MultiLocation",
      },
      Trap: "Compact<u64>",
      SubscribeVersion: {
        queryId: "Compact<u64>",
        maxResponseWeight: "Compact<u64>",
      },
      UnsubscribeVersion: "Null",
    },
  },
  /**
   * Lookup68: xcm::v1::multiasset::MultiAssets
   */
  XcmV1MultiassetMultiAssets: "Vec<XcmV1MultiAsset>",
  /**
   * Lookup70: xcm::v1::multiasset::MultiAsset
   */
  XcmV1MultiAsset: {
    id: "XcmV1MultiassetAssetId",
    fun: "XcmV1MultiassetFungibility",
  },
  /**
   * Lookup71: xcm::v1::multiasset::AssetId
   */
  XcmV1MultiassetAssetId: {
    _enum: {
      Concrete: "XcmV1MultiLocation",
      Abstract: "Bytes",
    },
  },
  /**
   * Lookup72: xcm::v1::multiasset::Fungibility
   */
  XcmV1MultiassetFungibility: {
    _enum: {
      Fungible: "Compact<u128>",
      NonFungible: "XcmV1MultiassetAssetInstance",
    },
  },
  /**
   * Lookup73: xcm::v1::multiasset::AssetInstance
   */
  XcmV1MultiassetAssetInstance: {
    _enum: {
      Undefined: "Null",
      Index: "Compact<u128>",
      Array4: "[u8;4]",
      Array8: "[u8;8]",
      Array16: "[u8;16]",
      Array32: "[u8;32]",
      Blob: "Bytes",
    },
  },
  /**
   * Lookup76: xcm::v2::Response
   */
  XcmV2Response: {
    _enum: {
      Null: "Null",
      Assets: "XcmV1MultiassetMultiAssets",
      ExecutionResult: "Option<(u32,XcmV2TraitsError)>",
      Version: "u32",
    },
  },
  /**
   * Lookup79: xcm::v0::OriginKind
   */
  XcmV0OriginKind: {
    _enum: ["Native", "SovereignAccount", "Superuser", "Xcm"],
  },
  /**
   * Lookup80: xcm::double_encoded::DoubleEncoded<T>
   */
  XcmDoubleEncoded: {
    encoded: "Bytes",
  },
  /**
   * Lookup81: xcm::v1::multiasset::MultiAssetFilter
   */
  XcmV1MultiassetMultiAssetFilter: {
    _enum: {
      Definite: "XcmV1MultiassetMultiAssets",
      Wild: "XcmV1MultiassetWildMultiAsset",
    },
  },
  /**
   * Lookup82: xcm::v1::multiasset::WildMultiAsset
   */
  XcmV1MultiassetWildMultiAsset: {
    _enum: {
      All: "Null",
      AllOf: {
        id: "XcmV1MultiassetAssetId",
        fun: "XcmV1MultiassetWildFungibility",
      },
    },
  },
  /**
   * Lookup83: xcm::v1::multiasset::WildFungibility
   */
  XcmV1MultiassetWildFungibility: {
    _enum: ["Fungible", "NonFungible"],
  },
  /**
   * Lookup84: xcm::v2::WeightLimit
   */
  XcmV2WeightLimit: {
    _enum: {
      Unlimited: "Null",
      Limited: "Compact<u64>",
    },
  },
  /**
   * Lookup86: xcm::VersionedMultiAssets
   */
  XcmVersionedMultiAssets: {
    _enum: {
      V0: "Vec<XcmV0MultiAsset>",
      V1: "XcmV1MultiassetMultiAssets",
    },
  },
  /**
   * Lookup88: xcm::v0::multi_asset::MultiAsset
   */
  XcmV0MultiAsset: {
    _enum: {
      None: "Null",
      All: "Null",
      AllFungible: "Null",
      AllNonFungible: "Null",
      AllAbstractFungible: {
        id: "Bytes",
      },
      AllAbstractNonFungible: {
        class: "Bytes",
      },
      AllConcreteFungible: {
        id: "XcmV0MultiLocation",
      },
      AllConcreteNonFungible: {
        class: "XcmV0MultiLocation",
      },
      AbstractFungible: {
        id: "Bytes",
        amount: "Compact<u128>",
      },
      AbstractNonFungible: {
        class: "Bytes",
        instance: "XcmV1MultiassetAssetInstance",
      },
      ConcreteFungible: {
        id: "XcmV0MultiLocation",
        amount: "Compact<u128>",
      },
      ConcreteNonFungible: {
        class: "XcmV0MultiLocation",
        instance: "XcmV1MultiassetAssetInstance",
      },
    },
  },
  /**
   * Lookup89: xcm::v0::multi_location::MultiLocation
   */
  XcmV0MultiLocation: {
    _enum: {
      Null: "Null",
      X1: "XcmV0Junction",
      X2: "(XcmV0Junction,XcmV0Junction)",
      X3: "(XcmV0Junction,XcmV0Junction,XcmV0Junction)",
      X4: "(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)",
      X5: "(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)",
      X6: "(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)",
      X7: "(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)",
      X8: "(XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction,XcmV0Junction)",
    },
  },
  /**
   * Lookup90: xcm::v0::junction::Junction
   */
  XcmV0Junction: {
    _enum: {
      Parent: "Null",
      Parachain: "Compact<u32>",
      AccountId32: {
        network: "XcmV0JunctionNetworkId",
        id: "[u8;32]",
      },
      AccountIndex64: {
        network: "XcmV0JunctionNetworkId",
        index: "Compact<u64>",
      },
      AccountKey20: {
        network: "XcmV0JunctionNetworkId",
        key: "[u8;20]",
      },
      PalletInstance: "u8",
      GeneralIndex: "Compact<u128>",
      GeneralKey: "Bytes",
      OnlyChild: "Null",
      Plurality: {
        id: "XcmV0JunctionBodyId",
        part: "XcmV0JunctionBodyPart",
      },
    },
  },
  /**
   * Lookup91: xcm::VersionedMultiLocation
   */
  XcmVersionedMultiLocation: {
    _enum: {
      V0: "XcmV0MultiLocation",
      V1: "XcmV1MultiLocation",
    },
  },
  /**
   * Lookup92: cumulus_pallet_xcm::pallet::Event<T>
   */
  CumulusPalletXcmEvent: {
    _enum: {
      InvalidFormat: "[u8;8]",
      UnsupportedVersion: "[u8;8]",
      ExecutedDownward: "([u8;8],XcmV2TraitsOutcome)",
    },
  },
  /**
   * Lookup93: cumulus_pallet_dmp_queue::pallet::Event<T>
   */
  CumulusPalletDmpQueueEvent: {
    _enum: {
      InvalidFormat: "[u8;32]",
      UnsupportedVersion: "[u8;32]",
      ExecutedDownward: "([u8;32],XcmV2TraitsOutcome)",
      WeightExhausted: "([u8;32],u64,u64)",
      OverweightEnqueued: "([u8;32],u64,u64)",
      OverweightServiced: "(u64,u64)",
    },
  },
  /**
   * Lookup94: orml_xtokens::module::Event<T>
   */
  OrmlXtokensModuleEvent: {
    _enum: {
      Transferred: {
        sender: "AccountId32",
        currencyId: "DolphinRuntimeCurrencyId",
        amount: "u128",
        dest: "XcmV1MultiLocation",
      },
      TransferredWithFee: {
        sender: "AccountId32",
        currencyId: "DolphinRuntimeCurrencyId",
        amount: "u128",
        fee: "u128",
        dest: "XcmV1MultiLocation",
      },
      TransferredMultiAsset: {
        sender: "AccountId32",
        asset: "XcmV1MultiAsset",
        dest: "XcmV1MultiLocation",
      },
      TransferredMultiAssetWithFee: {
        sender: "AccountId32",
        asset: "XcmV1MultiAsset",
        fee: "XcmV1MultiAsset",
        dest: "XcmV1MultiLocation",
      },
      TransferredMultiCurrencies: {
        sender: "AccountId32",
        currencies: "Vec<(DolphinRuntimeCurrencyId,u128)>",
        dest: "XcmV1MultiLocation",
      },
      TransferredMultiAssets: {
        sender: "AccountId32",
        assets: "XcmV1MultiassetMultiAssets",
        dest: "XcmV1MultiLocation",
      },
    },
  },
  /**
   * Lookup95: dolphin_runtime::CurrencyId
   */
  DolphinRuntimeCurrencyId: {
    _enum: {
      MantaCurrency: "u32",
    },
  },
  /**
   * Lookup98: pallet_utility::pallet::Event
   */
  PalletUtilityEvent: {
    _enum: {
      BatchInterrupted: {
        index: "u32",
        error: "SpRuntimeDispatchError",
      },
      BatchCompleted: "Null",
      ItemCompleted: "Null",
      DispatchedAs: {
        result: "Result<Null, SpRuntimeDispatchError>",
      },
    },
  },
  /**
   * Lookup99: pallet_multisig::pallet::Event<T>
   */
  PalletMultisigEvent: {
    _enum: {
      NewMultisig: {
        approving: "AccountId32",
        multisig: "AccountId32",
        callHash: "[u8;32]",
      },
      MultisigApproval: {
        approving: "AccountId32",
        timepoint: "PalletMultisigTimepoint",
        multisig: "AccountId32",
        callHash: "[u8;32]",
      },
      MultisigExecuted: {
        approving: "AccountId32",
        timepoint: "PalletMultisigTimepoint",
        multisig: "AccountId32",
        callHash: "[u8;32]",
        result: "Result<Null, SpRuntimeDispatchError>",
      },
      MultisigCancelled: {
        cancelling: "AccountId32",
        timepoint: "PalletMultisigTimepoint",
        multisig: "AccountId32",
        callHash: "[u8;32]",
      },
    },
  },
  /**
   * Lookup100: pallet_multisig::Timepoint<BlockNumber>
   */
  PalletMultisigTimepoint: {
    height: "u32",
    index: "u32",
  },
  /**
   * Lookup101: pallet_sudo::pallet::Event<T>
   */
  PalletSudoEvent: {
    _enum: {
      Sudid: {
        sudoResult: "Result<Null, SpRuntimeDispatchError>",
      },
      KeyChanged: {
        oldSudoer: "Option<AccountId32>",
      },
      SudoAsDone: {
        sudoResult: "Result<Null, SpRuntimeDispatchError>",
      },
    },
  },
  /**
   * Lookup103: pallet_assets::pallet::Event<T, I>
   */
  PalletAssetsEvent: {
    _enum: {
      Created: {
        assetId: "u32",
        creator: "AccountId32",
        owner: "AccountId32",
      },
      Issued: {
        assetId: "u32",
        owner: "AccountId32",
        totalSupply: "u128",
      },
      Transferred: {
        assetId: "u32",
        from: "AccountId32",
        to: "AccountId32",
        amount: "u128",
      },
      Burned: {
        assetId: "u32",
        owner: "AccountId32",
        balance: "u128",
      },
      TeamChanged: {
        assetId: "u32",
        issuer: "AccountId32",
        admin: "AccountId32",
        freezer: "AccountId32",
      },
      OwnerChanged: {
        assetId: "u32",
        owner: "AccountId32",
      },
      Frozen: {
        assetId: "u32",
        who: "AccountId32",
      },
      Thawed: {
        assetId: "u32",
        who: "AccountId32",
      },
      AssetFrozen: {
        assetId: "u32",
      },
      AssetThawed: {
        assetId: "u32",
      },
      Destroyed: {
        assetId: "u32",
      },
      ForceCreated: {
        assetId: "u32",
        owner: "AccountId32",
      },
      MetadataSet: {
        assetId: "u32",
        name: "Bytes",
        symbol: "Bytes",
        decimals: "u8",
        isFrozen: "bool",
      },
      MetadataCleared: {
        assetId: "u32",
      },
      ApprovedTransfer: {
        assetId: "u32",
        source: "AccountId32",
        delegate: "AccountId32",
        amount: "u128",
      },
      ApprovalCancelled: {
        assetId: "u32",
        owner: "AccountId32",
        delegate: "AccountId32",
      },
      TransferredApproved: {
        assetId: "u32",
        owner: "AccountId32",
        delegate: "AccountId32",
        destination: "AccountId32",
        amount: "u128",
      },
      AssetStatusChanged: {
        assetId: "u32",
      },
    },
  },
  /**
   * Lookup104: pallet_asset_manager::pallet::Event<T>
   */
  PalletAssetManagerEvent: {
    _enum: {
      AssetRegistered: {
        assetId: "u32",
        assetAddress: "MantaPrimitivesAssetsAssetLocation",
        metadata: "MantaPrimitivesAssetsAssetRegistarMetadata",
      },
      AssetLocationUpdated: {
        assetId: "u32",
        location: "MantaPrimitivesAssetsAssetLocation",
      },
      AssetMetadataUpdated: {
        assetId: "u32",
        metadata: "MantaPrimitivesAssetsAssetRegistarMetadata",
      },
      UnitsPerSecondUpdated: {
        assetId: "u32",
        unitsPerSecond: "u128",
      },
    },
  },
  /**
   * Lookup105: manta_primitives::assets::AssetLocation
   */
  MantaPrimitivesAssetsAssetLocation: "XcmVersionedMultiLocation",
  /**
   * Lookup106: manta_primitives::assets::AssetRegistarMetadata<Balance>
   */
  MantaPrimitivesAssetsAssetRegistarMetadata: {
    name: "Bytes",
    symbol: "Bytes",
    decimals: "u8",
    evmAddress: "Option<H160>",
    isFrozen: "bool",
    minBalance: "u128",
    isSufficient: "bool",
  },
  /**
   * Lookup109: pallet_manta_pay::pallet::Event<T>
   */
  PalletMantaPayEvent: {
    _enum: {
      Transfer: {
        asset: "PalletMantaPayAsset",
        source: "AccountId32",
        sink: "AccountId32",
      },
      Mint: {
        asset: "PalletMantaPayAsset",
        source: "AccountId32",
      },
      PrivateTransfer: {
        origin: "AccountId32",
      },
      Reclaim: {
        asset: "PalletMantaPayAsset",
        sink: "AccountId32",
      },
    },
  },
  /**
   * Lookup110: pallet_manta_pay::types::Asset
   */
  PalletMantaPayAsset: {
    id: "u32",
    value: "u128",
  },
  /**
   * Lookup111: frame_system::Phase
   */
  FrameSystemPhase: {
    _enum: {
      ApplyExtrinsic: "u32",
      Finalization: "Null",
      Initialization: "Null",
    },
  },
  /**
   * Lookup114: frame_system::LastRuntimeUpgradeInfo
   */
  FrameSystemLastRuntimeUpgradeInfo: {
    specVersion: "Compact<u32>",
    specName: "Text",
  },
  /**
   * Lookup116: frame_system::pallet::Call<T>
   */
  FrameSystemCall: {
    _enum: {
      fill_block: {
        ratio: "Perbill",
      },
      remark: {
        remark: "Bytes",
      },
      set_heap_pages: {
        pages: "u64",
      },
      set_code: {
        code: "Bytes",
      },
      set_code_without_checks: {
        code: "Bytes",
      },
      set_storage: {
        items: "Vec<(Bytes,Bytes)>",
      },
      kill_storage: {
        _alias: {
          keys_: "keys",
        },
        keys_: "Vec<Bytes>",
      },
      kill_prefix: {
        prefix: "Bytes",
        subkeys: "u32",
      },
      remark_with_event: {
        remark: "Bytes",
      },
    },
  },
  /**
   * Lookup121: frame_system::limits::BlockWeights
   */
  FrameSystemLimitsBlockWeights: {
    baseBlock: "u64",
    maxBlock: "u64",
    perClass: "FrameSupportWeightsPerDispatchClassWeightsPerClass",
  },
  /**
   * Lookup122:
   * frame_support::weights::PerDispatchClass<frame_system::limits::WeightsPerClass>
   */
  FrameSupportWeightsPerDispatchClassWeightsPerClass: {
    normal: "FrameSystemLimitsWeightsPerClass",
    operational: "FrameSystemLimitsWeightsPerClass",
    mandatory: "FrameSystemLimitsWeightsPerClass",
  },
  /**
   * Lookup123: frame_system::limits::WeightsPerClass
   */
  FrameSystemLimitsWeightsPerClass: {
    baseExtrinsic: "u64",
    maxExtrinsic: "Option<u64>",
    maxTotal: "Option<u64>",
    reserved: "Option<u64>",
  },
  /**
   * Lookup125: frame_system::limits::BlockLength
   */
  FrameSystemLimitsBlockLength: {
    max: "FrameSupportWeightsPerDispatchClassU32",
  },
  /**
   * Lookup126: frame_support::weights::PerDispatchClass<T>
   */
  FrameSupportWeightsPerDispatchClassU32: {
    normal: "u32",
    operational: "u32",
    mandatory: "u32",
  },
  /**
   * Lookup127: frame_support::weights::RuntimeDbWeight
   */
  FrameSupportWeightsRuntimeDbWeight: {
    read: "u64",
    write: "u64",
  },
  /**
   * Lookup128: sp_version::RuntimeVersion
   */
  SpVersionRuntimeVersion: {
    specName: "Text",
    implName: "Text",
    authoringVersion: "u32",
    specVersion: "u32",
    implVersion: "u32",
    apis: "Vec<([u8;8],u32)>",
    transactionVersion: "u32",
    stateVersion: "u8",
  },
  /**
   * Lookup133: frame_system::pallet::Error<T>
   */
  FrameSystemError: {
    _enum: [
      "InvalidSpecName",
      "SpecVersionNeedsToIncrease",
      "FailedToExtractRuntimeVersion",
      "NonDefaultComposite",
      "NonZeroRefCount",
      "CallFiltered",
    ],
  },
  /**
   * Lookup134: polkadot_primitives::v1::PersistedValidationData<primitive_types::H256, N>
   */
  PolkadotPrimitivesV1PersistedValidationData: {
    parentHead: "Bytes",
    relayParentNumber: "u32",
    relayParentStorageRoot: "H256",
    maxPovSize: "u32",
  },
  /**
   * Lookup137: polkadot_primitives::v1::UpgradeRestriction
   */
  PolkadotPrimitivesV1UpgradeRestriction: {
    _enum: ["Present"],
  },
  /**
   * Lookup138:
   * cumulus_pallet_parachain_system::relay_state_snapshot::MessagingStateSnapshot
   */
  CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot: {
    dmqMqcHead: "H256",
    relayDispatchQueueSize: "(u32,u32)",
    ingressChannels: "Vec<(u32,PolkadotPrimitivesV1AbridgedHrmpChannel)>",
    egressChannels: "Vec<(u32,PolkadotPrimitivesV1AbridgedHrmpChannel)>",
  },
  /**
   * Lookup141: polkadot_primitives::v1::AbridgedHrmpChannel
   */
  PolkadotPrimitivesV1AbridgedHrmpChannel: {
    maxCapacity: "u32",
    maxTotalSize: "u32",
    maxMessageSize: "u32",
    msgCount: "u32",
    totalSize: "u32",
    mqcHead: "Option<H256>",
  },
  /**
   * Lookup142: polkadot_primitives::v1::AbridgedHostConfiguration
   */
  PolkadotPrimitivesV1AbridgedHostConfiguration: {
    maxCodeSize: "u32",
    maxHeadDataSize: "u32",
    maxUpwardQueueCount: "u32",
    maxUpwardQueueSize: "u32",
    maxUpwardMessageSize: "u32",
    maxUpwardMessageNumPerCandidate: "u32",
    hrmpMaxMessageNumPerCandidate: "u32",
    validationUpgradeCooldown: "u32",
    validationUpgradeDelay: "u32",
  },
  /**
   * Lookup148:
   * polkadot_core_primitives::OutboundHrmpMessage<polkadot_parachain::primitives::Id>
   */
  PolkadotCorePrimitivesOutboundHrmpMessage: {
    recipient: "u32",
    data: "Bytes",
  },
  /**
   * Lookup149: cumulus_pallet_parachain_system::pallet::Call<T>
   */
  CumulusPalletParachainSystemCall: {
    _enum: {
      set_validation_data: {
        data: "CumulusPrimitivesParachainInherentParachainInherentData",
      },
      sudo_send_upward_message: {
        message: "Bytes",
      },
      authorize_upgrade: {
        codeHash: "H256",
      },
      enact_authorized_upgrade: {
        code: "Bytes",
      },
    },
  },
  /**
   * Lookup150: cumulus_primitives_parachain_inherent::ParachainInherentData
   */
  CumulusPrimitivesParachainInherentParachainInherentData: {
    validationData: "PolkadotPrimitivesV1PersistedValidationData",
    relayChainState: "SpTrieStorageProof",
    downwardMessages: "Vec<PolkadotCorePrimitivesInboundDownwardMessage>",
    horizontalMessages:
      "BTreeMap<u32, Vec<PolkadotCorePrimitivesInboundHrmpMessage>>",
  },
  /**
   * Lookup151: sp_trie::storage_proof::StorageProof
   */
  SpTrieStorageProof: {
    trieNodes: "Vec<Bytes>",
  },
  /**
   * Lookup153: polkadot_core_primitives::InboundDownwardMessage<BlockNumber>
   */
  PolkadotCorePrimitivesInboundDownwardMessage: {
    sentAt: "u32",
    msg: "Bytes",
  },
  /**
   * Lookup156: polkadot_core_primitives::InboundHrmpMessage<BlockNumber>
   */
  PolkadotCorePrimitivesInboundHrmpMessage: {
    sentAt: "u32",
    data: "Bytes",
  },
  /**
   * Lookup159: cumulus_pallet_parachain_system::pallet::Error<T>
   */
  CumulusPalletParachainSystemError: {
    _enum: [
      "OverlappingUpgrades",
      "ProhibitedByPolkadot",
      "TooBig",
      "ValidationDataNotAvailable",
      "HostConfigurationNotAvailable",
      "NotScheduled",
      "NothingAuthorized",
      "Unauthorized",
    ],
  },
  /**
   * Lookup160: pallet_timestamp::pallet::Call<T>
   */
  PalletTimestampCall: {
    _enum: {
      set: {
        now: "Compact<u64>",
      },
    },
  },
  /**
   * Lookup161: pallet_tx_pause::pallet::Call<T>
   */
  PalletTxPauseCall: {
    _enum: {
      pause_transaction: {
        palletName: "Bytes",
        functionName: "Bytes",
      },
      unpause_transaction: {
        palletName: "Bytes",
        functionName: "Bytes",
      },
    },
  },
  /**
   * Lookup162: pallet_tx_pause::pallet::Error<T>
   */
  PalletTxPauseError: {
    _enum: ["CannotPause", "InvalidCharacter"],
  },
  /**
   * Lookup164: pallet_balances::BalanceLock<Balance>
   */
  PalletBalancesBalanceLock: {
    id: "[u8;8]",
    amount: "u128",
    reasons: "PalletBalancesReasons",
  },
  /**
   * Lookup165: pallet_balances::Reasons
   */
  PalletBalancesReasons: {
    _enum: ["Fee", "Misc", "All"],
  },
  /**
   * Lookup168: pallet_balances::ReserveData<ReserveIdentifier, Balance>
   */
  PalletBalancesReserveData: {
    id: "[u8;8]",
    amount: "u128",
  },
  /**
   * Lookup170: pallet_balances::Releases
   */
  PalletBalancesReleases: {
    _enum: ["V1_0_0", "V2_0_0"],
  },
  /**
   * Lookup171: pallet_balances::pallet::Call<T, I>
   */
  PalletBalancesCall: {
    _enum: {
      transfer: {
        dest: "MultiAddress",
        value: "Compact<u128>",
      },
      set_balance: {
        who: "MultiAddress",
        newFree: "Compact<u128>",
        newReserved: "Compact<u128>",
      },
      force_transfer: {
        source: "MultiAddress",
        dest: "MultiAddress",
        value: "Compact<u128>",
      },
      transfer_keep_alive: {
        dest: "MultiAddress",
        value: "Compact<u128>",
      },
      transfer_all: {
        dest: "MultiAddress",
        keepAlive: "bool",
      },
      force_unreserve: {
        who: "MultiAddress",
        amount: "u128",
      },
    },
  },
  /**
   * Lookup174: pallet_balances::pallet::Error<T, I>
   */
  PalletBalancesError: {
    _enum: [
      "VestingBalance",
      "LiquidityRestrictions",
      "InsufficientBalance",
      "ExistentialDeposit",
      "KeepAlive",
      "ExistingVestingSchedule",
      "DeadAccount",
      "TooManyReserves",
    ],
  },
  /**
   * Lookup176: pallet_transaction_payment::Releases
   */
  PalletTransactionPaymentReleases: {
    _enum: ["V1Ancient", "V2"],
  },
  /**
   * Lookup178: frame_support::weights::WeightToFeeCoefficient<Balance>
   */
  FrameSupportWeightsWeightToFeeCoefficient: {
    coeffInteger: "u128",
    coeffFrac: "Perbill",
    negative: "bool",
    degree: "u8",
  },
  /**
   * Lookup182: pallet_democracy::PreimageStatus<sp_core::crypto::AccountId32,
   * Balance, BlockNumber>
   */
  PalletDemocracyPreimageStatus: {
    _enum: {
      Missing: "u32",
      Available: {
        data: "Bytes",
        provider: "AccountId32",
        deposit: "u128",
        since: "u32",
        expiry: "Option<u32>",
      },
    },
  },
  /**
   * Lookup184: pallet_democracy::types::ReferendumInfo<BlockNumber,
   * primitive_types::H256, Balance>
   */
  PalletDemocracyReferendumInfo: {
    _enum: {
      Ongoing: "PalletDemocracyReferendumStatus",
      Finished: {
        approved: "bool",
        end: "u32",
      },
    },
  },
  /**
   * Lookup185: pallet_democracy::types::ReferendumStatus<BlockNumber,
   * primitive_types::H256, Balance>
   */
  PalletDemocracyReferendumStatus: {
    end: "u32",
    proposalHash: "H256",
    threshold: "PalletDemocracyVoteThreshold",
    delay: "u32",
    tally: "PalletDemocracyTally",
  },
  /**
   * Lookup186: pallet_democracy::types::Tally<Balance>
   */
  PalletDemocracyTally: {
    ayes: "u128",
    nays: "u128",
    turnout: "u128",
  },
  /**
   * Lookup187: pallet_democracy::vote::Voting<Balance,
   * sp_core::crypto::AccountId32, BlockNumber>
   */
  PalletDemocracyVoteVoting: {
    _enum: {
      Direct: {
        votes: "Vec<(u32,PalletDemocracyVoteAccountVote)>",
        delegations: "PalletDemocracyDelegations",
        prior: "PalletDemocracyVotePriorLock",
      },
      Delegating: {
        balance: "u128",
        target: "AccountId32",
        conviction: "PalletDemocracyConviction",
        delegations: "PalletDemocracyDelegations",
        prior: "PalletDemocracyVotePriorLock",
      },
    },
  },
  /**
   * Lookup190: pallet_democracy::types::Delegations<Balance>
   */
  PalletDemocracyDelegations: {
    votes: "u128",
    capital: "u128",
  },
  /**
   * Lookup191: pallet_democracy::vote::PriorLock<BlockNumber, Balance>
   */
  PalletDemocracyVotePriorLock: "(u32,u128)",
  /**
   * Lookup192: pallet_democracy::conviction::Conviction
   */
  PalletDemocracyConviction: {
    _enum: [
      "None",
      "Locked1x",
      "Locked2x",
      "Locked3x",
      "Locked4x",
      "Locked5x",
      "Locked6x",
    ],
  },
  /**
   * Lookup195: pallet_democracy::Releases
   */
  PalletDemocracyReleases: {
    _enum: ["V1"],
  },
  /**
   * Lookup196: pallet_democracy::pallet::Call<T>
   */
  PalletDemocracyCall: {
    _enum: {
      propose: {
        proposalHash: "H256",
        value: "Compact<u128>",
      },
      second: {
        proposal: "Compact<u32>",
        secondsUpperBound: "Compact<u32>",
      },
      vote: {
        refIndex: "Compact<u32>",
        vote: "PalletDemocracyVoteAccountVote",
      },
      emergency_cancel: {
        refIndex: "u32",
      },
      external_propose: {
        proposalHash: "H256",
      },
      external_propose_majority: {
        proposalHash: "H256",
      },
      external_propose_default: {
        proposalHash: "H256",
      },
      fast_track: {
        proposalHash: "H256",
        votingPeriod: "u32",
        delay: "u32",
      },
      veto_external: {
        proposalHash: "H256",
      },
      cancel_referendum: {
        refIndex: "Compact<u32>",
      },
      cancel_queued: {
        which: "u32",
      },
      delegate: {
        to: "AccountId32",
        conviction: "PalletDemocracyConviction",
        balance: "u128",
      },
      undelegate: "Null",
      clear_public_proposals: "Null",
      note_preimage: {
        encodedProposal: "Bytes",
      },
      note_preimage_operational: {
        encodedProposal: "Bytes",
      },
      note_imminent_preimage: {
        encodedProposal: "Bytes",
      },
      note_imminent_preimage_operational: {
        encodedProposal: "Bytes",
      },
      reap_preimage: {
        proposalHash: "H256",
        proposalLenUpperBound: "Compact<u32>",
      },
      unlock: {
        target: "AccountId32",
      },
      remove_vote: {
        index: "u32",
      },
      remove_other_vote: {
        target: "AccountId32",
        index: "u32",
      },
      enact_proposal: {
        proposalHash: "H256",
        index: "u32",
      },
      blacklist: {
        proposalHash: "H256",
        maybeRefIndex: "Option<u32>",
      },
      cancel_proposal: {
        propIndex: "Compact<u32>",
      },
    },
  },
  /**
   * Lookup197: pallet_democracy::pallet::Error<T>
   */
  PalletDemocracyError: {
    _enum: [
      "ValueLow",
      "ProposalMissing",
      "AlreadyCanceled",
      "DuplicateProposal",
      "ProposalBlacklisted",
      "NotSimpleMajority",
      "InvalidHash",
      "NoProposal",
      "AlreadyVetoed",
      "DuplicatePreimage",
      "NotImminent",
      "TooEarly",
      "Imminent",
      "PreimageMissing",
      "ReferendumInvalid",
      "PreimageInvalid",
      "NoneWaiting",
      "NotVoter",
      "NoPermission",
      "AlreadyDelegating",
      "InsufficientFunds",
      "NotDelegating",
      "VotesExist",
      "InstantNotAllowed",
      "Nonsense",
      "WrongUpperBound",
      "MaxVotesReached",
      "TooManyProposals",
    ],
  },
  /**
   * Lookup200: pallet_collective::pallet::Call<T, I>
   */
  PalletCollectiveCall: {
    _enum: {
      set_members: {
        newMembers: "Vec<AccountId32>",
        prime: "Option<AccountId32>",
        oldCount: "u32",
      },
      execute: {
        proposal: "Call",
        lengthBound: "Compact<u32>",
      },
      propose: {
        threshold: "Compact<u32>",
        proposal: "Call",
        lengthBound: "Compact<u32>",
      },
      vote: {
        proposal: "H256",
        index: "Compact<u32>",
        approve: "bool",
      },
      close: {
        proposalHash: "H256",
        index: "Compact<u32>",
        proposalWeightBound: "Compact<u64>",
        lengthBound: "Compact<u32>",
      },
      disapprove_proposal: {
        proposalHash: "H256",
      },
    },
  },
  /**
   * Lookup201: pallet_membership::pallet::Call<T, I>
   */
  PalletMembershipCall: {
    _enum: {
      add_member: {
        who: "AccountId32",
      },
      remove_member: {
        who: "AccountId32",
      },
      swap_member: {
        remove: "AccountId32",
        add: "AccountId32",
      },
      reset_members: {
        members: "Vec<AccountId32>",
      },
      change_key: {
        _alias: {
          new_: "new",
        },
        new_: "AccountId32",
      },
      set_prime: {
        who: "AccountId32",
      },
      clear_prime: "Null",
    },
  },
  /**
   * Lookup204: pallet_authorship::pallet::Call<T>
   */
  PalletAuthorshipCall: {
    _enum: {
      set_uncles: {
        newUncles: "Vec<SpRuntimeHeader>",
      },
    },
  },
  /**
   * Lookup206: sp_runtime::generic::header::Header<Number,
   * sp_runtime::traits::BlakeTwo256>
   */
  SpRuntimeHeader: {
    parentHash: "H256",
    number: "Compact<u32>",
    stateRoot: "H256",
    extrinsicsRoot: "H256",
    digest: "SpRuntimeDigest",
  },
  /**
   * Lookup207: sp_runtime::traits::BlakeTwo256
   */
  SpRuntimeBlakeTwo256: "Null",
  /**
   * Lookup208: manta_collator_selection::pallet::Call<T>
   */
  MantaCollatorSelectionCall: {
    _enum: {
      set_invulnerables: {
        _alias: {
          new_: "new",
        },
        new_: "Vec<AccountId32>",
      },
      set_desired_candidates: {
        max: "u32",
      },
      set_candidacy_bond: {
        bond: "u128",
      },
      register_as_candidate: "Null",
      register_candidate: {
        newCandidate: "AccountId32",
      },
      leave_intent: "Null",
      remove_collator: {
        collator: "AccountId32",
      },
    },
  },
  /**
   * Lookup209: pallet_session::pallet::Call<T>
   */
  PalletSessionCall: {
    _enum: {
      set_keys: {
        _alias: {
          keys_: "keys",
        },
        keys_: "DolphinRuntimeOpaqueSessionKeys",
        proof: "Bytes",
      },
      purge_keys: "Null",
    },
  },
  /**
   * Lookup210: dolphin_runtime::opaque::SessionKeys
   */
  DolphinRuntimeOpaqueSessionKeys: {
    aura: "SpConsensusAuraSr25519AppSr25519Public",
  },
  /**
   * Lookup211: sp_consensus_aura::sr25519::app_sr25519::Public
   */
  SpConsensusAuraSr25519AppSr25519Public: "SpCoreSr25519Public",
  /**
   * Lookup212: sp_core::sr25519::Public
   */
  SpCoreSr25519Public: "[u8;32]",
  /**
   * Lookup213: pallet_treasury::pallet::Call<T, I>
   */
  PalletTreasuryCall: {
    _enum: {
      propose_spend: {
        value: "Compact<u128>",
        beneficiary: "MultiAddress",
      },
      reject_proposal: {
        proposalId: "Compact<u32>",
      },
      approve_proposal: {
        proposalId: "Compact<u32>",
      },
    },
  },
  /**
   * Lookup214: pallet_preimage::pallet::Call<T>
   */
  PalletPreimageCall: {
    _enum: {
      note_preimage: {
        bytes: "Bytes",
      },
      unnote_preimage: {
        _alias: {
          hash_: "hash",
        },
        hash_: "H256",
      },
      request_preimage: {
        _alias: {
          hash_: "hash",
        },
        hash_: "H256",
      },
      unrequest_preimage: {
        _alias: {
          hash_: "hash",
        },
        hash_: "H256",
      },
    },
  },
  /**
   * Lookup215: pallet_scheduler::pallet::Call<T>
   */
  PalletSchedulerCall: {
    _enum: {
      schedule: {
        when: "u32",
        maybePeriodic: "Option<(u32,u32)>",
        priority: "u8",
        call: "FrameSupportScheduleMaybeHashed",
      },
      cancel: {
        when: "u32",
        index: "u32",
      },
      schedule_named: {
        id: "Bytes",
        when: "u32",
        maybePeriodic: "Option<(u32,u32)>",
        priority: "u8",
        call: "FrameSupportScheduleMaybeHashed",
      },
      cancel_named: {
        id: "Bytes",
      },
      schedule_after: {
        after: "u32",
        maybePeriodic: "Option<(u32,u32)>",
        priority: "u8",
        call: "FrameSupportScheduleMaybeHashed",
      },
      schedule_named_after: {
        id: "Bytes",
        after: "u32",
        maybePeriodic: "Option<(u32,u32)>",
        priority: "u8",
        call: "FrameSupportScheduleMaybeHashed",
      },
    },
  },
  /**
   * Lookup217:
   * frame_support::traits::schedule::MaybeHashed<dolphin_runtime::Call,
   * primitive_types::H256>
   */
  FrameSupportScheduleMaybeHashed: {
    _enum: {
      Value: "Call",
      Hash: "H256",
    },
  },
  /**
   * Lookup218: cumulus_pallet_xcmp_queue::pallet::Call<T>
   */
  CumulusPalletXcmpQueueCall: {
    _enum: {
      service_overweight: {
        index: "u64",
        weightLimit: "u64",
      },
    },
  },
  /**
   * Lookup219: pallet_xcm::pallet::Call<T>
   */
  PalletXcmCall: {
    _enum: {
      send: {
        dest: "XcmVersionedMultiLocation",
        message: "XcmVersionedXcm",
      },
      teleport_assets: {
        dest: "XcmVersionedMultiLocation",
        beneficiary: "XcmVersionedMultiLocation",
        assets: "XcmVersionedMultiAssets",
        feeAssetItem: "u32",
      },
      reserve_transfer_assets: {
        dest: "XcmVersionedMultiLocation",
        beneficiary: "XcmVersionedMultiLocation",
        assets: "XcmVersionedMultiAssets",
        feeAssetItem: "u32",
      },
      execute: {
        message: "XcmVersionedXcm",
        maxWeight: "u64",
      },
      force_xcm_version: {
        location: "XcmV1MultiLocation",
        xcmVersion: "u32",
      },
      force_default_xcm_version: {
        maybeXcmVersion: "Option<u32>",
      },
      force_subscribe_version_notify: {
        location: "XcmVersionedMultiLocation",
      },
      force_unsubscribe_version_notify: {
        location: "XcmVersionedMultiLocation",
      },
      limited_reserve_transfer_assets: {
        dest: "XcmVersionedMultiLocation",
        beneficiary: "XcmVersionedMultiLocation",
        assets: "XcmVersionedMultiAssets",
        feeAssetItem: "u32",
        weightLimit: "XcmV2WeightLimit",
      },
      limited_teleport_assets: {
        dest: "XcmVersionedMultiLocation",
        beneficiary: "XcmVersionedMultiLocation",
        assets: "XcmVersionedMultiAssets",
        feeAssetItem: "u32",
        weightLimit: "XcmV2WeightLimit",
      },
    },
  },
  /**
   * Lookup220: xcm::VersionedXcm<Call>
   */
  XcmVersionedXcm: {
    _enum: {
      V0: "XcmV0Xcm",
      V1: "XcmV1Xcm",
      V2: "XcmV2Xcm",
    },
  },
  /**
   * Lookup221: xcm::v0::Xcm<Call>
   */
  XcmV0Xcm: {
    _enum: {
      WithdrawAsset: {
        assets: "Vec<XcmV0MultiAsset>",
        effects: "Vec<XcmV0Order>",
      },
      ReserveAssetDeposit: {
        assets: "Vec<XcmV0MultiAsset>",
        effects: "Vec<XcmV0Order>",
      },
      TeleportAsset: {
        assets: "Vec<XcmV0MultiAsset>",
        effects: "Vec<XcmV0Order>",
      },
      QueryResponse: {
        queryId: "Compact<u64>",
        response: "XcmV0Response",
      },
      TransferAsset: {
        assets: "Vec<XcmV0MultiAsset>",
        dest: "XcmV0MultiLocation",
      },
      TransferReserveAsset: {
        assets: "Vec<XcmV0MultiAsset>",
        dest: "XcmV0MultiLocation",
        effects: "Vec<XcmV0Order>",
      },
      Transact: {
        originType: "XcmV0OriginKind",
        requireWeightAtMost: "u64",
        call: "XcmDoubleEncoded",
      },
      HrmpNewChannelOpenRequest: {
        sender: "Compact<u32>",
        maxMessageSize: "Compact<u32>",
        maxCapacity: "Compact<u32>",
      },
      HrmpChannelAccepted: {
        recipient: "Compact<u32>",
      },
      HrmpChannelClosing: {
        initiator: "Compact<u32>",
        sender: "Compact<u32>",
        recipient: "Compact<u32>",
      },
      RelayedFrom: {
        who: "XcmV0MultiLocation",
        message: "XcmV0Xcm",
      },
    },
  },
  /**
   * Lookup223: xcm::v0::order::Order<Call>
   */
  XcmV0Order: {
    _enum: {
      Null: "Null",
      DepositAsset: {
        assets: "Vec<XcmV0MultiAsset>",
        dest: "XcmV0MultiLocation",
      },
      DepositReserveAsset: {
        assets: "Vec<XcmV0MultiAsset>",
        dest: "XcmV0MultiLocation",
        effects: "Vec<XcmV0Order>",
      },
      ExchangeAsset: {
        give: "Vec<XcmV0MultiAsset>",
        receive: "Vec<XcmV0MultiAsset>",
      },
      InitiateReserveWithdraw: {
        assets: "Vec<XcmV0MultiAsset>",
        reserve: "XcmV0MultiLocation",
        effects: "Vec<XcmV0Order>",
      },
      InitiateTeleport: {
        assets: "Vec<XcmV0MultiAsset>",
        dest: "XcmV0MultiLocation",
        effects: "Vec<XcmV0Order>",
      },
      QueryHolding: {
        queryId: "Compact<u64>",
        dest: "XcmV0MultiLocation",
        assets: "Vec<XcmV0MultiAsset>",
      },
      BuyExecution: {
        fees: "XcmV0MultiAsset",
        weight: "u64",
        debt: "u64",
        haltOnError: "bool",
        xcm: "Vec<XcmV0Xcm>",
      },
    },
  },
  /**
   * Lookup225: xcm::v0::Response
   */
  XcmV0Response: {
    _enum: {
      Assets: "Vec<XcmV0MultiAsset>",
    },
  },
  /**
   * Lookup226: xcm::v1::Xcm<Call>
   */
  XcmV1Xcm: {
    _enum: {
      WithdrawAsset: {
        assets: "XcmV1MultiassetMultiAssets",
        effects: "Vec<XcmV1Order>",
      },
      ReserveAssetDeposited: {
        assets: "XcmV1MultiassetMultiAssets",
        effects: "Vec<XcmV1Order>",
      },
      ReceiveTeleportedAsset: {
        assets: "XcmV1MultiassetMultiAssets",
        effects: "Vec<XcmV1Order>",
      },
      QueryResponse: {
        queryId: "Compact<u64>",
        response: "XcmV1Response",
      },
      TransferAsset: {
        assets: "XcmV1MultiassetMultiAssets",
        beneficiary: "XcmV1MultiLocation",
      },
      TransferReserveAsset: {
        assets: "XcmV1MultiassetMultiAssets",
        dest: "XcmV1MultiLocation",
        effects: "Vec<XcmV1Order>",
      },
      Transact: {
        originType: "XcmV0OriginKind",
        requireWeightAtMost: "u64",
        call: "XcmDoubleEncoded",
      },
      HrmpNewChannelOpenRequest: {
        sender: "Compact<u32>",
        maxMessageSize: "Compact<u32>",
        maxCapacity: "Compact<u32>",
      },
      HrmpChannelAccepted: {
        recipient: "Compact<u32>",
      },
      HrmpChannelClosing: {
        initiator: "Compact<u32>",
        sender: "Compact<u32>",
        recipient: "Compact<u32>",
      },
      RelayedFrom: {
        who: "XcmV1MultilocationJunctions",
        message: "XcmV1Xcm",
      },
      SubscribeVersion: {
        queryId: "Compact<u64>",
        maxResponseWeight: "Compact<u64>",
      },
      UnsubscribeVersion: "Null",
    },
  },
  /**
   * Lookup228: xcm::v1::order::Order<Call>
   */
  XcmV1Order: {
    _enum: {
      Noop: "Null",
      DepositAsset: {
        assets: "XcmV1MultiassetMultiAssetFilter",
        maxAssets: "u32",
        beneficiary: "XcmV1MultiLocation",
      },
      DepositReserveAsset: {
        assets: "XcmV1MultiassetMultiAssetFilter",
        maxAssets: "u32",
        dest: "XcmV1MultiLocation",
        effects: "Vec<XcmV1Order>",
      },
      ExchangeAsset: {
        give: "XcmV1MultiassetMultiAssetFilter",
        receive: "XcmV1MultiassetMultiAssets",
      },
      InitiateReserveWithdraw: {
        assets: "XcmV1MultiassetMultiAssetFilter",
        reserve: "XcmV1MultiLocation",
        effects: "Vec<XcmV1Order>",
      },
      InitiateTeleport: {
        assets: "XcmV1MultiassetMultiAssetFilter",
        dest: "XcmV1MultiLocation",
        effects: "Vec<XcmV1Order>",
      },
      QueryHolding: {
        queryId: "Compact<u64>",
        dest: "XcmV1MultiLocation",
        assets: "XcmV1MultiassetMultiAssetFilter",
      },
      BuyExecution: {
        fees: "XcmV1MultiAsset",
        weight: "u64",
        debt: "u64",
        haltOnError: "bool",
        instructions: "Vec<XcmV1Xcm>",
      },
    },
  },
  /**
   * Lookup230: xcm::v1::Response
   */
  XcmV1Response: {
    _enum: {
      Assets: "XcmV1MultiassetMultiAssets",
      Version: "u32",
    },
  },
  /**
   * Lookup244: cumulus_pallet_dmp_queue::pallet::Call<T>
   */
  CumulusPalletDmpQueueCall: {
    _enum: {
      service_overweight: {
        index: "u64",
        weightLimit: "u64",
      },
    },
  },
  /**
   * Lookup245: orml_xtokens::module::Call<T>
   */
  OrmlXtokensModuleCall: {
    _enum: {
      transfer: {
        currencyId: "DolphinRuntimeCurrencyId",
        amount: "u128",
        dest: "XcmVersionedMultiLocation",
        destWeight: "u64",
      },
      transfer_multiasset: {
        asset: "XcmVersionedMultiAsset",
        dest: "XcmVersionedMultiLocation",
        destWeight: "u64",
      },
      transfer_with_fee: {
        currencyId: "DolphinRuntimeCurrencyId",
        amount: "u128",
        fee: "u128",
        dest: "XcmVersionedMultiLocation",
        destWeight: "u64",
      },
      transfer_multiasset_with_fee: {
        asset: "XcmVersionedMultiAsset",
        fee: "XcmVersionedMultiAsset",
        dest: "XcmVersionedMultiLocation",
        destWeight: "u64",
      },
      transfer_multicurrencies: {
        currencies: "Vec<(DolphinRuntimeCurrencyId,u128)>",
        feeItem: "u32",
        dest: "XcmVersionedMultiLocation",
        destWeight: "u64",
      },
      transfer_multiassets: {
        assets: "XcmVersionedMultiAssets",
        feeItem: "u32",
        dest: "XcmVersionedMultiLocation",
        destWeight: "u64",
      },
    },
  },
  /**
   * Lookup246: xcm::VersionedMultiAsset
   */
  XcmVersionedMultiAsset: {
    _enum: {
      V0: "XcmV0MultiAsset",
      V1: "XcmV1MultiAsset",
    },
  },
  /**
   * Lookup247: pallet_utility::pallet::Call<T>
   */
  PalletUtilityCall: {
    _enum: {
      batch: {
        calls: "Vec<Call>",
      },
      as_derivative: {
        index: "u16",
        call: "Call",
      },
      batch_all: {
        calls: "Vec<Call>",
      },
      dispatch_as: {
        asOrigin: "DolphinRuntimeOriginCaller",
        call: "Call",
      },
    },
  },
  /**
   * Lookup249: dolphin_runtime::OriginCaller
   */
  DolphinRuntimeOriginCaller: {
    _enum: {
      system: "FrameSystemRawOrigin",
      __Unused1: "Null",
      __Unused2: "Null",
      __Unused3: "Null",
      __Unused4: "Null",
      Void: "SpCoreVoid",
      __Unused6: "Null",
      __Unused7: "Null",
      __Unused8: "Null",
      __Unused9: "Null",
      __Unused10: "Null",
      __Unused11: "Null",
      __Unused12: "Null",
      __Unused13: "Null",
      __Unused14: "Null",
      Council: "PalletCollectiveRawOrigin",
      __Unused16: "Null",
      TechnicalCommittee: "PalletCollectiveRawOrigin",
      __Unused18: "Null",
      __Unused19: "Null",
      __Unused20: "Null",
      __Unused21: "Null",
      __Unused22: "Null",
      __Unused23: "Null",
      __Unused24: "Null",
      __Unused25: "Null",
      __Unused26: "Null",
      __Unused27: "Null",
      __Unused28: "Null",
      __Unused29: "Null",
      __Unused30: "Null",
      PolkadotXcm: "PalletXcmOrigin",
      CumulusXcm: "CumulusPalletXcmOrigin",
    },
  },
  /**
   * Lookup250: frame_system::RawOrigin<sp_core::crypto::AccountId32>
   */
  FrameSystemRawOrigin: {
    _enum: {
      Root: "Null",
      Signed: "AccountId32",
      None: "Null",
    },
  },
  /**
   * Lookup251: pallet_collective::RawOrigin<sp_core::crypto::AccountId32, I>
   */
  PalletCollectiveRawOrigin: {
    _enum: {
      Members: "(u32,u32)",
      Member: "AccountId32",
      _Phantom: "Null",
    },
  },
  /**
   * Lookup253: pallet_xcm::pallet::Origin
   */
  PalletXcmOrigin: {
    _enum: {
      Xcm: "XcmV1MultiLocation",
      Response: "XcmV1MultiLocation",
    },
  },
  /**
   * Lookup254: cumulus_pallet_xcm::pallet::Origin
   */
  CumulusPalletXcmOrigin: {
    _enum: {
      Relay: "Null",
      SiblingParachain: "u32",
    },
  },
  /**
   * Lookup255: sp_core::Void
   */
  SpCoreVoid: "Null",
  /**
   * Lookup256: pallet_multisig::pallet::Call<T>
   */
  PalletMultisigCall: {
    _enum: {
      as_multi_threshold_1: {
        otherSignatories: "Vec<AccountId32>",
        call: "Call",
      },
      as_multi: {
        threshold: "u16",
        otherSignatories: "Vec<AccountId32>",
        maybeTimepoint: "Option<PalletMultisigTimepoint>",
        call: "WrapperKeepOpaque<Call>",
        storeCall: "bool",
        maxWeight: "u64",
      },
      approve_as_multi: {
        threshold: "u16",
        otherSignatories: "Vec<AccountId32>",
        maybeTimepoint: "Option<PalletMultisigTimepoint>",
        callHash: "[u8;32]",
        maxWeight: "u64",
      },
      cancel_as_multi: {
        threshold: "u16",
        otherSignatories: "Vec<AccountId32>",
        timepoint: "PalletMultisigTimepoint",
        callHash: "[u8;32]",
      },
    },
  },
  /**
   * Lookup259: pallet_sudo::pallet::Call<T>
   */
  PalletSudoCall: {
    _enum: {
      sudo: {
        call: "Call",
      },
      sudo_unchecked_weight: {
        call: "Call",
        weight: "u64",
      },
      set_key: {
        _alias: {
          new_: "new",
        },
        new_: "MultiAddress",
      },
      sudo_as: {
        who: "MultiAddress",
        call: "Call",
      },
    },
  },
  /**
   * Lookup260: pallet_asset_manager::pallet::Call<T>
   */
  PalletAssetManagerCall: {
    _enum: {
      register_asset: {
        location: "MantaPrimitivesAssetsAssetLocation",
        metadata: "MantaPrimitivesAssetsAssetRegistarMetadata",
      },
      update_asset_location: {
        assetId: "Compact<u32>",
        location: "MantaPrimitivesAssetsAssetLocation",
      },
      update_asset_metadata: {
        assetId: "Compact<u32>",
        metadata: "MantaPrimitivesAssetsAssetRegistarMetadata",
      },
      set_units_per_second: {
        assetId: "Compact<u32>",
        unitsPerSecond: "Compact<u128>",
      },
    },
  },
  /**
   * Lookup261: pallet_manta_pay::pallet::Call<T>
   */
  PalletMantaPayCall: {
    _enum: {
      mint: {
        post: "PalletMantaPayTransferPost",
      },
      private_transfer: {
        post: "PalletMantaPayTransferPost",
      },
      reclaim: {
        post: "PalletMantaPayTransferPost",
      },
    },
  },
  /**
   * Lookup262: pallet_manta_pay::types::TransferPost
   */
  PalletMantaPayTransferPost: {
    assetId: "Option<u32>",
    sources: "Vec<u128>",
    senderPosts: "Vec<PalletMantaPaySenderPost>",
    receiverPosts: "Vec<PalletMantaPayReceiverPost>",
    sinks: "Vec<u128>",
    validityProof: "Bytes",
  },
  /**
   * Lookup265: pallet_manta_pay::types::SenderPost
   */
  PalletMantaPaySenderPost: {
    utxoAccumulatorOutput: "Bytes",
    voidNumber: "Bytes",
  },
  /**
   * Lookup267: pallet_manta_pay::types::ReceiverPost
   */
  PalletMantaPayReceiverPost: {
    utxo: "Bytes",
    note: "PalletMantaPayEncryptedNote",
  },
  /**
   * Lookup268: pallet_manta_pay::types::EncryptedNote
   */
  PalletMantaPayEncryptedNote: {
    ciphertext: "[u8;36]",
    ephemeralPublicKey: "Bytes",
  },
  /**
   * Lookup270: pallet_collective::Votes<sp_core::crypto::AccountId32, BlockNumber>
   */
  PalletCollectiveVotes: {
    index: "u32",
    threshold: "u32",
    ayes: "Vec<AccountId32>",
    nays: "Vec<AccountId32>",
    end: "u32",
  },
  /**
   * Lookup271: pallet_collective::pallet::Error<T, I>
   */
  PalletCollectiveError: {
    _enum: [
      "NotMember",
      "DuplicateProposal",
      "ProposalMissing",
      "WrongIndex",
      "DuplicateVote",
      "AlreadyInitialized",
      "TooEarly",
      "TooManyProposals",
      "WrongProposalWeight",
      "WrongProposalLength",
    ],
  },
  /**
   * Lookup272: pallet_membership::pallet::Error<T, I>
   */
  PalletMembershipError: {
    _enum: ["AlreadyMember", "NotMember"],
  },
  /**
   * Lookup276: pallet_authorship::UncleEntryItem<BlockNumber,
   * primitive_types::H256, sp_core::crypto::AccountId32>
   */
  PalletAuthorshipUncleEntryItem: {
    _enum: {
      InclusionHeight: "u32",
      Uncle: "(H256,Option<AccountId32>)",
    },
  },
  /**
   * Lookup277: pallet_authorship::pallet::Error<T>
   */
  PalletAuthorshipError: {
    _enum: [
      "InvalidUncleParent",
      "UnclesAlreadySet",
      "TooManyUncles",
      "GenesisUncle",
      "TooHighUncle",
      "UncleAlreadyIncluded",
      "OldUncle",
    ],
  },
  /**
   * Lookup279:
   * manta_collator_selection::pallet::CandidateInfo<sp_core::crypto::AccountId32,
   * Balance>
   */
  MantaCollatorSelectionCandidateInfo: {
    who: "AccountId32",
    deposit: "u128",
  },
  /**
   * Lookup280: manta_collator_selection::pallet::Error<T>
   */
  MantaCollatorSelectionError: {
    _enum: [
      "TooManyCandidates",
      "Unknown",
      "Permission",
      "AlreadyCandidate",
      "NotCandidate",
      "AlreadyInvulnerable",
      "NoAssociatedValidatorId",
      "ValidatorNotRegistered",
      "NotAllowRemoveInvulnerable",
    ],
  },
  /**
   * Lookup285: sp_core::crypto::KeyTypeId
   */
  SpCoreCryptoKeyTypeId: "[u8;4]",
  /**
   * Lookup286: pallet_session::pallet::Error<T>
   */
  PalletSessionError: {
    _enum: [
      "InvalidProof",
      "NoAssociatedValidatorId",
      "DuplicatedKey",
      "NoKeys",
      "NoAccount",
    ],
  },
  /**
   * Lookup290: pallet_treasury::Proposal<sp_core::crypto::AccountId32, Balance>
   */
  PalletTreasuryProposal: {
    proposer: "AccountId32",
    value: "u128",
    beneficiary: "AccountId32",
    bond: "u128",
  },
  /**
   * Lookup294: frame_support::PalletId
   */
  FrameSupportPalletId: "[u8;8]",
  /**
   * Lookup295: pallet_treasury::pallet::Error<T, I>
   */
  PalletTreasuryError: {
    _enum: ["InsufficientProposersBalance", "InvalidIndex", "TooManyApprovals"],
  },
  /**
   * Lookup296: pallet_preimage::RequestStatus<sp_core::crypto::AccountId32, Balance>
   */
  PalletPreimageRequestStatus: {
    _enum: {
      Unrequested: "Option<(AccountId32,u128)>",
      Requested: "u32",
    },
  },
  /**
   * Lookup300: pallet_preimage::pallet::Error<T>
   */
  PalletPreimageError: {
    _enum: [
      "TooLarge",
      "AlreadyNoted",
      "NotAuthorized",
      "NotNoted",
      "Requested",
      "NotRequested",
    ],
  },
  /**
   * Lookup303:
   * pallet_scheduler::ScheduledV3<frame_support::traits::schedule::MaybeHashed<dolphin_runtime::Call,
   * primitive_types::H256>, BlockNumber, dolphin_runtime::OriginCaller,
   * sp_core::crypto::AccountId32>
   */
  PalletSchedulerScheduledV3: {
    maybeId: "Option<Bytes>",
    priority: "u8",
    call: "FrameSupportScheduleMaybeHashed",
    maybePeriodic: "Option<(u32,u32)>",
    origin: "DolphinRuntimeOriginCaller",
  },
  /**
   * Lookup304: pallet_scheduler::pallet::Error<T>
   */
  PalletSchedulerError: {
    _enum: [
      "FailedToSchedule",
      "NotFound",
      "TargetBlockNumberInPast",
      "RescheduleNoChange",
    ],
  },
  /**
   * Lookup306: cumulus_pallet_xcmp_queue::InboundChannelDetails
   */
  CumulusPalletXcmpQueueInboundChannelDetails: {
    sender: "u32",
    state: "CumulusPalletXcmpQueueInboundState",
    messageMetadata: "Vec<(u32,PolkadotParachainPrimitivesXcmpMessageFormat)>",
  },
  /**
   * Lookup307: cumulus_pallet_xcmp_queue::InboundState
   */
  CumulusPalletXcmpQueueInboundState: {
    _enum: ["Ok", "Suspended"],
  },
  /**
   * Lookup310: polkadot_parachain::primitives::XcmpMessageFormat
   */
  PolkadotParachainPrimitivesXcmpMessageFormat: {
    _enum: ["ConcatenatedVersionedXcm", "ConcatenatedEncodedBlob", "Signals"],
  },
  /**
   * Lookup313: cumulus_pallet_xcmp_queue::OutboundChannelDetails
   */
  CumulusPalletXcmpQueueOutboundChannelDetails: {
    recipient: "u32",
    state: "CumulusPalletXcmpQueueOutboundState",
    signalsExist: "bool",
    firstIndex: "u16",
    lastIndex: "u16",
  },
  /**
   * Lookup314: cumulus_pallet_xcmp_queue::OutboundState
   */
  CumulusPalletXcmpQueueOutboundState: {
    _enum: ["Ok", "Suspended"],
  },
  /**
   * Lookup316: cumulus_pallet_xcmp_queue::QueueConfigData
   */
  CumulusPalletXcmpQueueQueueConfigData: {
    suspendThreshold: "u32",
    dropThreshold: "u32",
    resumeThreshold: "u32",
    thresholdWeight: "u64",
    weightRestrictDecay: "u64",
    xcmpMaxIndividualWeight: "u64",
  },
  /**
   * Lookup318: cumulus_pallet_xcmp_queue::pallet::Error<T>
   */
  CumulusPalletXcmpQueueError: {
    _enum: [
      "FailedToSend",
      "BadXcmOrigin",
      "BadXcm",
      "BadOverweightIndex",
      "WeightOverLimit",
    ],
  },
  /**
   * Lookup319: pallet_xcm::pallet::QueryStatus<BlockNumber>
   */
  PalletXcmQueryStatus: {
    _enum: {
      Pending: {
        responder: "XcmVersionedMultiLocation",
        maybeNotify: "Option<(u8,u8)>",
        timeout: "u32",
      },
      VersionNotifier: {
        origin: "XcmVersionedMultiLocation",
        isActive: "bool",
      },
      Ready: {
        response: "XcmVersionedResponse",
        at: "u32",
      },
    },
  },
  /**
   * Lookup322: xcm::VersionedResponse
   */
  XcmVersionedResponse: {
    _enum: {
      V0: "XcmV0Response",
      V1: "XcmV1Response",
      V2: "XcmV2Response",
    },
  },
  /**
   * Lookup328: pallet_xcm::pallet::VersionMigrationStage
   */
  PalletXcmVersionMigrationStage: {
    _enum: {
      MigrateSupportedVersion: "Null",
      MigrateVersionNotifiers: "Null",
      NotifyCurrentTargets: "Option<Bytes>",
      MigrateAndNotifyOldTargets: "Null",
    },
  },
  /**
   * Lookup329: pallet_xcm::pallet::Error<T>
   */
  PalletXcmError: {
    _enum: [
      "Unreachable",
      "SendFailure",
      "Filtered",
      "UnweighableMessage",
      "DestinationNotInvertible",
      "Empty",
      "CannotReanchor",
      "TooManyAssets",
      "InvalidOrigin",
      "BadVersion",
      "BadLocation",
      "NoSubscription",
      "AlreadySubscribed",
    ],
  },
  /**
   * Lookup330: cumulus_pallet_xcm::pallet::Error<T>
   */
  CumulusPalletXcmError: "Null",
  /**
   * Lookup331: cumulus_pallet_dmp_queue::ConfigData
   */
  CumulusPalletDmpQueueConfigData: {
    maxIndividual: "u64",
  },
  /**
   * Lookup332: cumulus_pallet_dmp_queue::PageIndexData
   */
  CumulusPalletDmpQueuePageIndexData: {
    beginUsed: "u32",
    endUsed: "u32",
    overweightCount: "u64",
  },
  /**
   * Lookup335: cumulus_pallet_dmp_queue::pallet::Error<T>
   */
  CumulusPalletDmpQueueError: {
    _enum: ["Unknown", "OverLimit"],
  },
  /**
   * Lookup336: orml_xtokens::module::Error<T>
   */
  OrmlXtokensModuleError: {
    _enum: [
      "AssetHasNoReserve",
      "NotCrossChainTransfer",
      "InvalidDest",
      "NotCrossChainTransferableCurrency",
      "UnweighableMessage",
      "XcmExecutionFailed",
      "CannotReanchor",
      "InvalidAncestry",
      "NotFungible",
      "DestinationNotInvertible",
      "BadVersion",
      "DistinctReserveForAssetAndFee",
      "FeeCannotBeZero",
      "TooManyAssetsBeingSent",
      "AssetIndexNonExistent",
    ],
  },
  /**
   * Lookup337: pallet_utility::pallet::Error<T>
   */
  PalletUtilityError: {
    _enum: ["TooManyCalls"],
  },
  /**
   * Lookup339: pallet_multisig::Multisig<BlockNumber, Balance,
   * sp_core::crypto::AccountId32>
   */
  PalletMultisigMultisig: {
    when: "PalletMultisigTimepoint",
    deposit: "u128",
    depositor: "AccountId32",
    approvals: "Vec<AccountId32>",
  },
  /**
   * Lookup341: pallet_multisig::pallet::Error<T>
   */
  PalletMultisigError: {
    _enum: [
      "MinimumThreshold",
      "AlreadyApproved",
      "NoApprovalsNeeded",
      "TooFewSignatories",
      "TooManySignatories",
      "SignatoriesOutOfOrder",
      "SenderInSignatories",
      "NotFound",
      "NotOwner",
      "NoTimepoint",
      "WrongTimepoint",
      "UnexpectedTimepoint",
      "MaxWeightTooLow",
      "AlreadyStored",
    ],
  },
  /**
   * Lookup342: pallet_sudo::pallet::Error<T>
   */
  PalletSudoError: {
    _enum: ["RequireSudo"],
  },
  /**
   * Lookup343: pallet_assets::types::AssetDetails<Balance,
   * sp_core::crypto::AccountId32, DepositBalance>
   */
  PalletAssetsAssetDetails: {
    owner: "AccountId32",
    issuer: "AccountId32",
    admin: "AccountId32",
    freezer: "AccountId32",
    supply: "u128",
    deposit: "u128",
    minBalance: "u128",
    isSufficient: "bool",
    accounts: "u32",
    sufficients: "u32",
    approvals: "u32",
    isFrozen: "bool",
  },
  /**
   * Lookup345: pallet_assets::types::AssetAccount<Balance, DepositBalance, Extra>
   */
  PalletAssetsAssetAccount: {
    balance: "u128",
    isFrozen: "bool",
    reason: "PalletAssetsExistenceReason",
    extra: "Null",
  },
  /**
   * Lookup346: pallet_assets::types::ExistenceReason<Balance>
   */
  PalletAssetsExistenceReason: {
    _enum: {
      Consumer: "Null",
      Sufficient: "Null",
      DepositHeld: "u128",
      DepositRefunded: "Null",
    },
  },
  /**
   * Lookup348: pallet_assets::types::Approval<Balance, DepositBalance>
   */
  PalletAssetsApproval: {
    amount: "u128",
    deposit: "u128",
  },
  /**
   * Lookup349: pallet_assets::types::AssetMetadata<DepositBalance,
   * frame_support::storage::bounded_vec::BoundedVec<T, S>>
   */
  PalletAssetsAssetMetadata: {
    deposit: "u128",
    name: "Bytes",
    symbol: "Bytes",
    decimals: "u8",
    isFrozen: "bool",
  },
  /**
   * Lookup351: pallet_assets::pallet::Error<T, I>
   */
  PalletAssetsError: {
    _enum: [
      "BalanceLow",
      "NoAccount",
      "NoPermission",
      "Unknown",
      "Frozen",
      "InUse",
      "BadWitness",
      "MinBalanceZero",
      "NoProvider",
      "BadMetadata",
      "Unapproved",
      "WouldDie",
      "AlreadyExists",
      "NoDeposit",
      "WouldBurn",
    ],
  },
  /**
   * Lookup352: pallet_asset_manager::pallet::Error<T>
   */
  PalletAssetManagerError: {
    _enum: [
      "LocationAlreadyExists",
      "ErrorCreatingAsset",
      "UpdateNonExistAsset",
      "AssetAlreadyRegistered",
    ],
  },
  /**
   * Lookup355: pallet_manta_pay::types::UtxoMerkleTreePath
   */
  PalletMantaPayUtxoMerkleTreePath: {
    leafDigest: "Option<Bytes>",
    currentPath: "PalletMantaPayCurrentPath",
  },
  /**
   * Lookup357: pallet_manta_pay::types::CurrentPath
   */
  PalletMantaPayCurrentPath: {
    siblingDigest: "Bytes",
    leafIndex: "u32",
    innerPath: "Vec<Bytes>",
  },
  /**
   * Lookup359: pallet_manta_pay::pallet::Error<T>
   */
  PalletMantaPayError: {
    _enum: [
      "UninitializedSupply",
      "ZeroTransfer",
      "BalanceLow",
      "InvalidShape",
      "AssetSpent",
      "InvalidUtxoAccumulatorOutput",
      "AssetRegistered",
      "DuplicateSpend",
      "DuplicateRegister",
      "InvalidProof",
      "LedgerUpdateError",
      "InvalidSourceAccount",
      "InvalidSinkAccount",
    ],
  },
  /**
   * Lookup361: sp_runtime::MultiSignature
   */
  SpRuntimeMultiSignature: {
    _enum: {
      Ed25519: "SpCoreEd25519Signature",
      Sr25519: "SpCoreSr25519Signature",
      Ecdsa: "SpCoreEcdsaSignature",
    },
  },
  /**
   * Lookup362: sp_core::ed25519::Signature
   */
  SpCoreEd25519Signature: "[u8;64]",
  /**
   * Lookup364: sp_core::sr25519::Signature
   */
  SpCoreSr25519Signature: "[u8;64]",
  /**
   * Lookup365: sp_core::ecdsa::Signature
   */
  SpCoreEcdsaSignature: "[u8;65]",
  /**
   * Lookup368: frame_system::extensions::check_spec_version::CheckSpecVersion<T>
   */
  FrameSystemExtensionsCheckSpecVersion: "Null",
  /**
   * Lookup369: frame_system::extensions::check_tx_version::CheckTxVersion<T>
   */
  FrameSystemExtensionsCheckTxVersion: "Null",
  /**
   * Lookup370: frame_system::extensions::check_genesis::CheckGenesis<T>
   */
  FrameSystemExtensionsCheckGenesis: "Null",
  /**
   * Lookup373: frame_system::extensions::check_nonce::CheckNonce<T>
   */
  FrameSystemExtensionsCheckNonce: "Compact<u32>",
  /**
   * Lookup374: frame_system::extensions::check_weight::CheckWeight<T>
   */
  FrameSystemExtensionsCheckWeight: "Null",
  /**
   * Lookup375: pallet_transaction_payment::ChargeTransactionPayment<T>
   */
  PalletTransactionPaymentChargeTransactionPayment: "Compact<u128>",
  /**
   * Lookup376: dolphin_runtime::Runtime
   */
  DolphinRuntimeRuntime: "Null",
};
