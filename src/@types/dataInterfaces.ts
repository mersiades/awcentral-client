import { MessageType, PlaybookType, RoleType, StatType, Threats, UniqueTypes } from './enums';
import { CharacterMove, Look, Move } from './staticDataInterfaces';

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
}
// ------------------------------------------------- Player interfaces ------------------------------------------------- //

export interface Character {
  id: string;
  playbook: PlaybookType;
  hasCompletedCharacterCreation: boolean;
  statsBlock: StatsBlock;
  hxBlock: HxStat[];
  gear: string[];
  looks: Look[];
  characterMoves: CharacterMove[];
  harm: CharacterHarm;
  name?: string;
  barter?: number;
  playbookUnique?: PlaybookUnique;
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
}

export interface CharacterStat {
  id: string;
  stat: StatType;
  value: number;
  isHighlighted: boolean;
}

export interface HxStat {
  characterId: string;
  characterName: string;
  hxValue: number;
}

export interface PlaybookUnique {
  id: string;
  type: UniqueTypes;
  brainerGear?: BrainerGear;
  angelKit?: AngelKit;
  customWeapons?: CustomWeapons;
}

export interface BrainerGear {
  id: string;
  brainerGear: string[];
}

export interface AngelKit {
  id: string;
  description: string;
  stock: number;
  angelKitMoves: Move[];
  hasSupplier: boolean;
  supplierText: string;
}

export interface CustomWeapons {
  id: string;
  weapons: string[];
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
  threatKind: Threats;
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
  rollResult: number;
  modifierStatName: StatType;
  barterSpent: number;
  currentBarter: number;
  harmSuffered: number;
  currentHarm: number;
  stockSpent: number;
  currentStock: number;
}
