import { HxInput, KeycloakUser, KeycloakUserInfo } from '../@types';
import {
  AngelKit,
  BrainerGear,
  CharacterHarm,
  CharacterStat,
  CustomWeapons,
  Game,
  GameRole,
  HxStat,
  PlaybookUnique,
  StatsBlock,
  Vehicle,
  VehicleBattleOption,
} from '../@types/dataInterfaces';
import {
  BattleOptionType,
  LookType,
  MoveActionType,
  MoveType,
  PlaybookType,
  RoleType,
  RollType,
  StatType,
  UniqueTypes,
  VehicleFrameType,
} from '../@types/enums';
import {
  AngelKitCreator,
  CharacterMove,
  GearInstructions,
  HoldConditions,
  Look,
  Move,
  MoveAction,
  Name,
  Playbook,
  PlaybookCreator,
  PlaybookUniqueCreator,
  PlusOneForwardConditions,
  RollModifier,
  StatModifier,
  StatsOption,
} from '../@types/staticDataInterfaces';
import { ANGEL_SPECIAL_NAME, UNDER_FIRE_NAME } from '../config/constants';

// Same as Character, but with no nullable fields
interface MockCharacter {
  id: string;
  statsBlock: StatsBlock;
  hxBlock: HxStat[];
  gear: string[];
  looks: Look[]; // Does graphql return an empty array or undefined? // May need an id-less version of Look "EmbeddedLook"
  name: string;
  barter: number;
  playbook: PlaybookType;
  harm: CharacterHarm;
  hasCompletedCharacterCreation: boolean;
  playbookUnique: PlaybookUnique;
  characterMoves: CharacterMove[];
}

export const mockNewGameName = 'My new mock game';

export const dummyHoldConditions: HoldConditions = {
  id: 'dummy',
  onTenPlus: 3,
  onSevenToNine: 1,
  onMiss: 0,
};

export const dummyPlusOneForwardConditions: PlusOneForwardConditions = {
  id: 'dummy',
  isManualGrant: false,
  onTenPlus: false,
  onSevenToNine: false,
  onMiss: false,
};

export const dummyMoveAction: MoveAction = {
  id: 'dummy',
  actionType: MoveActionType.roll,
  rollType: RollType.stat,
  statToRollWith: StatType.hard,
  holdConditions: dummyHoldConditions,
  plusOneForwardConditions: dummyPlusOneForwardConditions,
};

export const mockKeycloakUserInfo1: KeycloakUserInfo = {
  email: 'mockUser1@email.com',
  email_verified: true,
  family_name: 'mock-family-name-1',
  given_name: 'mock-given-name-1',
  name: 'mock-name-1',
  preferred_username: 'mock-user-1',
  sub: 'mock-keycloak-id-1',
};

export const mockKeycloakUser1: KeycloakUser = {
  id: 'mock-keycloak-id-1',
  username: 'mock-user-1',
  email: 'mockUser1@email.com',
};

export const mockKeycloakUserInfo2: KeycloakUserInfo = {
  email: 'mockUser2@email.com',
  email_verified: true,
  family_name: 'mock-family-name-2',
  given_name: 'mock-given-name-2',
  name: 'mock-name-2',
  preferred_username: 'mock-user-2',
  sub: 'mock-keycloak-id-2',
};

export const mockKeycloakUser2: KeycloakUser = {
  id: 'mock-keycloak-id-2',
  username: 'mock-user-2',
  email: 'mockUser2@email.com',
};

export const mockKeycloakUser3: KeycloakUser = {
  id: 'mock-keycloak-id-3',
  username: 'mock-user-3',
  email: 'mockUser3@email.com',
};

