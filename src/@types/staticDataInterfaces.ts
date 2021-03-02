import { ItemCharacteristic, TaggedItem } from '.';
import {
  BattleOptionType,
  GangSize,
  HoldingSize,
  LookType,
  MoveActionType,
  MoveType,
  PlaybookType,
  RollType,
  StatType,
  ThreatType,
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
  defaultMoveCount: number;
  moveChoiceCount: number;
  defaultVehicleCount: number;
  improvementInstructions: string;
  movesInstructions: string;
  hxInstructions: string;
  names: Name[];
  looks: Look[];
  statsOptions: StatsOption[];
  optionalMoves: Move[];
  defaultMoves: Move[];
  gearInstructions: GearInstructions;
  playbookUniqueCreator?: PlaybookUniqueCreator; // Driver does not have a PlaybookUnique
  __typename?: 'PlaybookCreator';
}

export interface Name {
  id: string;
  name: string;
  __typename?: 'Name';
}

export interface Look {
  id: string;
  look: string;
  category: LookType;
  playbookType: PlaybookType;
  __typename?: 'Look';
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
  __typename?: 'GearInstructions';
}

export interface StatsOption {
  id: string;
  COOL: number;
  HARD: number;
  HOT: number;
  SHARP: number;
  WEIRD: number;
  __typename?: 'StatsOption';
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
  __typename?: 'MoveAction';
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
  __typename?: 'Move';
}

export interface CharacterMove extends Move {
  isSelected: boolean;
}

export interface RollModifier {
  id: string;
  movesToModify: Move[];
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
  brainerGearCreator?: BrainerGearCreator;
  customWeaponsCreator?: CustomWeaponsCreator;
  establishmentCreator?: EstablishmentCreator;
  followersCreator?: FollowersCreator;
  gangCreator?: GangCreator;
  holdingCreator?: HoldingCreator;
  skinnerGearCreator?: SkinnerGearCreator;
  weaponsCreator?: WeaponsCreator;
  workspaceCreator?: WorkspaceCreator;
  __typename?: 'PlaybookUniqueCreator';
}

export interface AngelKitCreator {
  id: string;
  angelKitInstructions: string;
  startingStock: number;
  __typename?: 'AngelKitCreator';
}

export interface BrainerGearCreator {
  id: string;
  gear: string[];
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

export interface SecurityOption {
  id: string;
  description: string;
  value: number;
  __typename?: 'SecurityOption';
}

export interface EstablishmentCreator {
  id: string;
  mainAttractionCount: number;
  sideAttractionCount: number;
  attractions: string[];
  atmospheres: string[];
  atmosphereCount: number[];
  regularsNames: string[];
  regularsQuestions: string[];
  interestedPartyNames: string[];
  interestedPartyQuestions: string[];
  securityOptions: SecurityOption[];
  __typename?: 'EstablishmentCreator';
}

export interface FollowersOption {
  id: string;
  description: string;

  //  -1 represents null
  newNumberOfFollowers: number;

  // Ranges from -1 to 1, with -2 representing null
  surplusBarterChange: number;

  // Ranges from 0 to 1, with -1 representing null
  fortuneChange: number;
  surplusChange?: string;
  wantChange?: string[];
  __typename?: 'FollowersOption';
}

export interface FollowersCreator {
  id: string;
  instructions: string;
  defaultNumberOfFollowers: number;
  defaultSurplusBarter: number;
  defaultFortune: number;
  strengthCount: number;
  weaknessCount: number;
  travelOptions: string[];
  characterizationOptions: string[];
  defaultWants: string[];
  strengthOptions: FollowersOption[];
  weaknessOptions: FollowersOption[];
  __typename?: 'FollowersCreator';
}

export interface GangOption {
  id: string;
  description: string;
  modifier?: string;
  // For example, +rich, -savage, +Vulnerable: disease
  tag?: string;
  __typename?: 'GangOption';
}

export interface GangCreator {
  id: string;
  intro: string;
  defaultSize: GangSize;
  defaultHarm: number;
  defaultArmor: number;
  strengthChoiceCount: number;
  weaknessChoiceCount: number;
  defaultTags: string[];
  strengths: GangOption[];
  weaknesses: GangOption[];
  __typename?: 'GangCreator';
}

export interface HoldingOption {
  id: string;
  description: string;

  // Ranges from -1 to 1, with -2 representing null
  surplusChange: number;

  wantChange?: string[];
  newHoldingSize?: HoldingSize;
  gigChange?: string;
  newGangSize?: GangSize;
  gangTagChange?: string;

  // Ranges from -1 to 1, with -2 representing null
  gangHarmChange: number;

  // Ranges from 2 to 6, with - 1 representing null
  newVehicleCount: number;

  // Ranges from 2 to 7, with - 1 representing null
  newBattleVehicleCount: number;

  // Ranges from 0 - 2, with -1 representing null
  newArmorBonus: number;
  __typename?: 'HoldingOption';
}

export interface HoldingCreator {
  id: string;
  defaultHoldingSize: HoldingSize;
  instructions: string;
  defaultSurplus: number;
  defaultWant: string;
  defaultGigs: string[];
  defaultArmorBonus: number;
  defaultVehiclesCount: number;
  defaultBattleVehicleCount: number;
  defaultGangSize: GangSize;
  defaultGangHarm: number;
  defaultGangArmor: number;
  defaultGangTag: string;
  strengthCount: number;
  weaknessCount: number;
  strengthOptions: HoldingOption[];
  weaknessOptions: HoldingOption[];
  __typename?: 'HoldingCreator';
}

export interface SkinnerGearItem {
  id: string;
  item: string;
  note?: string;
  __typename?: 'SkinnerGearItem';
}

export interface SkinnerGearCreator {
  id: string;
  graciousWeaponCount: number;
  luxeGearCount: number;
  graciousWeaponChoices: SkinnerGearItem[];
  luxeGearChoices: SkinnerGearItem[];
  __typename?: 'SkinnerGearCreator';
}

export interface WeaponsCreator {
  id: string;
  bfoGunOptionCount: number;
  seriousGunOptionCount: number;
  backupWeaponsOptionCount: number;
  bigFuckOffGuns: string[];
  seriousGuns: string[];
  backupWeapons: string[];
  __typename?: 'WeaponsCreator';
}

export interface WorkspaceCreator {
  id: string;
  itemsCount: number;
  workspaceInstructions: string;
  projectInstructions: string;
  workspaceItems: string[];
}

// --------------------------------------------- Vehicle interfaces --------------------------------------------- //

export interface VehicleFrame {
  id: string;
  frameType: VehicleFrameType;
  massive: number;
  examples: string;
  battleOptionCount: number;
  __typename?: 'VehicleFrame';
}

export interface VehicleBattleOption {
  id: string;
  battleOptionType: BattleOptionType;
  name: string;
  __typename?: 'VehicleBattleOption';
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

export interface BattleVehicleCreator {
  id: string;
  vehicleType: VehicleType;
  battleVehicleOptions: VehicleBattleOption[];
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

export interface VehicleCreator {
  id: string;
  carCreator: CarCreator;
  bikeCreator: BikeCreator;
  battleVehicleCreator: BattleVehicleCreator;
  __typename?: 'VehicleCreator';
}

// --------------------------------------------- Threat interfaces --------------------------------------------- //

export interface ThreatCreatorContent {
  id: string;
  threatType: ThreatType;
  impulses: string[];
  moves: [];
}

export interface ThreatCreator {
  id: string;
  createThreatInstructions: string;
  essentialThreatInstructions: string;
  threats: ThreatCreatorContent[];
  threatNames: string[];
}
