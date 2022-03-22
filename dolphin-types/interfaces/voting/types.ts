// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Option, Struct, U8aFixed, Vec, bool, u128, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

/** @name Commitments */
export interface Commitments extends Vec<ITuple<[AccountId, VoteOutcome]>> {}

/** @name Reveals */
export interface Reveals extends Vec<ITuple<[AccountId, Vec<VoteOutcome>]>> {}

/** @name Tally */
export interface Tally extends Option<Vec<ITuple<[VoteOutcome, u128]>>> {}

/** @name TallyType */
export interface TallyType extends Enum {
  readonly isOnePerson: boolean;
  readonly isOneCoin: boolean;
  readonly type: 'OnePerson' | 'OneCoin';
}

/** @name VoteData */
export interface VoteData extends Struct {
  readonly initiator: AccountId;
  readonly stage: VoteStage;
  readonly vote_type: VoteType;
  readonly tally_type: TallyType;
  readonly is_commit_reveal: bool;
}

/** @name VoteOutcome */
export interface VoteOutcome extends U8aFixed {}

/** @name VoteRecord */
export interface VoteRecord extends Struct {
  readonly id: u64;
  readonly commitments: Commitments;
  readonly reveals: Reveals;
  readonly data: VoteData;
  readonly outcomes: Vec<VoteOutcome>;
}

/** @name VoteStage */
export interface VoteStage extends Enum {
  readonly isPreVoting: boolean;
  readonly isCommit: boolean;
  readonly isVoting: boolean;
  readonly isCompleted: boolean;
  readonly type: 'PreVoting' | 'Commit' | 'Voting' | 'Completed';
}

/** @name VoteType */
export interface VoteType extends Enum {
  readonly isBinary: boolean;
  readonly isMultiOption: boolean;
  readonly isRankedChoice: boolean;
  readonly type: 'Binary' | 'MultiOption' | 'RankedChoice';
}

export type PHANTOM_VOTING = 'voting';
