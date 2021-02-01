import { ItemCharacteristic, TaggedItem } from '.';
import {
  BattleOptionType,
  LookType,
  MoveActionType,
  MoveType,
  PlaybookType,
  RollType,
  StatType,
  UniqueTypes,
  VehicleFrameType,
  VehicleType,
} from './enums';

/**
 * This file contains interfaces that represent static data models.
 * Static data models are those that are created when the backend starts up,
 * drawn from the Apocalypse World book itself. Static data can become
 * the building blocks for dynamic data models.
 */

export interface Playbook {
  id: string;
  playbookType: PlaybookType;
  barterInstructions: string;
  intro: string;
  introComment: string;
  playbookImageUrl: string;
}

export interface PlaybookCreator {
  id: string;
  playbookType: PlaybookType;
  gearInstructions: GearInstructions;
  improvementInstructions: string;
  movesInstructions: string;
  hxInstructions: string;
  names: Name[];
  looks: Look[];
  statsOptions: StatsOption[];
  playbookUniqueCreator?: PlaybookUniqueCreator; // Driver does not have a PlaybookUnique
  optionalMoves: Move[];
  defaultMoves: Move[];
  defaultMoveCount: number;
  moveChoiceCount: number;
  defaultVehicleCount: number;
}

export interface Name {
  id: string;
  name: string;
}

export interface Look {
  id: string;
  look: string;
  category: LookType;
}

export interface GearInstructions {
  id: string;
  gearIntro: string;
  youGetItems: string[];
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

export interface HoldConditions {
  id: string;
  onTenPlus: number;
  onSevenToNine: number;
  onMiss: number;
}

export interface PlusOneForwardConditions {
  id: string;
  isManualGrant: boolean;
  onTenPlus: boolean;
  onSevenToNine: boolean;
  onMiss: boolean;
}

export interface MoveAction {
  id: string;
  actionType: MoveActionType;
  rollType?: RollType;
  statToRollWith?: StatType;
  holdConditions?: HoldConditions;
  plusOneForwardConditions?: PlusOneForwardConditions;
}

export interface Move {
  id: string;
  name: string;
  description: string;
  kind: MoveType;
  playbook?: PlaybookType;
  stat?: StatType;
  statModifier?: StatModifier;
  rollModifier?: RollModifier;
  moveAction?: MoveAction;
}

export interface CharacterMove extends Move {
  isSelected: boolean;
}

export interface RollModifier {
  id: string;
  moveToModify: Move;
  statToRollWith: StatType;
}

export interface StatModifier {
  id: string;
  statToModify: StatType;
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
  id?: string;
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

export interface VehicleCreator {
  id: string;
  carCreator: CarCreator;
  bikeCreator: BikeCreator;
}

export interface CarCreator {
  id: string;
  vehicleType: VehicleType;
  introInstructions: string;
  frames: VehicleFrame[];
  strengths: string[];
  looks: string[];
  weaknesses: string[];
  battleOptions: VehicleBattleOption[];
}

export interface BikeCreator {
  id: string;
  vehicleType: VehicleType;
  introInstructions: string;
  frame: VehicleFrame;
  strengths: string[];
  looks: string[];
  weaknesses: string[];
  battleOptions: VehicleBattleOption[];
}

export interface VehicleFrame {
  id: string;
  frameType: VehicleFrameType;
  massive: number;
  examples: string;
  battleOptionCount: number;
}

export interface VehicleBattleOption {
  id: string;
  battleOptionType: BattleOptionType;
  name: string;
}

export interface GangOption {
  id: string;
  description: string;
  modifier?: string;
  // For example, +rich, -savage, +Vulnerable: disease
  tag?: string;
}
