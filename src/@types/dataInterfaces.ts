import {
  GangSize,
  HoldingSize,
  MessageType,
  PlaybookType,
  RoleType,
  StatType,
  ThreatType,
  UniqueTypes,
  VehicleType,
} from './enums';
import {
  CharacterMove,
  FollowersOption,
  GangOption,
  HoldingOption,
  Look,
  Move,
  SecurityOption,
  SkinnerGearItem,
  VehicleBattleOption,
  VehicleFrame,
} from './staticDataInterfaces';

/**
 * This file contains interfaces that represent data models that are dynamic,
 * in that they are created and modified by user actions. Some of the fields
 * can be filled with static data - data drawn from the Apocalypse World book
 * and inserted into the db when the backend starts
 */

// -------------------------------------------------- User interfaces -------------------------------------------------- //
export interface User {
  id: string;
  userId: string;
  gameRoles: GameRole[];
}

// -------------------------------------------------- Game interfaces -------------------------------------------------- //
export interface Game {
  id: string;
  name: string;
  commsApp: string;
  commsUrl: string;
  hasFinishedPreGame: boolean;
  mc: { displayName: string; id: string };
  players: { displayName: string; id: string }[];
  gameRoles: GameRole[];
  invitees: string[];
  gameMessages: GameMessage[];
}

export interface GameRole {
  id: string;
  role: RoleType;
  userId: string;
  characters: Character[];
  npcs: Npc[];
  threats: Threat[];
  game?: Game;
  __typename?: 'GameRole';
}
// ------------------------------------------------- Player interfaces ------------------------------------------------- //

export interface Character {
  id: string;
  playbook: PlaybookType;
  hasCompletedCharacterCreation: boolean;
  hasPlusOneForward: boolean;
  holds: Hold[];
  statsBlock?: StatsBlock;
  hxBlock: HxStat[];
  gear: string[];
  looks: Look[];
  characterMoves: CharacterMove[];
  harm: CharacterHarm;
  vehicleCount: number;
  battleVehicleCount: number;
  name?: string;
  barter?: number;
  playbookUnique?: PlaybookUnique;
  vehicles: Vehicle[];
  battleVehicles: BattleVehicle[];
  __typename?: 'Character';
}

export interface CharacterHarm {
  id: string;
  value: number;
  isStabilized: boolean;
  hasComeBackHard: boolean;
  hasComeBackWeird: boolean;
  hasChangedPlaybook: boolean;
  hasDied: boolean;
}

export interface StatsBlock {
  id: string;
  statsOptionId: string;
  stats: CharacterStat[];
  __typename?: 'StatsBlock';
}

export interface CharacterStat {
  id: string;
  stat: StatType;
  value: number;
  isHighlighted: boolean;
  __typename?: 'CharacterStat';
}

export interface HxStat {
  characterId: string;
  characterName: string;
  hxValue: number;
}

export interface Hold {
  id: string;
  moveName: string;
  moveDescription: string;
  rollResult: number;
}

// ------------------------------------------------- Playbook Unique interfaces ------------------------------------------------- //

export interface PlaybookUnique {
  id: string;
  type: UniqueTypes;
  brainerGear?: BrainerGear;
  angelKit?: AngelKit;
  customWeapons?: CustomWeapons;
  gang?: Gang;
  weapons?: Weapons;
  holding?: Holding;
  followers?: Followers;
  skinnerGear?: SkinnerGear;
  establishment?: Establishment;
  workspace?: Workspace;
  __typename?: 'PlaybookUnique';
}

export interface AngelKit {
  id: string;
  description: string;
  stock: number;
  angelKitMoves: Move[];
  hasSupplier: boolean;
  supplierText: string;
}

export interface BrainerGear {
  id: string;
  brainerGear: string[];
}

export interface CustomWeapons {
  id: string;
  weapons: string[];
}

export interface CastCrew {
  id: string;
  name: string;
  description: string;
}

export interface Establishment {
  id: string;
  mainAttraction: string;
  bestRegular: string;
  worstRegular: string;
  wantsInOnIt: string;
  oweForIt: string;
  wantsItGone: string;
  sideAttractions: string[];
  atmospheres: string[];
  regulars: string[];
  interestedParties: string[];
  securityOptions: SecurityOption[];
  castAndCrew: CastCrew[];
}

export interface Followers {
  id: string;
  description: string;
  travelOption: string;
  characterization: string;
  followers: number;
  fortune: number;
  barter: number;
  surplusBarter: number;
  surplus: string[];
  wants: string[];
  selectedStrengths: FollowersOption[];
  selectedWeaknesses: FollowersOption[];
}

export interface Gang {
  id: string;
  size: GangSize;
  harm: number;
  armor: number;
  strengths: GangOption[];
  weaknesses: GangOption[];
  tags: string[];
}

export interface Holding {
  id: string;
  holdingSize: HoldingSize;
  gangSize: GangSize;
  souls: string;
  surplus: number;
  barter: number;
  gangHarm: number;
  gangArmor: number;
  gangDefenseArmorBonus: number;
  wants: string[];
  gigs: string[];
  gangTags: string[];
  selectedStrengths: HoldingOption[];
  selectedWeaknesses: HoldingOption[];
}

export interface SkinnerGear {
  id: string;
  graciousWeapon: SkinnerGearItem;
  luxeGear: SkinnerGearItem[];
}

export interface Weapons {
  id: string;
  weapons: string[];
}

export interface Project {
  id: string;
  name: string;
  notes?: string;
}

export interface Workspace {
  id: string;
  workspaceInstructions: string;
  projectInstructions: string;
  workspaceItems: string[];
  projects: Project[];
}

// --------------------------------------------------- Vehicle interfaces --------------------------------------------------- //

export interface Vehicle {
  id: string;
  vehicleType: VehicleType;
  name: string;
  vehicleFrame: VehicleFrame;
  speed: number;
  handling: number;
  armor: number;
  massive: number;
  strengths: string[];
  weaknesses: string[];
  looks: string[];
  battleOptions: VehicleBattleOption[];
}

export interface BattleVehicle {
  id: string;
  vehicleType: VehicleType;
  name: string;
  vehicleFrame: VehicleFrame;
  speed: number;
  handling: number;
  armor: number;
  massive: number;
  strengths: string[];
  weaknesses: string[];
  looks: string[];
  weapons: string[];
  battleOptions: VehicleBattleOption[];
  battleVehicleOptions: VehicleBattleOption[];
}

// --------------------------------------------------- MC interfaces --------------------------------------------------- //

export interface Npc {
  id: string;
  name: string;
  description?: string;
}

export interface Threat {
  id: string;
  name: string;
  threatKind: ThreatType;
  impulse: string;
  description?: string;
  stakes?: string;
}

// --------------------------------------------------- Message interfaces --------------------------------------------------- //

export interface GameMessage {
  id: string;
  gameId: string;
  gameroleId: string;
  messageType: MessageType;
  title: string;
  content: string;
  sentOn: string;
  roll1: number;
  roll2: number;
  rollModifier: number;
  usedPlusOneForward: boolean;
  rollResult: number;
  modifierStatName: StatType;
  additionalModifierValue: number;
  additionalModifierName: string;
  barterSpent: number;
  currentBarter: number;
  harmSuffered: number;
  currentHarm: number;
  stockSpent: number;
  currentStock: number;
  __typename?: 'GameMessage';
}
