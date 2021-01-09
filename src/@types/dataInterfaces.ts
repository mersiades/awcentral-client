import { PlayBooks, Roles, Stats, Threats, UniqueTypes } from './enums';
import { CharacterMove, Look, Move } from './staticDataInterfaces';

/**
 * This file contains interfaces that represent data models that are dynamic,
 * in that they are created and modified by user actions. Some of the fields
 * can be filled with static data - data drawn from the Apocalypse World book
 * and inserted into the db when the backend starts
 */

// -------------------------------------------------- User interfaces -------------------------------------------------- //
export interface User {
  id: string
  userId: string
  gameRoles: GameRole[]
}

// -------------------------------------------------- Game interfaces -------------------------------------------------- //
export interface Game {
  id: string;
  name: string;
  commsApp: string
  commsUrl: string
  hasFinishedPreGame: boolean
  mc: { displayName: string, id: string }
  players: { displayName: string, id: string }[]
  gameRoles: GameRole[]
  invitees: string[]
}

export interface GameRole {
  id: string;
  role: Roles;
  userId: string
  characters: Character[] 
  npcs: Npc[] 
  threats: Threat[]
  game?: Game;
}
// ------------------------------------------------- Player interfaces ------------------------------------------------- //

export interface Character {
  id: string
  playbook: PlayBooks
  statsBlock: CharacterStat[]
  hxBlock: HxStat[]
  gear: string[]
  looks: Look[]
  name?: string
  playbookUnique?: PlaybookUnique
  characterMoves?: CharacterMove[]
}

export interface CharacterStat {
  id: string
  stat: Stats
  value: number
  isHighlighted: Boolean
}

export interface HxStat {
  characterId: string
  characterName: string
  hxValue: number
}

export interface PlaybookUnique {
  id: string
  type: UniqueTypes
  brainerGear?: BrainerGear
  angelKit?: AngelKit
  customWeapons?: CustomWeapons
}

export interface BrainerGear {
  id: string
  brainerGear: string[]
}

export interface AngelKit {
  id: string
  description: string
  stock: number
  angelKitMoves: Move[]
  hasSupplier: boolean
  supplierText: string
}

export interface CustomWeapons {
  id: string
  weapons: string[]
}

// --------------------------------------------------- MC interfaces --------------------------------------------------- //

export interface Npc {
  id: string
  name: string
  description?: string
}

export interface Threat {
  id: string
  name: string
  threatKind: Threats
  impulse: string
  description?: string
  stakes?: string
}
