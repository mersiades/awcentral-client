import { Character, Game, GameRole, KeycloakUser, KeycloakUserInfo } from "../@types";
import { LookCategories, MoveKinds, PlayBooks, Roles, Stats, UniqueTypes } from "../@types/enums";

export const mockNewGameName = 'My new mock game'

export const mockKeycloakUserInfo: KeycloakUserInfo = {
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
  email: 'mockUser1@email.com'
}

export const mockKeycloakUser2: KeycloakUser = {
  id: 'mock-keycloak-id-2',
  username: 'mock-user-2',
  email: 'mockUser2@email.com'
}

export const mockKeycloakUser3: KeycloakUser = {
  id: 'mock-keycloak-id-3',
  username: 'mock-user-3',
  email: 'mockUser3@email.com'
}

export const mockStatsBlock1 = [
  {
    id: 'mock-statsblock-stat-id-1',
    stat: Stats.cool,
    value: 1,
    isHighlighted: false,
  },
  {
    id: 'mock-statsblock-stat-id-2',
    stat: Stats.hard,
    value: 1,
    isHighlighted: false,
  },
  {
    id: 'mock-statsblock-stat-id-3',
    stat: Stats.hot,
    value: 1,
    isHighlighted: false,
  },
  {
    id: 'mock-statsblock-stat-id-4',
    stat: Stats.sharp,
    value: 1,
    isHighlighted: false,
  },
  {
    id: 'mock-statsblock-stat-id-5',
    stat: Stats.weird,
    value: 1,
    isHighlighted: false,
  },
]

export const mockCharacterMoveAngel1 = {
  id: 'angel-move-id-1',
  name: "SIXTH SENSE",
  kind: MoveKinds.character,
  description: "when you open your brain to the world’s psychic maelstrom...",
  playbook: PlayBooks.angel,
  stat: Stats.sharp,
  rollModifier: {
    id: 'dummy',
    movesToModify: [
      {
        id: 'dummy',
        name: 'dummy',
        description: 'dummy',
        kind: MoveKinds.basic,
        playbook: PlayBooks.angel
      }
    ],
    statToRollWith: Stats.sharp
  },
  statModifier: {
    id: "dummy",
    statToModify: Stats.sharp,
    modification: 0
  },
  isSelected: false
}

export const mockCharacterMoveAngel2 = {
  id: 'angel-move-id-2',
  name: "INFIRMARY",
  description: "you get an infirmary, a workspace with life support...",
  kind: MoveKinds.character,
  playbook: PlayBooks.angel,
  stat: Stats.sharp,
  rollModifier: {
    id: 'dummy',
    movesToModify: [
      {
        id: 'dummy',
        name: 'dummy',
        description: 'dummy',
        kind: MoveKinds.basic,
        playbook: PlayBooks.angel
      }
    ],
    statToRollWith: Stats.sharp,
  },
  statModifier: {
    id: "dummy",
    statToModify: Stats.sharp,
    modification: 0
  },
  isSelected: false
}

export const mockCharacterMoveAngel3 = {
  id: 'angel-move-id-3',
  name: "PROFESSIONAL COMPASSION",
  description: "you can roll+sharp instead of roll+Hx when you help someone who’s rolling.",
  kind: MoveKinds.character,
  playbook: PlayBooks.angel,
  stat: "dummy",
  rollModifier: {
    id: 'mock roll-modifier-id-1',
    movesToModify: [{
      id: 'open-your-brain-move-id',
      name: "OPEN YOUR BRAIN",
      description: "Open your brain to the maelstrom",
      kid: MoveKinds.basic,
      playbook: PlayBooks.angel
    }],
    statToRollWith: Stats.sharp
  },
  statModifier: {
    id: "dummy",
    statToModify: Stats.sharp,
    modification: 0
  },
  isSelected: false
}

export const mockNameAngel1 = {
  id: 'mock-angel-name-id-1',
  name: "Jay"
}

export const mockNameAngel2 = {
  id: 'mock-angel-name-id-2',
  name: "Boo"
}

export const mockLookAngel1 = {
  id: 'mock-angel-look-id-1',
  look: 'man',
  category: LookCategories.gender
}

export const mockLookAngel2 = {
  id: 'mock-angel-look-id-2',
  look: 'man',
  category: LookCategories.gender
}

export const mockLookAngel3 = {
  id: 'mock-angel-look-id-3',
  look: "utility wear",
  category: LookCategories.clothes
}

export const mockLookAngel4 = {
  id: 'mock-angel-look-id-4',
  look: "casual wear plus utility",
  category: LookCategories.clothes
}

export const mockLookAngel5 = {
  id: 'mock-angel-look-id-5',
  look: "kind face",
  category: LookCategories.face
}

export const mockLookAngel6 = {
  id: 'mock-angel-look-id-6',
  look: "strong face",
  category: LookCategories.face
}

