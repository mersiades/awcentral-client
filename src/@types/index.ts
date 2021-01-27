import { VehicleFrame, VehicleBattleOption } from './staticDataInterfaces';

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
