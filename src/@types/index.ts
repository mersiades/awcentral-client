import { CastCrew } from './dataInterfaces';
import { GangSize, HoldingSize, ThreatType, VehicleType } from './enums';
import {
  VehicleFrame,
  VehicleBattleOption,
  GangOption,
  HoldingOption,
  FollowersOption,
  SkinnerGearItem,
  SecurityOption,
} from './staticDataInterfaces';

export interface KeycloakUser {
  id?: string;
  username?: string;
  email?: string;
}

export interface KeycloakUserInfo {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  preferred_username: string;
  sub: string;
}

export interface TaggedItem {
  id: string;
  description: string;
  tags: string[];
}

export interface ItemCharacteristic {
  id: string;
  description: string;
  tag: string;
}

export interface HxInput {
  characterId: string;
  characterName: string;
  hxValue: number;
}

export interface HarmInput {
  id: string;
  value: number;
  isStabilized: boolean;
  hasComeBackHard: boolean;
  hasComeBackWeird: boolean;
  hasChangedPlaybook: boolean;
  hasDied: boolean;
}

export interface VehicleInput {
  id?: string;
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

export interface BattleVehicleInput {
  id?: string;
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

export interface GangInput {
  id?: string;
  size: GangSize;
  harm: number;
  armor: number;
  strengths: GangOption[];
  weaknesses: GangOption[];
  tags: string[];
}

export interface ThreatInput {
  id?: string;
  name: string;
  threatKind: ThreatType;
  impulse: string;
  description?: string;
  stakes?: string;
}

export interface NpcInput {
  id?: string;
  name: string;
  description?: string;
}

export interface HoldingInput {
  id?: string;
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

export interface EstablishmentInput {
  id?: string;
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

export interface FollowersInput {
  id?: string;
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

export interface SkinnerGearInput {
  id?: string;
  graciousWeapon: SkinnerGearItem;
  luxeGear: SkinnerGearItem[];
}