export const mockStatsBlock1: StatsBlock = {
  id: 'mock-stats-block-id-1',
  statsOptionId: 'mock-stats-option-id-1',
  stats: [
    {
      id: 'mock-statsblock-stat-id-1',
      stat: StatType.cool,
      value: 1,
      isHighlighted: false,
    },
    {
      id: 'mock-statsblock-stat-id-2',
      stat: StatType.hard,
      value: 1,
      isHighlighted: false,
    },
    {
      id: 'mock-statsblock-stat-id-3',
      stat: StatType.hot,
      value: 1,
      isHighlighted: false,
    },
    {
      id: 'mock-statsblock-stat-id-4',
      stat: StatType.sharp,
      value: 1,
      isHighlighted: false,
    },
    {
      id: 'mock-statsblock-stat-id-5',
      stat: StatType.weird,
      value: 1,
      isHighlighted: false,
    },
  ],
};

export const mockStatsBlockWithHighlight: StatsBlock = {
  id: 'mock-stats-block-id-1',
  statsOptionId: 'mock-stats-option-id-1',
  stats: [
    {
      id: 'mock-statsblock-stat-id-1',
      stat: StatType.cool,
      value: 1,
      isHighlighted: true,
    },
    {
      id: 'mock-statsblock-stat-id-2',
      stat: StatType.hard,
      value: 1,
      isHighlighted: false,
    },
    {
      id: 'mock-statsblock-stat-id-3',
      stat: StatType.hot,
      value: 1,
      isHighlighted: false,
    },
    {
      id: 'mock-statsblock-stat-id-4',
      stat: StatType.sharp,
      value: 1,
      isHighlighted: false,
    },
    {
      id: 'mock-statsblock-stat-id-5',
      stat: StatType.weird,
      value: 1,
      isHighlighted: false,
    },
  ],
};

export const dummyRollModifier: RollModifier = {
  id: 'dummy',
  moveToModify: {
    id: 'dummy',
    name: 'dummy',
    description: 'dummy',
    kind: MoveType.basic,
    playbook: PlaybookType.angel,
  },
  statToRollWith: StatType.sharp,
};

export const dummyStatModifier: StatModifier = {
  id: 'dummy',
  statToModify: StatType.sharp,
  modification: 0,
};

export const mockCharacterMoveAngel1: CharacterMove = {
  id: 'angel-move-id-1',
  name: ANGEL_SPECIAL_NAME,
  description: 'If you and another character have sex,',
  kind: MoveType.default,
  playbook: PlaybookType.angel,
  stat: StatType.hx,
  rollModifier: dummyRollModifier,
  statModifier: dummyStatModifier,
  moveAction: dummyMoveAction,
  isSelected: true,
};

export const mockCharacterMoveAngel2: CharacterMove = {
  id: 'angel-move-id-2',
  name: 'SIXTH SENSE',
  kind: MoveType.character,
  description: 'when you open your brain to the world’s psychic maelstrom...',
  playbook: PlaybookType.angel,
  stat: StatType.sharp,
  rollModifier: dummyRollModifier,
  statModifier: dummyStatModifier,
  moveAction: dummyMoveAction,
  isSelected: false,
};

export const mockCharacterMoveAngel3: CharacterMove = {
  id: 'angel-move-id-3',
  name: 'INFIRMARY',
  description: 'you get an infirmary, a workspace with life support...',
  kind: MoveType.character,
  playbook: PlaybookType.angel,
  stat: StatType.sharp,
  rollModifier: dummyRollModifier,
  statModifier: dummyStatModifier,
  moveAction: dummyMoveAction,
  isSelected: false,
};

export const mockCharacterMoveAngel4: CharacterMove = {
  id: 'angel-move-id-4',
  name: 'PROFESSIONAL COMPASSION',
  description: 'you can roll+sharp instead of roll+Hx when you help someone who’s rolling.',
  kind: MoveType.character,
  playbook: PlaybookType.angel,
  stat: StatType.hx,
  rollModifier: dummyRollModifier,
  statModifier: dummyStatModifier,
  moveAction: dummyMoveAction,
  isSelected: false,
};

export const mockNameAngel1: Name = {
  id: 'mock-angel-name-id-1',
  name: 'Jay',
};

