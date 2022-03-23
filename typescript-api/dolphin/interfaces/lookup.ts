// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

/* eslint-disable sort-keys */

export default {
  /**
   * Lookup10: pallet_System::pallet::Call
   **/
  PalletSystemCall: {
    _enum: {
      fill_block: 'Null',
      remark: {
        remark: 'Bytes',
      },
      set_heap_pages: {
        pages: 'u64',
      },
      set_code: {
        code: 'Bytes',
      },
      set_code_without_checks: {
        code: 'Bytes',
      },
      set_changes_trie_config: {
        changesTrieConfig: 'Option<ChangesTrieConfiguration>',
      },
      set_storage: {
        items: 'Vec<KeyValue>',
      },
      kill_storage: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Vec<Key>',
      },
      kill_prefix: {
        prefix: 'Key'
      }
    }
  },
  /**
   * Lookup11: pallet_System::pallet::Error
   **/
  PalletSystemError: {
    _enum: ['InvalidSpecName', 'SpecVersionNotAllowedToDecrease', 'ImplVersionNotAllowedToDecrease', 'SpecOrImplVersionNeedToIncrease', 'FailedToExtractRuntimeVersion']
  },
  /**
   * Lookup14: pallet_System::pallet::Event
   **/
  PalletSystemEvent: {
    _enum: {
      ExtrinsicSuccess: 'DispatchInfo',
      ExtrinsicFailed: '(DispatchError,DispatchInfo)',
      CodeUpdated: 'Null'
    }
  },
  /**
   * Lookup30: pallet_Utility::pallet::Call
   **/
  PalletUtilityCall: {
    _enum: {
      batch: {
        calls: 'Vec<Call>',
      },
      as_sub: {
        index: 'u16',
        call: 'Call',
      },
      as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId>',
        maybeTimepoint: 'Option<Timepoint>',
        call: 'Call',
      },
      approve_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId>',
        maybeTimepoint: 'Option<Timepoint>',
        callHash: '[u8;32]',
      },
      cancel_as_multi: {
        threshold: 'u16',
        otherSignatories: 'Vec<AccountId>',
        timepoint: 'Timepoint',
        callHash: '[u8;32]'
      }
    }
  },
  /**
   * Lookup31: pallet_Utility::pallet::Error
   **/
  PalletUtilityError: {
    _enum: ['ZeroThreshold', 'AlreadyApproved', 'NoApprovalsNeeded', 'TooFewSignatories', 'TooManySignatories', 'SignatoriesOutOfOrder', 'SenderInSignatories', 'NotFound', 'NotOwner', 'NoTimepoint', 'WrongTimepoint', 'UnexpectedTimepoint']
  },
  /**
   * Lookup33: pallet_Utility::pallet::Event
   **/
  PalletUtilityEvent: {
    _enum: {
      BatchInterrupted: '(u32,DispatchError)',
      BatchCompleted: 'Null',
      NewMultisig: '(AccountId,AccountId)',
      MultisigApproval: '(AccountId,Timepoint,AccountId)',
      MultisigExecuted: '(AccountId,Timepoint,AccountId,DispatchResult)',
      MultisigCancelled: '(AccountId,Timepoint,AccountId)'
    }
  },
  /**
   * Lookup37: pallet_Timestamp::pallet::Call
   **/
  PalletTimestampCall: {
    _enum: {
      set: {
        now: 'Compact<Moment>'
      }
    }
  },
  /**
   * Lookup41: pallet_Authorship::pallet::Call
   **/
  PalletAuthorshipCall: {
    _enum: {
      set_uncles: {
        newUncles: 'Vec<Header>'
      }
    }
  },
  /**
   * Lookup42: pallet_Authorship::pallet::Error
   **/
  PalletAuthorshipError: {
    _enum: ['InvalidUncleParent', 'UnclesAlreadySet', 'TooManyUncles', 'GenesisUncle', 'TooHighUncle', 'UncleAlreadyIncluded', 'OldUncle']
  },
  /**
   * Lookup44: pallet_Indices::pallet::Call
   **/
  PalletIndicesCall: 'Null',
  /**
   * Lookup46: pallet_Indices::pallet::Event
   **/
  PalletIndicesEvent: {
    _enum: {
      NewAccountIndex: '(AccountId,AccountIndex)'
    }
  },
  /**
   * Lookup49: pallet_Balances::pallet::Call
   **/
  PalletBalancesCall: {
    _enum: {
      transfer: {
        dest: 'LookupSource',
        value: 'Compact<Balance>',
      },
      set_balance: {
        who: 'LookupSource',
        newFree: 'Compact<Balance>',
        newReserved: 'Compact<Balance>',
      },
      force_transfer: {
        source: 'LookupSource',
        dest: 'LookupSource',
        value: 'Compact<Balance>',
      },
      transfer_keep_alive: {
        dest: 'LookupSource',
        value: 'Compact<Balance>'
      }
    }
  },
  /**
   * Lookup51: pallet_Balances::pallet::Error
   **/
  PalletBalancesError: {
    _enum: ['VestingBalance', 'LiquidityRestrictions', 'Overflow', 'InsufficientBalance', 'ExistentialDeposit', 'KeepAlive', 'ExistingVestingSchedule', 'DeadAccount']
  },
  /**
   * Lookup52: pallet_Balances::pallet::Event
   **/
  PalletBalancesEvent: {
    _enum: {
      NewAccount: '(AccountId,Balance)',
      ReapedAccount: '(AccountId,Balance)',
      Transfer: '(AccountId,AccountId,Balance,Balance)',
      BalanceSet: '(AccountId,Balance,Balance)',
      Deposit: '(AccountId,Balance)'
    }
  },
  /**
   * Lookup64: pallet_Staking::pallet::Call
   **/
  PalletStakingCall: {
    _enum: {
      bond: {
        controller: 'LookupSource',
        value: 'Compact<BalanceOf>',
        payee: 'RewardDestination',
      },
      bond_extra: {
        maxAdditional: 'Compact<BalanceOf>',
      },
      unbond: {
        value: 'Compact<BalanceOf>',
      },
      withdraw_unbonded: 'Null',
      validate: {
        prefs: 'ValidatorPrefs',
      },
      nominate: {
        targets: 'Vec<LookupSource>',
      },
      chill: 'Null',
      set_payee: {
        payee: 'RewardDestination',
      },
      set_controller: {
        controller: 'LookupSource',
      },
      set_validator_count: {
        _alias: {
          new_: 'new',
        },
        new_: 'Compact<u32>',
      },
      force_no_eras: 'Null',
      force_new_era: 'Null',
      set_invulnerables: {
        validators: 'Vec<AccountId>',
      },
      force_unstake: {
        stash: 'AccountId',
      },
      force_new_era_always: 'Null',
      cancel_deferred_slash: {
        era: 'EraIndex',
        slashIndices: 'Vec<u32>',
      },
      rebond: {
        value: 'Compact<BalanceOf>'
      }
    }
  },
  /**
   * Lookup66: pallet_Staking::pallet::Error
   **/
  PalletStakingError: {
    _enum: ['NotController', 'NotStash', 'AlreadyBonded', 'AlreadyPaired', 'EmptyTargets', 'DuplicateIndex', 'InvalidSlashIndex', 'InsufficientValue', 'NoMoreChunks', 'NoUnlockChunk']
  },
  /**
   * Lookup67: pallet_Staking::pallet::Event
   **/
  PalletStakingEvent: {
    _enum: {
      Reward: '(Balance,Balance)',
      Slash: '(AccountId,Balance)',
      OldSlashingReportDiscarded: 'SessionIndex'
    }
  },
  /**
   * Lookup84: pallet_Session::pallet::Call
   **/
  PalletSessionCall: {
    _enum: {
      set_keys: {
        _alias: {
          keys_: 'keys',
        },
        keys_: 'Keys',
        proof: 'Bytes'
      }
    }
  },
  /**
   * Lookup85: pallet_Session::pallet::Error
   **/
  PalletSessionError: {
    _enum: ['InvalidProof', 'NoAssociatedValidatorId', 'DuplicatedKey']
  },
  /**
   * Lookup86: pallet_Session::pallet::Event
   **/
  PalletSessionEvent: {
    _enum: {
      NewSession: 'SessionIndex'
    }
  },
  /**
   * Lookup98: pallet_Democracy::pallet::Call
   **/
  PalletDemocracyCall: {
    _enum: {
      propose: {
        proposalHash: 'Hash',
        value: 'Compact<BalanceOf>',
      },
      second: {
        proposal: 'Compact<PropIndex>',
      },
      vote: {
        refIndex: 'Compact<ReferendumIndex>',
        vote: 'Vote',
      },
      proxy_vote: {
        refIndex: 'Compact<ReferendumIndex>',
        vote: 'Vote',
      },
      emergency_cancel: {
        refIndex: 'ReferendumIndex',
      },
      external_propose: {
        proposalHash: 'Hash',
      },
      external_propose_majority: {
        proposalHash: 'Hash',
      },
      external_propose_default: {
        proposalHash: 'Hash',
      },
      fast_track: {
        proposalHash: 'Hash',
        votingPeriod: 'BlockNumber',
        delay: 'BlockNumber',
      },
      veto_external: {
        proposalHash: 'Hash',
      },
      cancel_referendum: {
        refIndex: 'Compact<ReferendumIndex>',
      },
      cancel_queued: {
        which: 'ReferendumIndex',
      },
      set_proxy: {
        proxy: 'AccountId',
      },
      resign_proxy: 'Null',
      remove_proxy: {
        proxy: 'AccountId',
      },
      delegate: {
        to: 'AccountId',
        conviction: 'Conviction',
      },
      undelegate: 'Null',
      clear_public_proposals: 'Null',
      note_preimage: {
        encodedProposal: 'Bytes',
      },
      note_imminent_preimage: {
        encodedProposal: 'Bytes',
      },
      reap_preimage: {
        proposalHash: 'Hash'
      }
    }
  },
  /**
   * Lookup99: pallet_Democracy::pallet::Error
   **/
  PalletDemocracyError: {
    _enum: ['ValueLow', 'ProposalMissing', 'NotProxy', 'BadIndex', 'AlreadyCanceled', 'DuplicateProposal', 'ProposalBlacklisted', 'NotSimpleMajority', 'InvalidHash', 'NoProposal', 'AlreadyVetoed', 'AlreadyProxy', 'WrongProxy', 'NotDelegated', 'DuplicatePreimage', 'NotImminent', 'Early', 'Imminent', 'PreimageMissing', 'ReferendumInvalid', 'PreimageInvalid', 'NoneWaiting']
  },
  /**
   * Lookup102: pallet_Democracy::pallet::Event
   **/
  PalletDemocracyEvent: {
    _enum: {
      Proposed: '(PropIndex,Balance)',
      Tabled: '(PropIndex,Balance,Vec<AccountId>)',
      ExternalTabled: 'Null',
      Started: '(ReferendumIndex,VoteThreshold)',
      Passed: 'ReferendumIndex',
      NotPassed: 'ReferendumIndex',
      Cancelled: 'ReferendumIndex',
      Executed: '(ReferendumIndex,bool)',
      Delegated: '(AccountId,AccountId)',
      Undelegated: 'AccountId',
      Vetoed: '(AccountId,Hash,BlockNumber)',
      PreimageNoted: '(Hash,AccountId,Balance)',
      PreimageUsed: '(Hash,AccountId,Balance)',
      PreimageInvalid: '(Hash,ReferendumIndex)',
      PreimageMissing: '(Hash,ReferendumIndex)',
      PreimageReaped: '(Hash,AccountId,Balance,AccountId)'
    }
  },
  /**
   * Lookup115: pallet_Council::pallet::Call
   **/
  PalletCouncilCall: {
    _enum: {
      set_members: {
        newMembers: 'Vec<AccountId>',
      },
      execute: {
        proposal: 'Proposal',
      },
      propose: {
        threshold: 'Compact<MemberCount>',
        proposal: 'Proposal',
      },
      vote: {
        proposal: 'Hash',
        index: 'Compact<ProposalIndex>',
        approve: 'bool'
      }
    }
  },
  /**
   * Lookup116: pallet_Council::pallet::Error
   **/
  PalletCouncilError: {
    _enum: ['NotMember', 'DuplicateProposal', 'ProposalMissing', 'WrongIndex', 'DuplicateVote', 'AlreadyInitialized']
  },
  /**
   * Lookup119: pallet_Council::pallet::Event
   **/
  PalletCouncilEvent: {
    _enum: {
      Proposed: '(AccountId,ProposalIndex,Hash,MemberCount)',
      Voted: '(AccountId,Hash,bool,MemberCount,MemberCount)',
      Approved: 'Hash',
      Disapproved: 'Hash',
      Executed: '(Hash,bool)',
      MemberExecuted: '(Hash,bool)'
    }
  },
  /**
   * Lookup122: pallet_Elections::pallet::Call
   **/
  PalletElectionsCall: {
    _enum: {
      vote: {
        votes: 'Vec<AccountId>',
        value: 'Compact<BalanceOf>',
      },
      remove_voter: 'Null',
      report_defunct_voter: {
        target: 'LookupSource',
      },
      submit_candidacy: 'Null',
      renounce_candidacy: 'Null',
      remove_member: {
        who: 'LookupSource'
      }
    }
  },
  /**
   * Lookup123: pallet_Elections::pallet::Error
   **/
  PalletElectionsError: {
    _enum: ['UnableToVote', 'NoVotes', 'TooManyVotes', 'MaximumVotesExceeded', 'LowBalance', 'UnableToPayBond', 'MustBeVoter', 'ReportSelf', 'DuplicatedCandidate', 'MemberSubmit', 'RunnerSubmit', 'InsufficientCandidateFunds', 'InvalidOrigin', 'NotMember']
  },
  /**
   * Lookup125: pallet_Elections::pallet::Event
   **/
  PalletElectionsEvent: {
    _enum: {
      NewTerm: 'Vec<(AccountId,Balance)>',
      EmptyTerm: 'Null',
      MemberKicked: 'AccountId',
      MemberRenounced: 'AccountId',
      VoterReported: '(AccountId,AccountId,bool)'
    }
  },
  /**
   * Lookup128: pallet_FinalityTracker::pallet::Call
   **/
  PalletFinalityTrackerCall: {
    _enum: {
      final_hint: {
        hint: 'Compact<BlockNumber>'
      }
    }
  },
  /**
   * Lookup129: pallet_FinalityTracker::pallet::Error
   **/
  PalletFinalityTrackerError: {
    _enum: ['AlreadyUpdated', 'BadHint']
  },
  /**
   * Lookup130: pallet_Grandpa::pallet::Call
   **/
  PalletGrandpaCall: {
    _enum: {
      report_misbehavior: {
        report: 'Bytes'
      }
    }
  },
  /**
   * Lookup131: pallet_Grandpa::pallet::Error
   **/
  PalletGrandpaError: {
    _enum: ['PauseFailed', 'ResumeFailed', 'ChangePending', 'TooSoon']
  },
  /**
   * Lookup133: pallet_Grandpa::pallet::Event
   **/
  PalletGrandpaEvent: {
    _enum: {
      NewAuthorities: 'AuthorityList',
      Paused: 'Null',
      Resumed: 'Null'
    }
  },
  /**
   * Lookup138: pallet_Treasury::pallet::Call
   **/
  PalletTreasuryCall: {
    _enum: {
      propose_spend: {
        value: 'Compact<BalanceOf>',
        beneficiary: 'LookupSource',
      },
      reject_proposal: {
        proposalId: 'Compact<ProposalIndex>',
      },
      approve_proposal: {
        proposalId: 'Compact<ProposalIndex>',
      },
      report_awesome: {
        reason: 'Bytes',
        who: 'AccountId',
      },
      retract_tip: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'Hash',
      },
      tip_new: {
        reason: 'Bytes',
        who: 'AccountId',
        tipValue: 'BalanceOf',
      },
      tip: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'Hash',
        tipValue: 'BalanceOf',
      },
      close_tip: {
        _alias: {
          hash_: 'hash',
        },
        hash_: 'Hash'
      }
    }
  },
  /**
   * Lookup141: pallet_Treasury::pallet::Error
   **/
  PalletTreasuryError: {
    _enum: ['InsufficientProposersBalance', 'InvalidProposalIndex', 'ReasonTooBig', 'AlreadyKnown', 'UnknownTip', 'NotFinder', 'StillOpen', 'Premature']
  },
  /**
   * Lookup142: pallet_Treasury::pallet::Event
   **/
  PalletTreasuryEvent: {
    _enum: {
      Proposed: 'ProposalIndex',
      Spending: 'Balance',
      Awarded: '(ProposalIndex,Balance,AccountId)',
      Rejected: '(ProposalIndex,Balance)',
      Burnt: 'Balance',
      Rollover: 'Balance',
      Deposit: 'Balance',
      NewTip: 'Hash',
      TipClosing: 'Hash',
      TipClosed: '(Hash,AccountId,Balance)',
      TipRetracted: 'Hash'
    }
  },
  /**
   * Lookup150: pallet_Contracts::pallet::Call
   **/
  PalletContractsCall: {
    _enum: {
      update_schedule: {
        schedule: 'Schedule',
      },
      put_code: {
        gasLimit: 'Compact<Gas>',
        code: 'Bytes',
      },
      call: {
        dest: 'LookupSource',
        value: 'Compact<BalanceOf>',
        gasLimit: 'Compact<Gas>',
        data: 'Bytes',
      },
      instantiate: {
        endowment: 'Compact<BalanceOf>',
        gasLimit: 'Compact<Gas>',
        codeHash: 'CodeHash',
        data: 'Bytes',
      },
      claim_surcharge: {
        dest: 'AccountId',
        auxSender: 'Option<AccountId>'
      }
    }
  },
  /**
   * Lookup152: pallet_Contracts::pallet::Error
   **/
  PalletContractsError: {
    _enum: ['InvalidScheduleVersion', 'InvalidSurchargeClaim', 'InvalidSourceContract', 'InvalidDestinationContract', 'InvalidTombstone', 'InvalidContractOrigin']
  },
  /**
   * Lookup153: pallet_Contracts::pallet::Event
   **/
  PalletContractsEvent: {
    _enum: {
      Transfer: '(AccountId,AccountId,Balance)',
      Instantiated: '(AccountId,AccountId)',
      Evicted: '(AccountId,bool)',
      Restored: '(AccountId,AccountId,Hash,Balance,bool)',
      CodeStored: 'Hash',
      ScheduleUpdated: 'u32',
      Dispatched: '(AccountId,bool)',
      ContractExecution: '(AccountId,Bytes)'
    }
  },
  /**
   * Lookup162: pallet_Identity::pallet::Call
   **/
  PalletIdentityCall: {
    _enum: {
      add_registrar: {
        account: 'AccountId',
      },
      set_identity: {
        info: 'IdentityInfo',
      },
      set_subs: {
        subs: 'Vec<(AccountId,Data)>',
      },
      clear_identity: 'Null',
      request_judgement: {
        regIndex: 'Compact<RegistrarIndex>',
        maxFee: 'Compact<BalanceOf>',
      },
      cancel_request: {
        regIndex: 'RegistrarIndex',
      },
      set_fee: {
        index: 'Compact<RegistrarIndex>',
        fee: 'Compact<BalanceOf>',
      },
      set_account_id: {
        _alias: {
          new_: 'new',
        },
        index: 'Compact<RegistrarIndex>',
        new_: 'AccountId',
      },
      set_fields: {
        index: 'Compact<RegistrarIndex>',
        fields: 'IdentityFields',
      },
      provide_judgement: {
        regIndex: 'Compact<RegistrarIndex>',
        target: 'LookupSource',
        judgement: 'IdentityJudgement',
      },
      kill_identity: {
        target: 'LookupSource'
      }
    }
  },
  /**
   * Lookup163: pallet_Identity::pallet::Error
   **/
  PalletIdentityError: {
    _enum: ['TooManySubAccounts', 'NotFound', 'NotNamed', 'EmptyIndex', 'FeeChanged', 'NoIdentity', 'StickyJudgement', 'JudgementGiven', 'InvalidJudgement', 'InvalidIndex', 'InvalidTarget', 'TooManyFields']
  },
  /**
   * Lookup164: pallet_Identity::pallet::Event
   **/
  PalletIdentityEvent: {
    _enum: {
      IdentitySet: 'AccountId',
      IdentityCleared: '(AccountId,Balance)',
      IdentityKilled: '(AccountId,Balance)',
      JudgementRequested: '(AccountId,RegistrarIndex)',
      JudgementUnrequested: '(AccountId,RegistrarIndex)',
      JudgementGiven: '(AccountId,RegistrarIndex)',
      RegistrarAdded: 'RegistrarIndex'
    }
  },
  /**
   * Lookup170: pallet_ImOnline::pallet::Call
   **/
  PalletImOnlineCall: {
    _enum: {
      heartbeat: {
        heartbeat: 'Heartbeat',
        signature: 'Signature'
      }
    }
  },
  /**
   * Lookup171: pallet_ImOnline::pallet::Error
   **/
  PalletImOnlineError: {
    _enum: ['InvalidKey', 'DuplicatedHeartbeat']
  },
  /**
   * Lookup174: pallet_ImOnline::pallet::Event
   **/
  PalletImOnlineEvent: {
    _enum: {
      HeartbeatReceived: 'AuthorityId',
      AllGood: 'Null',
      SomeOffline: 'Vec<IdentificationTuple>'
    }
  },
  /**
   * Lookup179: pallet_AuthorityDiscovery::pallet::Call
   **/
  PalletAuthorityDiscoveryCall: 'Null',
  /**
   * Lookup180: pallet_Offences::pallet::Call
   **/
  PalletOffencesCall: 'Null',
  /**
   * Lookup183: pallet_Offences::pallet::Event
   **/
  PalletOffencesEvent: {
    _enum: {
      Offence: '(Kind,OpaqueTimeSlot)'
    }
  },
  /**
   * Lookup188: pallet_RandomnessCollectiveFlip::pallet::Call
   **/
  PalletRandomnessCollectiveFlipCall: 'Null',
  /**
   * Lookup189: pallet_Nicks::pallet::Call
   **/
  PalletNicksCall: {
    _enum: {
      set_name: {
        name: 'Bytes',
      },
      clear_name: 'Null',
      kill_name: {
        target: 'LookupSource',
      },
      force_name: {
        target: 'LookupSource',
        name: 'Bytes'
      }
    }
  },
  /**
   * Lookup190: pallet_Nicks::pallet::Error
   **/
  PalletNicksError: {
    _enum: ['TooShort', 'TooLong', 'Unnamed']
  },
  /**
   * Lookup191: pallet_Nicks::pallet::Event
   **/
  PalletNicksEvent: {
    _enum: {
      NameSet: 'AccountId',
      NameForced: 'AccountId',
      NameChanged: 'AccountId',
      NameCleared: '(AccountId,Balance)',
      NameKilled: '(AccountId,Balance)'
    }
  },
  /**
   * Lookup193: pallet_Sudo::pallet::Call
   **/
  PalletSudoCall: {
    _enum: {
      sudo: {
        proposal: 'Proposal',
      },
      set_key: {
        _alias: {
          new_: 'new',
        },
        new_: 'LookupSource',
      },
      sudo_as: {
        who: 'LookupSource',
        proposal: 'Proposal'
      }
    }
  },
  /**
   * Lookup194: pallet_Sudo::pallet::Error
   **/
  PalletSudoError: {
    _enum: ['RequireSudo']
  },
  /**
   * Lookup195: pallet_Sudo::pallet::Event
   **/
  PalletSudoEvent: {
    _enum: {
      Sudid: 'bool',
      KeyChanged: 'AccountId',
      SudoAsDone: 'bool'
    }
  },
  /**
   * Lookup201: pallet_Signaling::pallet::Call
   **/
  PalletSignalingCall: {
    _enum: {
      create_proposal: {
        title: 'ProposalTitle',
        contents: 'ProposalContents',
        outcomes: 'Vec<VoteOutcome>',
        voteType: 'VoteType',
        tallyType: 'TallyType',
      },
      advance_proposal: {
        proposalHash: 'Hash'
      }
    }
  },
  /**
   * Lookup202: pallet_Signaling::pallet::Error
   **/
  PalletSignalingError: {
    _enum: ['VoteRecordDoesntExist']
  },
  /**
   * Lookup203: pallet_Signaling::pallet::Event
   **/
  PalletSignalingEvent: {
    _enum: {
      NewProposal: '(AccountId,Hash)',
      CommitStarted: '(Hash,u64,BlockNumber)',
      VotingStarted: '(Hash,u64,BlockNumber)',
      VotingCompleted: '(Hash,u64)'
    }
  },
  /**
   * Lookup208: pallet_Voting::pallet::Call
   **/
  PalletVotingCall: {
    _enum: {
      commit: {
        voteId: 'u64',
        commit: 'VoteOutcome',
      },
      reveal: {
        voteId: 'u64',
        vote: 'Vec<VoteOutcome>',
        secret: 'Option<VoteOutcome>'
      }
    }
  },
  /**
   * Lookup209: pallet_Voting::pallet::Error
   **/
  PalletVotingError: {
    _enum: ['VoteCompleted']
  },
  /**
   * Lookup211: pallet_Voting::pallet::Event
   **/
  PalletVotingEvent: {
    _enum: {
      VoteCreated: '(u64,AccountId,VoteType)',
      VoteAdvanced: '(u64,VoteStage,VoteStage)',
      VoteCommitted: '(u64,AccountId)',
      VoteRevealed: '(u64,AccountId,Vec<VoteOutcome>)'
    }
  },
  /**
   * Lookup213: pallet_TreasuryReward::pallet::Call
   **/
  PalletTreasuryRewardCall: 'Null',
  /**
   * Lookup215: pallet_TreasuryReward::pallet::Event
   **/
  PalletTreasuryRewardEvent: {
    _enum: {
      TreasuryMinting: '(Balance,Balance2,BlockNumber)'
    }
  }
};
