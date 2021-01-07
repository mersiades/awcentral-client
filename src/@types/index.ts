
import { LookCategories, MoveKinds, PlayBooks, Roles, Stats, Threats, UniqueTypes, WebsocketRequests, WebsocketResponses } from './enums';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface KeycloakUser {
  id?: string;
  username?: string;
  email?: string;
}

export interface Game {
  id: string;
  name: string;
  commsApp: string
  commsUrl: string
  mc: { displayName: string, id: string }
  players: { displayName: string, id: string }[]
  gameRoles: GameRole[]
  invitees: string[]
}

export interface GameContext {
  game?: Game;
  setGame: (game: Game) => void;
}

export interface Character {
  id: string
  name?: string
  playbook?: PlayBooks
  gear: string[]
  looks?: Look[]
  statsBlock: CharacterStat[]
  hxBlock: HxStat[]
  playbookUnique?: PlaybookUnique
  characterMoves?: CharacterMove[]
}

export interface GameRole {
  id: string;
  role: Roles;
  userId: string
  game?: Game;
  characters?: Character[]
  npcs?: Npc[]
  threats?: Threat[]
}

export interface PlaybookCreator {
  id: string
  playbookType: PlayBooks
  playbook?: Playbook
  gearInstructions: GearInstructions
  improvementInstructions: string
  movesInstructions: string
  hxInstructions: string
  names: Name[]
  looks: Look[]
  statsOptions: StatsOption[]
  playbookUniqueCreator: PlaybookUniqueCreator
  playbookMoves: CharacterMove[]
  defaultMoveCount: number
  moveChoiceCount: number
}

interface RequestBody {
  type: WebsocketRequests
}

export interface GameRequest extends RequestBody {
  id?: string
  userId?: string
  name?: string
  textChannelId?: string;
  voiceChannelId?: string;
}

interface ResponseBody {
  type: WebsocketResponses
}

export interface GameResponse extends ResponseBody {
  id?: string
  userId?: string
  name?: string
  textChannelId?: string;
  voiceChannelId?: string;
}

export interface Move {
  id: string
  name: string
  description: string
  kind: MoveKinds
  playbook: PlayBooks
  stat?: Stats
  statModifier?: StatModifier
  rollModifier?: RollModifier
}

export interface CharacterMove extends Move {
  isSelected: boolean;
}

export interface StatModifier {
  id: string
  statToModify: Stats
  modification: number
}

export interface RollModifier {
  id: string
  movesToModify: Move[]
  statToRollWith: Stats
}

export interface User {
  id: string
  userId: string
  gameRoles: GameRole[]
}

export interface Playbook {
  id: string
  playbookType: PlayBooks
  barterInstructions: string
  intro: string
  introComment: string
  playbookImageUrl: string
}

export interface Name {
  id: string
  name: string
}

export interface Look {
  id?: string
  look: string
  category: LookCategories
}

export interface StatsOption {
  id: string
  COOL: number
  HARD: number
  HOT: number
  SHARP: number
  WEIRD: number
}

export interface StatsBlock {
  id: string
  stats: CharacterStat[]
}

export interface HxStat {
  characterId: string
  characterName: string
  hxValue: number
}

export interface CharacterStat {
  id: string
  stat: Stats
    value: number
    isHighlighted: Boolean
}

export interface GearInstructions {
  id: string
  youGet: string
  youGetItems : string[]
  inAddition?: string
  introduceChoice: string
  numberCanChoose: number
  chooseableGear: string[]
  withMC: string
  startingBarter: number
}

export interface KeycloakUserInfo {
  email: string
email_verified: boolean
family_name: string
given_name: string
name: string
preferred_username: string
sub: string
}

export interface PlaybookUniqueCreator {
  id: string
  type: UniqueTypes
  angelKitCreator: AngelKitCreator
  customWeaponsCreator: CustomWeaponsCreator
  brainerGearCreator: BrainerGearCreator
}

export interface AngelKitCreator {
  id: string
  angelKitInstructions: string
  startingStock: number
}

export interface CustomWeaponsCreator {
  firearmsTitle: string
firearmsBaseInstructions: string
firearmsBaseOptions: TaggedItem[]
firearmsOptionsInstructions: string
firearmsOptionsOptions: ItemCharacteristic[]
handTitle: string
handBaseInstructions: string
handBaseOptions: TaggedItem[]
handOptionsInstructions: string
handOptionsOptions: ItemCharacteristic[]
}

export interface BrainerGearCreator {
  id: string
  gear: string[]
}

export interface TaggedItem {
  id: string
  description: string
  tags: string[]
}

export interface ItemCharacteristic {
  id: string
  description: string
  tag: string
}

export interface PlaybookUnique {
  id: string
  type: UniqueTypes
  brainerGear?: BrainerGear
  angelKit?: AngelKit
  customWeapons: CustomWeapons
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

export interface HxInput {
  characterId: string
  characterName: string
  hxValue: number
}

export interface Npc {
  id: string
  name: string
  description: string
}

export interface Threat {
  id: string
  name: string
  threatKind: Threats
  impulse: string
  description: string
  stakes: string
}