export const mockNameAngel2: Name = {
  id: 'mock-angel-name-id-2',
  name: 'Boo',
};

export const mockLookAngel1: Look = {
  id: 'mock-angel-look-id-1',
  look: 'man',
  category: LookType.gender,
};

export const mockLookAngel2: Look = {
  id: 'mock-angel-look-id-2',
  look: 'woman',
  category: LookType.gender,
};

export const mockLookAngel3: Look = {
  id: 'mock-angel-look-id-3',
  look: 'utility wear',
  category: LookType.clothes,
};

export const mockLookAngel4: Look = {
  id: 'mock-angel-look-id-4',
  look: 'casual wear plus utility',
  category: LookType.clothes,
};

export const mockLookAngel5: Look = {
  id: 'mock-angel-look-id-5',
  look: 'kind face',
  category: LookType.face,
};

export const mockLookAngel6: Look = {
  id: 'mock-angel-look-id-6',
  look: 'strong face',
  category: LookType.face,
};

export const mockLookAngel7: Look = {
  id: 'mock-angel-look-id-7',
  look: 'hard eyes',
  category: LookType.eyes,
};

export const mockLookAngel8: Look = {
  id: 'mock-angel-look-id-8',
  look: 'quick eyes',
  category: LookType.eyes,
};

export const mockLookAngel9: Look = {
  id: 'mock-angel-look-id-9',
  look: 'compact body',
  category: LookType.body,
};

export const mockLookAngel10: Look = {
  id: 'mock-angel-look-id-10',
  look: 'stout body',
  category: LookType.body,
};

export const mockLookBettleBabe1: Look = {
  id: 'mock-battlebabe-look-id-1',
  look: 'woman',
  category: LookType.gender,
};

export const mockLookBattlebabe2: Look = {
  id: 'mock-battlebabe-look-id-2',
  look: 'formal wear',
  category: LookType.clothes,
};

export const mockStatsOptionsAngel1: StatsOption = {
  id: 'angel-stats-options-1',
  COOL: 1,
  HARD: 0,
  HOT: 1,
  SHARP: 2,
  WEIRD: -1,
};

export const mockStatsOptionsAngel2: StatsOption = {
  id: 'angel-stats-options-2',
  COOL: 1,
  HARD: 1,
  HOT: 0,
  SHARP: 2,
  WEIRD: -1,
};

export const mockStatsOptionsAngel3: StatsOption = {
  id: 'angel-stats-options-3',
  COOL: -1,
  HARD: 1,
  HOT: 0,
  SHARP: 2,
  WEIRD: 1,
};

export const mockCustomWeapons: CustomWeapons = {
  id: 'mock-custom-weapons-id',
  weapons: ['custom weapon 1', 'custom weapons 2'],
};

export const dummyCustomWeapons: CustomWeapons = {
  id: 'dummy',
  weapons: ['dummy'],
};

export const dummyBrainerGear: BrainerGear = {
  id: 'dummy',
  brainerGear: ['dummy'],
};

export const dummyAngelKitMove: Move = {
  id: 'dummy',
  name: 'dummy',
  description: 'dummy',
  kind: MoveType.character,
  playbook: PlaybookType.angel,
  stat: StatType.cool,
  statModifier: dummyStatModifier,
  rollModifier: dummyRollModifier,
  moveAction: dummyMoveAction,
};

export const dummyAngelKit: AngelKit = {
  id: 'dummy',
  description: 'dummy',
  stock: 0,
  hasSupplier: false,
  supplierText: 'dummy',
  angelKitMoves: [dummyAngelKitMove],
};