export const mockLookAngel7 = {
  id: 'mock-angel-look-id-7',
  look: "hard eyes",
  category: LookCategories.eyes
}

export const mockLookAngel8 = {
  id: 'mock-angel-look-id-8',
  look: "quick eyes",
  category: LookCategories.eyes
}

export const mockLookAngel9 = {
  id: 'mock-angel-look-id-9',
  look: "compact body",
  category: LookCategories.body
}

export const mockLookAngel10 = {
  id: 'mock-angel-look-id-10',
  look: 'stout body',
  category: LookCategories.body
}

export const mockStatsOptionsAngel1 = {
  id: 'angel-stats-options-1',
  COOL: 1,
  HARD: 0,
  HOT: 1,
  SHARP: 2,
  WEIRD: -1,
}

export const mockStatsOptionsAngel2 = {
  id: 'angel-stats-options-2',
  COOL: 1,
  HARD: 1,
  HOT: 0,
  SHARP: 2,
  WEIRD: -1,
}

export const mockStatsOptionsAngel3 = {
  id: 'angel-stats-options-3',
  COOL: -1,
  HARD: 1,
  HOT: 0,
  SHARP: 2,
  WEIRD: 1,
}

export const mockCharacter1: Character = {
  id: 'mock-character-id-1',
  name: "Mock Character 1",
  playbook: PlayBooks.battlebabe,
  gear: ['leather jacket', 'Timberland boots'],
  statsBlock: mockStatsBlock1,
  hxBlock: [],
  looks: [
    {
      look: mockLookAngel1.look, // TODO: change to battlebabe looks
      category: mockLookAngel1.category
    },
    {
      look: mockLookAngel3.look,
      category: mockLookAngel3.category
    }
  ],
  characterMoves: [ mockCharacterMoveAngel1, mockCharacterMoveAngel2 ]
}

export const mockCharacter2: Character = {
  id: 'mock-character-id-2',
  name: "Mock Character 2",
  playbook: PlayBooks.angel,
  gear: ['9mm (2-harm close loud)', 'Grimey green raincoat'],
  statsBlock: mockStatsBlock1,
  hxBlock: [],
  looks: [
    {
      look: mockLookAngel1.look,
      category: mockLookAngel1.category
    },
    {
      look: mockLookAngel3.look,
      category: mockLookAngel3.category
    }
  ],
  characterMoves: [ {...mockCharacterMoveAngel1, isSelected: true}, {...mockCharacterMoveAngel2, isSelected: false} ]
} 

export const mockGame1: Game = {
  id: 'mock-game-id-1',
  name: 'Mock Game 1',
  commsApp: 'Discord',
  commsUrl: 'https://discord.com/urltodiscordchannel',
  mc: { displayName: 'mock-user-1', id: 'mock-keycloak-id-1'},
  players: [{ displayName: 'mock-user-2', id: 'mock-keycloak-id-2'}],
  gameRoles: [{
    id: "mock-gamerole-id-1",
    role: Roles.mc,
    userId: 'mock-keycloak-id-1',
  }, {
    id: "mock-gamerole-id-3",
    role: Roles.player,
    userId: 'mock-keycloak-id-2',
  }],
  invitees: []
}

export const mockGame2: Game = {
  id: 'mock-game-id-2',
  name: 'Mock Game 2',
  commsApp: 'Zoom',
  commsUrl: 'https://zoom.com/urltozoomchannel',
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2'},
  players: [{ displayName: 'mock-user-1', id: 'mock-keycloak-id-1'}],
  gameRoles: [{
    id: "mock-gamerole-id-2",
    role: Roles.player,
    userId: 'mock-keycloak-id-1'
  }, {
    id: "mock-gamerole-id-4",
    role: Roles.mc,
    userId: 'mock-keycloak-id-2'
  }],
  invitees: []
}

export const mockGame3: Game = {
  id: 'mock-game-id-3',
  name: mockNewGameName,
  commsApp: "",
  commsUrl: "",
  mc: { displayName: 'mock-user-1', id: 'mock-keycloak-id-1'},
  players: [],
  gameRoles: [{
    id: "mock-gamerole-id-5",
    role: Roles.mc,
    userId: 'mock-keycloak-id-1'
  }],
  invitees: []
}

// mockgame4 is used to test joinging a game
export const mockGame4: Game = {
  id: 'mock-game-id-4',
  name: "Mock Game 4 - Join Me",
  commsApp: "Discord",
  commsUrl: "https://discord.com/urltodiscordchannel",
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2'},
  players: [{ id: 'mock-keycloak-id-3', displayName: 'mock-user-3'}],
  gameRoles: [
    {
    id: "mock-gamerole-id-6",
    role: Roles.mc,
    userId: 'mock-keycloak-id-2'
    },
    {
      id: "mock-gamerole-id-7",
      role: Roles.player,
      userId: 'mock-keycloak-id-3'
    },
  ],
  invitees: ['mockUser1@email.com']
}

