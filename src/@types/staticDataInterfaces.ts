import { ItemCharacteristic, TaggedItem } from '.';
import { LookCategories, MoveKinds, PlayBooks, Stats, UniqueTypes } from './enums';

/**
 * This file contains interfaces that represent static data models.
 * Static data models are those that are created when the backend starts up,
 * drawn from the Apocalypse World book itself. Static data can become
 * the building blocks for dynamic data models.
 */

export interface Playbook {
  id: string;
  playbookType: PlayBooks;
  barterInstructions: string;
  intro: string;
  introComment: string;
  playbookImageUrl: string;
}

export interface PlaybookCreator {
  id: string;
  playbookType: PlayBooks;
  gearInstructions: GearInstructions;
  improvementInstructions: string;
  movesInstructions: string;
  hxInstructions: string;
  names: Name[];
  looks: Look[];
  statsOptions: StatsOption[];
  playbookUniqueCreator: PlaybookUniqueCreator;
  optionalMoves: Move[];
  defaultMoves: Move[];
  defaultMoveCount: number;
  moveChoiceCount: number;
}

export interface Name {
  id: string;
  name: string;
}

export interface Look {
  id: string;
  look: string;
  category: LookCategories;
}

export interface GearInstructions {
  id: string;
  youGet: string;
  youGetItems: string[];
  inAddition?: string;
  introduceChoice: string;
  numberCanChoose: number;
  chooseableGear: string[];
  withMC: string;
  startingBarter: number;
}

export interface StatsOption {
  id: string;
  COOL: number;
  HARD: number;
  HOT: number;
  SHARP: number;
  WEIRD: number;
}

// -------------------------------------------------- Move interfaces -------------------------------------------------- //
export interface Move {
  id: string;
  name: string;
  description: string;
  kind: MoveKinds;
  playbook?: PlayBooks;
  stat?: Stats;
  statModifier?: StatModifier;
  rollModifier?: RollModifier;
}

export interface CharacterMove extends Move {
  isSelected: boolean;
}

export interface RollModifier {
  id: string;
  movesToModify: Move[];
  statToRollWith: Stats;
}

export interface StatModifier {
  id: string;
  statToModify: Stats;
  modification: number;
}

// --------------------------------------------- PlaybookUnique interfaces --------------------------------------------- //

export interface PlaybookUniqueCreator {
  id: string;
  type: UniqueTypes;
  angelKitCreator?: AngelKitCreator;
  customWeaponsCreator?: CustomWeaponsCreator;
  brainerGearCreator?: BrainerGearCreator;
}

export interface AngelKitCreator {
  id: string;
  angelKitInstructions: string;
  startingStock: number;
}

export interface CustomWeaponsCreator {
  firearmsTitle: string;
  firearmsBaseInstructions: string;
  firearmsBaseOptions: TaggedItem[];
  firearmsOptionsInstructions: string;
  firearmsOptionsOptions: ItemCharacteristic[];
  handTitle: string;
  handBaseInstructions: string;
  handBaseOptions: TaggedItem[];
  handOptionsInstructions: string;
  handOptionsOptions: ItemCharacteristic[];
}

export interface BrainerGearCreator {
  id: string;
  gear: string[];
}