export const mockVehicle1: Vehicle = {
  id: 'mock-vehicle-id-1',
  name: 'Mock Vehicle 1',
  vehicleFrame: {
    id: 'mock-vehicle-frame-id-1',
    frameType: VehicleFrameType.large,
    massive: 3,
    examples: 'Garbage truck, bus',
    battleOptionCount: 2,
  },
  speed: 0,
  handling: 1,
  massive: 3,
  armor: 1,
  battleOptions: [
    {
      id: 'mock-battle-option-id-1',
      battleOptionType: BattleOptionType.armor,
      name: '+1armor',
    },
    {
      id: 'mock-battle-option-id-1',
      battleOptionType: BattleOptionType.armor,
      name: '+1handling',
    },
  ],
  tags: ['fast', 'muscular', 'guzzler'],
};

export const mockVehicles: Vehicle[] = [mockVehicle1];

export const mockPlaybookUniqueBattlebabe: PlaybookUnique = {
  id: 'mock-battlebabe-unique-id',
  type: UniqueTypes.customWeapons,
  customWeapons: mockCustomWeapons,
  brainerGear: dummyBrainerGear,
  angelKit: dummyAngelKit,
  vehicles: mockVehicles,
};

export const mockAngelKit: AngelKit = {
  id: 'mock-angel-kit-id',
  description: 'Your angel kit has all kinds of crap in it...',
  stock: 6,
  hasSupplier: false,
  supplierText: 'mock-supplier-text',
  angelKitMoves: [dummyAngelKitMove],
};

export const mockPlaybookUniqueAngel: PlaybookUnique = {
  id: 'mock-angle-unique-id',
  type: UniqueTypes.angelKit,
  customWeapons: dummyCustomWeapons,
  brainerGear: dummyBrainerGear,
  angelKit: mockAngelKit,
  vehicles: mockVehicles,
};

export const mockCharacterHarm: CharacterHarm = {
  id: 'mock-character-harm-id-1',
  value: 0,
  isStabilized: false,
  hasComeBackHard: false,
  hasComeBackWeird: false,
  hasChangedPlaybook: false,
  hasDied: false,
};

export const mockCharacter1: MockCharacter = {
  id: 'mock-character-id-1',
  name: 'Mock Character 1',
  playbook: PlaybookType.battlebabe,
  hasCompletedCharacterCreation: false,
  gear: ['leather jacket', 'Timberland boots'],
  statsBlock: mockStatsBlock1,
  barter: 2,
  hxBlock: [],
  harm: mockCharacterHarm,
  looks: [mockLookBettleBabe1, mockLookBattlebabe2],
  characterMoves: [
    mockCharacterMoveAngel1,
    { ...mockCharacterMoveAngel2, isSelected: true },
    { ...mockCharacterMoveAngel3, isSelected: true },
  ], // TODO: change to battlebabe moves
  playbookUnique: mockPlaybookUniqueBattlebabe,
};

export const mockCharacter2: MockCharacter = {
  id: 'mock-character-id-2',
  name: 'Mock Character 2',
  playbook: PlaybookType.angel,
  hasCompletedCharacterCreation: false,
  gear: ['Grimey green raincoat', '9mm (2-harm close loud)'],
  statsBlock: mockStatsBlock1,
  barter: 2,
  hxBlock: [
    {
      characterId: mockCharacter1.id,
      characterName: mockCharacter1.name as string,
      hxValue: 1,
    },
  ],
  harm: { ...mockCharacterHarm, id: 'mock-character-harm-id-2' },
  looks: [mockLookAngel1, mockLookAngel3, mockLookAngel5, mockLookAngel7, mockLookAngel9],
  characterMoves: [
    { ...mockCharacterMoveAngel1, isSelected: true },
    { ...mockCharacterMoveAngel2, isSelected: true },
    { ...mockCharacterMoveAngel3, isSelected: true },
  ],
  playbookUnique: mockPlaybookUniqueAngel,
};