// mockGame5 is a continuation of mockGame4, and is used for testing character creation
export const mockGame5: Game = {
  id: 'mock-game-id-5',
  name: "Mock Game 5",
  commsApp: "Discord",
  commsUrl: "https://discord.com/urltodiscordchannel",
  mc: { displayName: 'mock-user-2', id: 'mock-keycloak-id-2'},
  players: [{ id: 'mock-keycloak-id-3', displayName: 'mock-user-3'}, { id: 'mock-keycloak-id-1', displayName: 'mock-user-1'} ],
  gameRoles: [
    {
      id: "mock-gamerole-id-6",
      role: Roles.mc,
      userId: 'mock-keycloak-id-2',
      npcs: [],
      threats: [],
      characters: []
    },
    {
      id: "mock-gamerole-id-7",
      role: Roles.player,
      userId: 'mock-keycloak-id-3',
      npcs: [],
      threats: [],
      characters: [
        mockCharacter1
      ]
    },
    {
      id: "mock-gamerole-id-8",
      role: Roles.player,
      userId: 'mock-keycloak-id-1',
      npcs: [],
      threats: [],
      characters: []
    },
  ],
  invitees: []
}

export const mockGameRole1: GameRole = {
  id: "mock-gamerole-id-1",
  role: Roles.mc,
  userId: 'mock-keycloak-id-1',
  game: mockGame1
}

export const mockGameRole2: GameRole = {
  id: "mock-gamerole-id-2",
  role: Roles.player,
  userId: 'mock-keycloak-id-1',
  game: mockGame2
}

export const mockGameRole3: GameRole = {
  id: "mock-gamerole-id-3",
  role: Roles.player,
  userId: 'mock-keycloak-id-2',
  game: mockGame1
}

export const mockGameRole4: GameRole = {
  id: "mock-gamerole-id-4",
  role: Roles.mc,
  userId: 'mock-keycloak-id-2',
  game: mockGame2
}

export const mockgearInstructionsAngel = {
  id: "angel-gear-instructions-id",
  youGet: "You get:",
  youGetItems: ["fashion suitable to your look, including at your option a piece worth 1-armor (you detail)"],
  inAddition: "dummy",
  introduceChoice: "Small practical weapons",
  numberCanChoose: 1,
  chooseableGear: [".38 revolver (2-harm close reload loud)",
  "9mm (2-harm close loud)",
  "big knife (2-harm hand)",
  "sawed-off (3-harm close reload messy)",
  "stun gun (s-harm hand reload)"],
  withMC: "If you’d like to start play with a vehicle or a prosthetic, get with the MC.",
  startingBarter: 2
}

export const mockAngelKitCreator = {
  id: 'angel-kit-creator-id',
  angelKitInstructions: 'Your angel kit has all kinds of crap in it...',
  startingStock: 6
}

export const mockUniqueCreatorAngel = {
  id: 'angel-playbook-unique-creator-id',
  type: UniqueTypes.angelKit,
  angelKitCreator: mockAngelKitCreator
}



export const mockPlaybookCreatorAngel = {
  id: 'angel-playbook-creator-id',
  playbookType: PlayBooks.angel,
  gearInstructions: mockgearInstructionsAngel,
  improvementInstructions: "Whenever you roll a highlighted stat...",
  movesInstructions: "You get all the basic moves. Choose 2 angel moves.",
  hxInstructions: "Everyone introduces their characters by name, look and outlook...",
  names: [mockNameAngel1, mockNameAngel2],
  looks: [mockLookAngel1, mockLookAngel2, mockLookAngel3, mockLookAngel4, mockLookAngel5,
          mockLookAngel6, mockLookAngel7, mockLookAngel8, mockLookAngel9, mockLookAngel10],
  statsOptions: [mockStatsOptionsAngel1, mockStatsOptionsAngel2, mockStatsOptionsAngel3],
  playbookUniqueCreator: mockUniqueCreatorAngel,
  playbookMoves: [mockCharacterMoveAngel1, mockCharacterMoveAngel2, mockCharacterMoveAngel3],
  defaultMoveCount: 1,
  moveChoiceCount: 2
}

export const mockPlaybookAngel = {
  id: 'mock-playbook-angel-id',
  playbookType: PlayBooks.angel,
  barterInstructions: 'At the beginning of the session, spend 1- or 2-barter for your lifestyle.',
  intro: "When you’re lying in the dust of Apocalypse World guts aspilled...",
  introComment: "Angels are medics. If you want everybody to love you...",
  playbookImageUrl: "https://awc-images.s3-ap-southeast-2.amazonaws.com/angel-white-transparent.png"
}

export const mockPlaybooks = [mockPlaybookAngel]