export const mockGame1: Game = {
  id: 'mock-game-id-1',
  name: 'Mock Game 1',
  commsApp: 'Discord',
  commsUrl: 'https://discord.com/urltodiscordchannel',
  hasFinishedPreGame: false,
  mc: { displayName: 'mock-user-1', id: 'mock-keycloak-id-1' },
  players: [{ displayName: 'mock-user-2', id: 'mock-keycloak-id-2' }],
  gameRoles: [
    {
      id: 'mock-gamerole-id-1',
      role: RoleType.mc,
      userId: 'mock-keycloak-id-1',
      characters: [],
      npcs: [],
      threats: [],
    },
    {
      id: 'mock-gamerole-id-3',
      role: RoleType.player,
      userId: 'mock-keycloak-id-2',
      characters: [],
      npcs: [],
      threats: [],
    },
  ],
  invitees: [],
  gameMessages: [],
};

export const mockGame2: Game = {
  id: 'mock-game-id-2',
  name: 'Mock Game 2',
  commsApp: 'Zoom',
  commsUrl: 'https://zoom.com/urltozoomchannel',
  hasFinishedPreGame: false,
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2' },
  players: [{ displayName: 'mock-user-1', id: 'mock-keycloak-id-1' }],
  gameRoles: [
    {
      id: 'mock-gamerole-id-2',
      role: RoleType.player,
      userId: 'mock-keycloak-id-1',
      characters: [],
      npcs: [],
      threats: [],
    },
    {
      id: 'mock-gamerole-id-4',
      role: RoleType.mc,
      userId: 'mock-keycloak-id-2',
      characters: [],
      npcs: [],
      threats: [],
    },
  ],
  invitees: [],
  gameMessages: [],
};

export const mockGame3: Game = {
  id: 'mock-game-id-3',
  name: mockNewGameName,
  commsApp: '',
  commsUrl: '',
  hasFinishedPreGame: false,
  mc: { displayName: 'mock-user-1', id: 'mock-keycloak-id-1' },
  players: [],
  gameRoles: [
    {
      id: 'mock-gamerole-id-5',
      role: RoleType.mc,
      userId: 'mock-keycloak-id-1',
      characters: [],
      npcs: [],
      threats: [],
    },
  ],
  invitees: [],
  gameMessages: [],
};

// mockgame4 is used to test joining a game
export const mockGame4: Game = {
  id: 'mock-game-id-4',
  name: 'Mock Game 4 - Join Me',
  commsApp: 'Discord',
  commsUrl: 'https://discord.com/urltodiscordchannel',
  hasFinishedPreGame: false,
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2' },
  players: [{ id: 'mock-keycloak-id-3', displayName: 'mock-user-3' }],
  gameRoles: [
    {
      id: 'mock-gamerole-id-6',
      role: RoleType.mc,
      userId: 'mock-keycloak-id-2',
      characters: [],
      npcs: [],
      threats: [],
    },
    {
      id: 'mock-gamerole-id-7',
      role: RoleType.player,
      userId: 'mock-keycloak-id-3',
      characters: [],
      npcs: [],
      threats: [],
    },
  ],
  invitees: ['mockUser1@email.com'],
  gameMessages: [],
};

// mockGame5 is a continuation of mockGame4, and is used for testing character creation
export const mockGame5: Game = {
  id: 'mock-game-id-5',
  name: 'Mock Game 5',
  commsApp: 'Discord',
  commsUrl: 'https://discord.com/urltodiscordchannel',
  hasFinishedPreGame: false,
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2' },
  players: [
    { id: 'mock-keycloak-id-3', displayName: 'mock-user-3' },
    { id: 'mock-keycloak-id-1', displayName: 'mock-user-1' },
  ],
  gameRoles: [
    {
      id: 'mock-gamerole-id-6',
      role: RoleType.mc,
      userId: 'mock-keycloak-id-2',
      npcs: [],
      threats: [],
      characters: [],
    },
    {
      id: 'mock-gamerole-id-7',
      role: RoleType.player,
      userId: 'mock-keycloak-id-3',
      npcs: [],
      threats: [],
      characters: [mockCharacter1],
    },
    {
      id: 'mock-gamerole-id-8',
      role: RoleType.player,
      userId: 'mock-keycloak-id-1',
      npcs: [],
      threats: [],
      characters: [],
    },
  ],
  invitees: [],
  gameMessages: [],
};

// Used for testing starting a game from the PreGamePage
export const mockGame6: Game = {
  id: 'mock-game-id-6',
  name: 'Mock Game 6',
  commsApp: 'Discord',
  commsUrl: 'https://discord.com/urltodiscordchannel',
  hasFinishedPreGame: false,
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2' },
  players: [
    { id: 'mock-keycloak-id-3', displayName: 'mock-user-3' },
    { id: 'mock-keycloak-id-1', displayName: 'mock-user-1' },
  ],
  gameRoles: [
    {
      id: 'mock-gamerole-id-6',
      role: RoleType.mc,
      userId: 'mock-keycloak-id-2',
      npcs: [],
      threats: [],
      characters: [],
    },
    {
      id: 'mock-gamerole-id-7',
      role: RoleType.player,
      userId: 'mock-keycloak-id-3',
      npcs: [],
      threats: [],
      characters: [{ ...mockCharacter1, hasCompletedCharacterCreation: true }],
    },
    {
      id: 'mock-gamerole-id-8',
      role: RoleType.player,
      userId: 'mock-keycloak-id-1',
      npcs: [],
      threats: [],
      characters: [{ ...mockCharacter2, hasCompletedCharacterCreation: true, hxBlock: [] }],
    },
  ],
  invitees: [],
  gameMessages: [],
};

// Used for testing PlayerPage, GamePanel
export const mockGame7: Game = {
  id: 'mock-game-id-7',
  name: 'Mock Game 7',
  invitees: [],
  commsApp: 'Discord',
  commsUrl: 'https://discord.com/urltodiscordchannel',
  hasFinishedPreGame: false,
  gameMessages: [],
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2' },
  players: [
    { id: 'mock-keycloak-id-3', displayName: 'mock-user-3' },
    { id: 'mock-keycloak-id-1', displayName: 'mock-user-1' },
  ],
  gameRoles: [
    {
      id: 'mock-gamerole-id-6',
      role: RoleType.mc,
      userId: 'mock-keycloak-id-2',
      npcs: [],
      threats: [],
      characters: [],
    },
    {
      id: 'mock-gamerole-id-7',
      role: RoleType.player,
      userId: 'mock-keycloak-id-3',
      npcs: [],
      threats: [],
      characters: [{ ...mockCharacter1, hasCompletedCharacterCreation: true }],
    },
    {
      id: 'mock-gamerole-id-8',
      role: RoleType.player,
      userId: 'mock-keycloak-id-1',
      npcs: [],
      threats: [],
      characters: [{ ...mockCharacter2, hasCompletedCharacterCreation: true }],
    },
  ],
};

export const mockGameRole1: GameRole = {
  id: 'mock-gamerole-id-1',
  role: RoleType.mc,
  userId: 'mock-keycloak-id-1',
  game: mockGame1,
  characters: [],
  npcs: [],
  threats: [],
};

export const mockGameRole2: GameRole = {
  id: 'mock-gamerole-id-2',
  role: RoleType.player,
  userId: 'mock-keycloak-id-1',
  game: mockGame2,
  characters: [],
  npcs: [],
  threats: [],
};

export const mockGameRole3: GameRole = {
  id: 'mock-gamerole-id-3',
  role: RoleType.player,
  userId: 'mock-keycloak-id-2',
  game: mockGame1,
  characters: [],
  npcs: [],
  threats: [],
};

export const mockGameRole4: GameRole = {
  id: 'mock-gamerole-id-4',
  role: RoleType.mc,
  userId: 'mock-keycloak-id-2',
  game: mockGame2,
  characters: [],
  npcs: [],
  threats: [],
};

export const mockgearInstructionsAngel: GearInstructions = {
  id: 'angel-gear-instructions-id',
  gearIntro: 'You get:',
  youGetItems: ['fashion suitable to your look, including at your option a piece worth 1-armor (you detail)'],
  introduceChoice: 'Small practical weapons',
  numberCanChoose: 1,
  chooseableGear: [
    '.38 revolver (2-harm close reload loud)',
    '9mm (2-harm close loud)',
    'big knife (2-harm hand)',
    'sawed-off (3-harm close reload messy)',
    'stun gun (s-harm hand reload)',
  ],
  withMC: 'If you’d like to start play with a vehicle or a prosthetic, get with the MC.',
  startingBarter: 2,
};

export const mockAngelKitCreator: AngelKitCreator = {
  id: 'angel-kit-creator-id',
  angelKitInstructions: 'Your angel kit has all kinds of crap in it...',
  startingStock: 6,
};

export const mockUniqueCreatorAngel: PlaybookUniqueCreator = {
  id: 'angel-playbook-unique-creator-id',
  type: UniqueTypes.angelKit,
  angelKitCreator: mockAngelKitCreator,
};

export const mockPlaybookCreatorAngel: PlaybookCreator = {
  id: 'angel-playbook-creator-id',
  playbookType: PlaybookType.angel,
  gearInstructions: mockgearInstructionsAngel,
  improvementInstructions: 'Whenever you roll a highlighted stat...',
  movesInstructions: 'You get all the basic moves. Choose 2 angel moves.',
  hxInstructions: 'Everyone introduces their characters by name, look and outlook...',
  names: [mockNameAngel1, mockNameAngel2],
  looks: [
    mockLookAngel1,
    mockLookAngel2,
    mockLookAngel3,
    mockLookAngel4,
    mockLookAngel5,
    mockLookAngel6,
    mockLookAngel7,
    mockLookAngel8,
    mockLookAngel9,
    mockLookAngel10,
  ],
  statsOptions: [mockStatsOptionsAngel1, mockStatsOptionsAngel2, mockStatsOptionsAngel3],
  playbookUniqueCreator: mockUniqueCreatorAngel,
  optionalMoves: [mockCharacterMoveAngel2, mockCharacterMoveAngel3, mockCharacterMoveAngel4],
  defaultMoves: [mockCharacterMoveAngel1],
  defaultMoveCount: 1,
  moveChoiceCount: 2,
};

export const mockPlaybookAngel: Playbook = {
  id: 'mock-playbook-angel-id',
  playbookType: PlaybookType.angel,
  barterInstructions: 'At the beginning of the session, spend 1- or 2-barter for your lifestyle.',
  intro: 'When you’re lying in the dust of Apocalypse World guts aspilled...',
  introComment: 'Angels are medics. If you want everybody to love you...',
  playbookImageUrl: 'https://awc-images.s3-ap-southeast-2.amazonaws.com/angel-white-transparent.png',
};

export const mockPlaybooks: Playbook[] = [mockPlaybookAngel];

export const mockHxInput: HxInput = {
  characterId: mockCharacter1.id,
  characterName: mockCharacter1.name as string,
  hxValue: 1,
};

// -------------------------------------- Static move mocks ------------------------------------- //

export const doSomethingUnderFire: Move = {
  id: 'mock-move-id-1',
  name: UNDER_FIRE_NAME,
  description: 'When you _**do something under fire**_, or dig in to endure fire, roll+cool.',
  kind: MoveType.basic,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  stat: StatType.cool,
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: {
    id: 'under-fire-id',
    actionType: MoveActionType.roll,
    rollType: RollType.stat,
    statToRollWith: StatType.cool,
    holdConditions: dummyHoldConditions,
    plusOneForwardConditions: dummyPlusOneForwardConditions,
  },
};

export const goAggro: Move = {
  id: 'mock-move-id-2',
  name: 'GO AGGRO ON SOMEONE',
  description:
    'When you _**go aggro on someone**_, make it clear what you want them to do and what you’ll do to them. Roll+hard.',
  kind: MoveType.basic,
  stat: StatType.hard,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: {
    id: 'aggro-id',
    actionType: MoveActionType.roll,
    rollType: RollType.stat,
    statToRollWith: StatType.hard,
    holdConditions: dummyHoldConditions,
    plusOneForwardConditions: dummyPlusOneForwardConditions,
  },
};

export const sucker: Move = {
  id: 'mock-move-id-3',
  name: 'SUCKER SOMEONE',
  description: 'When you _**attack someone unsuspecting or helpless**_, ask the MC if you could miss.',
  kind: MoveType.basic,
  stat: StatType.cool, // Apollo MockProvider won't allow undefined here
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};

export const sufferHarm: Move = {
  id: 'mock-move-id-4',
  name: 'SUFFER HARM',
  description: 'When you _**suffer harm**_, roll+harm suffered (after armor, if you’re wearing any).',
  kind: MoveType.peripheral,
  stat: StatType.cool, // Apollo MockProvider won't allow undefined here
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};

export const goToMarket: Move = {
  id: 'mock-move-id-5',
  name: 'GO TO THE MARKET',
  description:
    'When you _**go into a holding’s bustling market**_, looking for some particular thing to buy, and it’s not obvious whether you should be able to just go buy one like that, roll+sharp.',
  kind: MoveType.peripheral,
  stat: StatType.sharp,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};

export const augury: Move = {
  id: 'mock-move-id-6',
  name: 'AUGURY',
  description: 'When you are able to use something for _**augury**_, roll+weird.',
  kind: MoveType.peripheral,
  stat: StatType.weird,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};

export const exchangeHarm: Move = {
  id: 'mock-move-id-7',
  name: 'EXCHANGE HARM',
  description: 'When you _**exchange harm**_, both sides simultaneously inflict and suffer harm as established:',
  kind: MoveType.battle,
  stat: StatType.cool, // Apollo MockProvider won't allow undefined here
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};

export const seizeByForce: Move = {
  id: 'mock-move-id-8',
  name: 'SEIZE BY FORCE',
  description: 'To _**seize something by force**_, exchange harm, but first roll+hard.',
  kind: MoveType.battle,
  stat: StatType.hard,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};
export const standOverwatch: Move = {
  id: 'mock-move-id-9',
  name: 'STAND OVERWATCH',
  description: 'When you _**stand overwatch**_ for an ally, roll+cool. ',
  kind: MoveType.battle,
  stat: StatType.cool,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};

export const boardAMovingVehicle: Move = {
  id: 'mock-move-id-10',
  name: 'BOARD A MOVING VEHICLE',
  description:
    'To _**board a moving vehicle**_, roll+cool, minus its speed. To board one moving vehicle from another, roll+cool, minus the difference between their speeds.',
  kind: MoveType.roadWar,
  stat: StatType.cool,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};

export const dealWithBadTerrain: Move = {
  id: 'mock-move-id-11',
  name: 'DEAL WITH BAD TERRAIN',
  description: 'When you have to _**deal with bad terrain**_, roll+cool, plus your vehicle’s handling.',
  kind: MoveType.roadWar,
  stat: StatType.cool,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};
export const shoulderAnotherVehicle: Move = {
  id: 'mock-move-id-12',
  name: 'SHOULDER ANOTHER VEHICLE',
  description:
    'To _**shoulder another vehicle**_, roll+cool. On a hit, you shoulder it aside, inflicting v-harm as established.',
  kind: MoveType.roadWar,
  stat: StatType.cool,
  playbook: PlaybookType.angel, // Apollo MockProvider won't allow undefined here
  statModifier: undefined,
  rollModifier: undefined,
  moveAction: dummyMoveAction,
};

export const mockAllMovesArray = [
  doSomethingUnderFire,
  goAggro,
  sucker,
  sufferHarm,
  goToMarket,
  augury,
  exchangeHarm,
  seizeByForce,
  standOverwatch,
  boardAMovingVehicle,
  dealWithBadTerrain,
  shoulderAnotherVehicle,
];
