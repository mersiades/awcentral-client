import { MockedResponse } from '@apollo/client/testing';
import { PlaybookType, RoleType, StatType } from '../@types/enums';
import ADD_COMMS_APP from '../mutations/addCommsApp';
import ADD_COMMS_URL from '../mutations/addCommsUrl';
import ADD_INVITEE from '../mutations/addInvitee';
import ADD_USER_TO_GAME from '../mutations/addUserToGame';
import CREATE_CHARACTER from '../mutations/createCharacter';
import CREATE_GAME from '../mutations/createGame';
import DELETE_GAME from '../mutations/deleteGame';
import FINISH_CHARACTER_CREATION from '../mutations/finishCharacterCreation';
import FINISH_PRE_GAME from '../mutations/finishPreGame';
import REMOVE_INVITEE from '../mutations/removeInvitee';
import SET_ANGEL_KIT from '../mutations/setAngelKit';
import SET_CHARACTER_BARTER from '../mutations/setCharacterBarter';
import SET_CHARACTER_GEAR from '../mutations/setCharacterGear';
import SET_CHARACTER_HX from '../mutations/setCharacterHx';
import SET_CHARACTER_LOOK from '../mutations/setCharacterLook';
import SET_CHARACTER_MOVES from '../mutations/setCharacterMoves';
import SET_CHARACTER_NAME from '../mutations/setCharacterName';
import SET_CHARACTER_PLAYBOOK from '../mutations/setCharacterPlaybook';
import SET_CHARACTER_STATS from '../mutations/setCharacterStats';
import SET_GAME_NAME from '../mutations/setGameName';
import SET_VEHICLE from '../mutations/setVehicle';
import TOGGLE_STAT_HIGHLIGHT from '../mutations/toggleStatHighlight';
import ALL_MOVES from '../queries/allMoves';
import GAME from '../queries/game';
import GAMEROLES_BY_USER_ID from '../queries/gameRolesByUserId';
import GAMES_FOR_INVITEE from '../queries/gamesForInvitee';
import PLAYBOOK from '../queries/playbook';
import PLAYBOOK_CREATOR from '../queries/playbookCreator';
import PLAYBOOKS from '../queries/playbooks';
import VEHICLE_CREATOR from '../queries/vehicleCreator';
import {
  dummyAngelKitMove,
  mockAllMovesArray,
  mockCharacter2,
  mockCharacterMoveAngel1,
  mockCharacterMoveAngel2,
  mockCharacterMoveAngel4,
  mockGame1,
  mockGame2,
  mockGame3,
  mockGame4,
  mockGame5,
  mockGame6,
  mockGame7,
  mockGameRole1,
  mockGameRole2,
  mockHxInput,
  mockKeycloakUser1,
  mockKeycloakUser2,
  mockLookAngel1,
  mockLookAngel10,
  mockLookAngel2,
  mockLookAngel3,
  mockLookAngel4,
  mockLookAngel5,
  mockLookAngel6,
  mockLookAngel7,
  mockLookAngel8,
  mockLookAngel9,
  mockNameAngel1,
  mockNameAngel2,
  mockNewGameName,
  mockStatsBlockWithHighlight,
  mockVehicleInput,
  mockPlaybookAngel,
  mockPlaybookCreatorAngel,
  mockPlaybooks,
  mockgearInstructionsAngel,
  mockStatsOptionsAngel1,
  mockStatsOptionsAngel2,
  mockStatsOptionsAngel3,
  mockUniqueCreatorAngel,
  mockUniqueCreatorBrainer,
  mockVehicleCreator,
} from './mocks';

export const mockGameRolesByUserId: MockedResponse = {
  request: {
    query: GAMEROLES_BY_USER_ID,
    variables: { id: mockKeycloakUser1.id },
  },
  result: {
    data: {
      gameRolesByUserId: [
        {
          id: mockGameRole1.id,
          role: mockGameRole1.role,
          game: {
            id: mockGame1.id,
            name: mockGame1.name,
          },
          characters: [],
        },
        {
          id: mockGameRole2.id,
          role: mockGameRole2.role,
          game: {
            id: mockGame2.id,
            name: mockGame2.name,
          },
          characters: [],
        },
      ],
    },
  },
};

export const mockCreateGame: MockedResponse = {
  request: {
    query: CREATE_GAME,
    variables: {
      userId: mockKeycloakUser1.id,
      name: mockNewGameName,
      displayName: mockKeycloakUser1.username,
      email: mockKeycloakUser1.email,
    },
  },
  result: {
    data: {
      createGame: {
        id: mockGame3.id,
        name: mockGame3.name,
        mc: mockGame3.mc,
        players: mockGame3.players,
        gameRoles: mockGame3.gameRoles,
      },
    },
  },
};

export const mockGameForNewGame: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: mockGame3.commsApp,
        commsUrl: mockGame3.commsUrl,
        hasFinishedPreGame: false,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
        players: [],
        gameRoles: [
          {
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: [],
          },
        ],
      },
    },
  },
};

export const mockAddCommsApp: MockedResponse = {
  request: {
    query: ADD_COMMS_APP,
    variables: { gameId: mockGame3.id, app: 'Discord' },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: 'Discord',
        commsUrl: mockGame3.commsUrl,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
      },
    },
  },
};

export const mockGameAfterAddCommsApp: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: 'Discord',
        commsUrl: mockGame3.commsUrl,
        hasFinishedPreGame: false,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
        players: [],
        gameRoles: [
          {
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: [],
          },
        ],
      },
    },
  },
};

export const mockAddCommsUrl: MockedResponse = {
  request: {
    query: ADD_COMMS_URL,
    variables: { gameId: mockGame3.id, url: 'https://discord.com/urltodiscordchannel' },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: 'Discord',
        commsUrl: 'https://discord.com/urltodiscordchannel',
        hasFinishedPreGame: false,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
      },
    },
  },
};

export const mockGameAfterAddCommsUrl: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: mockGame3.invitees,
        commsApp: 'Discord',
        commsUrl: 'https://discord.com/urltodiscordchannel',
        hasFinishedPreGame: false,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
        players: [],
        gameRoles: [
          {
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: [],
          },
        ],
      },
    },
  },
};

export const mockAddInvitee1: MockedResponse = {
  request: {
    query: ADD_INVITEE,
    variables: { gameId: mockGame3.id, email: 'mockUser2@email.com' },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: ['mockUser2@email.com'],
        commsApp: 'Discord',
        commsUrl: 'https://discord.com/urltodiscordchannel',
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
        players: [],
        gameRoles: [
          {
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: [],
          },
        ],
      },
    },
  },
};

export const mockGameAfterAddInvitee1: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: ['mockUser2@email.com'],
        commsApp: 'Discord',
        commsUrl: 'https://discord.com/urltodiscordchannel',
        hasFinishedPreGame: false,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
        players: [],
        gameRoles: [
          {
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: [],
          },
        ],
      },
    },
  },
};

export const mockAddInvitee2: MockedResponse = {
  request: {
    query: ADD_INVITEE,
    variables: { gameId: mockGame3.id, email: 'mockUser3@email.com' },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: ['mockUser2@email.com', 'mockUser3@email.com'],
        commsApp: 'Discord',
        commsUrl: 'https://discord.com/urltodiscordchannel',
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
        players: [],
        gameRoles: [
          {
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: [],
          },
        ],
      },
    },
  },
};

export const mockGameAfterAddInvitee2: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame3.id },
  },
  result: {
    data: {
      game: {
        id: mockGame3.id,
        name: mockGame3.name,
        invitees: ['mockUser2@email.com', 'mockUser3@email.com'],
        commsApp: 'Discord',
        commsUrl: 'https://discord.com/urltodiscordchannel',
        hasFinishedPreGame: false,
        mc: {
          id: mockGame3.mc.id,
          displayName: mockGame3.mc.displayName,
        },
        players: [],
        gameRoles: [
          {
            id: mockGame3.gameRoles[0].id,
            role: mockGame3.gameRoles[0].role,
            userId: mockGame3.gameRoles[0].userId,
            npcs: [],
            threats: [],
            characters: [],
          },
        ],
      },
    },
  },
};

export const mockGamesForInvitee: MockedResponse = {
  request: {
    query: GAMES_FOR_INVITEE,
    variables: { email: mockKeycloakUser1.email },
  },
  result: {
    data: {
      gamesForInvitee: [
        {
          id: mockGame4.id,
          name: mockGame4.name,
          mc: mockGame4.mc,
          players: mockGame4.players,
        },
      ],
    },
  },
};

export const mockAddUserToGame: MockedResponse = {
  request: {
    query: ADD_USER_TO_GAME,
    variables: {
      userId: mockKeycloakUser1.id,
      displayName: mockKeycloakUser1.username,
      email: mockKeycloakUser1.email,
      gameId: mockGame4.id,
    },
  },
  result: {
    data: {
      addUserToGame: [
        {
          id: mockGame4.id,
          name: mockGame4.name,
          mc: {
            displayName: mockGame4.mc.displayName,
          },
          players: [{ displayName: mockGame4.players[0].displayName }],
          gameRoles: [
            ...mockGame4.gameRoles,
            {
              id: 'mock-gamerole-id-8',
              role: RoleType.player,
              userId: 'mock-keycloak-id-1',
            },
          ],
        },
      ],
    },
  },
};

export const mockGameForCharacterCreation1: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation1');
    return {
      data: {
        game: {
          id: mockGame5.id,
          name: mockGame5.name,
          invitees: [],
          commsApp: mockGame5.commsApp,
          commsUrl: mockGame5.commsUrl,
          hasFinishedPreGame: mockGame5.hasFinishedPreGame,
          mc: mockGame5.mc,
          players: mockGame5.players,
          gameRoles: mockGame5.gameRoles,
        },
      },
    };
  },
};

export const mockPlaybooksQuery: MockedResponse = {
  request: {
    query: PLAYBOOKS,
  },
  result: () => {
    // console.log('mockPlaybooksQuery');
    return {
      data: {
        playbooks: mockPlaybooks,
      },
    };
  },
};

export const mockCreateCharacter: MockedResponse = {
  request: {
    query: CREATE_CHARACTER,
    variables: { gameRoleId: mockGame5.gameRoles[2].id },
  },
  result: () => {
    // console.log('mockCreateCharacter');
    return {
      data: {
        createCharacter: {
          id: mockCharacter2.id,
        },
      },
    };
  },
};

export const mockSetCharacterPlaybook: MockedResponse = {
  request: {
    query: SET_CHARACTER_PLAYBOOK,
    variables: { gameRoleId: mockGame5.gameRoles[2].id, characterId: mockCharacter2.id, playbookType: PlaybookType.angel },
  },
  result: () => {
    // console.log('mockSetCharacterPlaybook');
    return {
      data: {
        setCharacterPlaybook: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: '',
          gear: [],
          looks: [],
        },
      },
    };
  },
};

export const mockGameForCharacterCreation2: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation2');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: '',
                  gear: [],
                  statsBlock: {
                    id: '',
                    statsOptionId: '',
                    stats: [],
                  },
                  hxBlock: [],
                  looks: [],
                  hasCompletedCharacterCreation: false,
                  characterMoves: [],
                  barter: 0,
                  harm: mockCharacter2.harm,
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockPlaybookCreator: MockedResponse = {
  request: {
    query: PLAYBOOK_CREATOR,
    variables: { playbookType: PlaybookType.angel },
  },
  result: () => {
    // console.log('mockPlaybookCreator');
    return {
      data: {
        playbookCreator: {
          id: mockPlaybookCreatorAngel.id,
          playbookType: mockPlaybookCreatorAngel.playbookType,
          gearInstructions: mockPlaybookCreatorAngel.gearInstructions,
          improvementInstructions: mockPlaybookCreatorAngel.improvementInstructions,
          movesInstructions: mockPlaybookCreatorAngel.movesInstructions,
          hxInstructions: mockPlaybookCreatorAngel.hxInstructions,
          looks: mockPlaybookCreatorAngel.looks,
          names: mockPlaybookCreatorAngel.names,
          statsOptions: mockPlaybookCreatorAngel.statsOptions,
          defaultMoveCount: mockPlaybookCreatorAngel.defaultMoveCount,
          moveChoiceCount: mockPlaybookCreatorAngel.moveChoiceCount,
          playbookMoves: mockPlaybookCreatorAngel.optionalMoves,
          playbookUniqueCreator: {
            id: mockPlaybookCreatorAngel.playbookUniqueCreator?.id,
            type: mockPlaybookCreatorAngel.playbookUniqueCreator?.type,
            angelKitCreator: mockPlaybookCreatorAngel.playbookUniqueCreator?.angelKitCreator,
            customWeaponsCreator: {
              id: 'dummy',
              firearmsTitle: 'dummy',
              firearmsBaseInstructions: 'dummy',
              firearmsBaseOptions: {
                id: 'dummy',
                description: 'dummy',
                tags: ['dummy'],
              },
              firearmsOptionsInstructions: 'dummy',
              firearmsOptionsOptions: {
                id: 'dummy',
                description: 'dummy',
                tag: 'dummy',
              },
              handTitle: 'dummy',
              handBaseInstructions: 'dummy',
              handBaseOptions: {
                id: 'dummy',
                description: 'dummy',
                tags: 'dummy',
              },
              handOptionsInstructions: 'dummy',
              handOptionsOptions: {
                id: 'dummy',
                description: 'dummy',
                tag: 'dummy',
              },
            },
            brainerGearCreator: {
              id: 'dummy',
              gear: ['dummy'],
            },
          },
        },
      },
    };
  },
};

export const mockSetCharacterName: MockedResponse = {
  request: {
    query: SET_CHARACTER_NAME,
    variables: { gameRoleId: mockGame5.gameRoles[2].id, characterId: mockCharacter2.id, name: mockCharacter2.name },
  },
  result: () => {
    // console.log('mockSetCharacterName');
    return {
      data: {
        setCharacterName: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          gear: [],
          looks: [],
        },
      },
    };
  },
};

export const mockGameForCharacterCreation3: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation3');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: [],
                  statsBlock: {
                    id: '',
                    statsOptionId: '',
                    stats: [],
                  },
                  hxBlock: [],
                  looks: [],
                  barter: 0,
                  harm: mockCharacter2.harm,
                  characterMoves: [],
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterLook1: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[0].look,
      category: mockCharacter2.looks[0].category,
    },
  },
  result: () => {
    // console.log('mockSetCharacterLook1');
    return {
      data: {
        setCharacterLook: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          looks: [mockCharacter2.looks[0]],
        },
      },
    };
  },
};

export const mockGameForCharacterCreation4: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation4');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: [],
                  statsBlock: {
                    id: '',
                    statsOptionId: '',
                    stats: [],
                  },
                  hxBlock: [],
                  looks: [mockCharacter2.looks[0]],
                  characterMoves: [],
                  barter: 0,
                  harm: mockCharacter2.harm,
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterLook2: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[1].look,
      category: mockCharacter2.looks[1].category,
    },
  },
  result: () => {
    // console.log('mockSetCharacterLook2');
    return {
      data: {
        setCharacterLook: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          looks: [mockCharacter2.looks[0], mockCharacter2.looks[1]],
        },
      },
    };
  },
};

export const mockGameForCharacterCreation5: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation5');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: [],
                  statsBlock: {
                    id: '',
                    statsOptionId: '',
                    stats: [],
                  },
                  hxBlock: [],
                  looks: [mockCharacter2.looks[0], mockCharacter2.looks[1]],
                  characterMoves: [],
                  barter: 0,
                  harm: mockCharacter2.harm,
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterLook3: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[2].look,
      category: mockCharacter2.looks[2].category,
    },
  },
  result: () => {
    // console.log('mockSetCharacterLook3');
    return {
      data: {
        setCharacterLook: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2]],
        },
      },
    };
  },
};

export const mockGameForCharacterCreation6: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation6');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: [],
                  statsBlock: {
                    id: '',
                    statsOptionId: '',
                    stats: [],
                  },
                  hxBlock: [],
                  looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2]],
                  characterMoves: [],
                  barter: 0,
                  harm: mockCharacter2.harm,
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterLook4: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[3].look,
      category: mockCharacter2.looks[3].category,
    },
  },
  result: () => {
    // console.log('mockSetCharacterLook4');
    return {
      data: {
        setCharacterLook: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          looks: [mockCharacter2.looks[0], mockCharacter2.looks[1], mockCharacter2.looks[2], mockCharacter2.looks[3]],
        },
      },
    };
  },
};

export const mockGameForCharacterCreation7: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation7');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: [],
                  statsBlock: {
                    id: '',
                    statsOptionId: '',
                    stats: [],
                  },
                  hxBlock: [],
                  barter: 0,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                  ],
                  characterMoves: [],
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterLook5: MockedResponse = {
  request: {
    query: SET_CHARACTER_LOOK,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      look: mockCharacter2.looks[4].look,
      category: mockCharacter2.looks[4].category,
    },
  },
  result: () => {
    // console.log('mockSetCharacterLook5');
    return {
      data: {
        setCharacterLook: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          looks: [
            mockCharacter2.looks[0],
            mockCharacter2.looks[1],
            mockCharacter2.looks[2],
            mockCharacter2.looks[3],
            mockCharacter2.looks[4],
          ],
        },
      },
    };
  },
};

export const mockGameForCharacterCreation8: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation8');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: [],
                  statsBlock: {
                    id: '',
                    statsOptionId: '',
                    stats: [],
                  },
                  hxBlock: [],
                  barter: 0,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: [],
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterStats: MockedResponse = {
  request: {
    query: SET_CHARACTER_STATS,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      statsOptionId: mockPlaybookCreatorAngel.statsOptions[0].id,
    },
  },
  result: () => {
    // console.log('mockSetCharacterStats');
    return {
      data: {
        setCharacterStats: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          statsBlock: mockCharacter2.statsBlock,
        },
      },
    };
  },
};

export const mockGameForCharacterCreation9: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation9');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: [],
                  statsBlock: mockCharacter2.statsBlock,
                  hxBlock: [],
                  barter: 0,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: [],
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterGear: MockedResponse = {
  request: {
    query: SET_CHARACTER_GEAR,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      gear: mockCharacter2.gear,
    },
  },
  result: () => {
    // console.log('mockSetCharacterGear');
    return {
      data: {
        setCharacterGear: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          gear: mockCharacter2.gear,
        },
      },
    };
  },
};

export const mockGameForCharacterCreation10: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation10');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: mockCharacter2.gear,
                  statsBlock: mockCharacter2.statsBlock,
                  hxBlock: [],
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: [],
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterBarter: MockedResponse = {
  request: {
    query: SET_CHARACTER_BARTER,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      amount: mockCharacter2.barter,
    },
  },
  result: () => {
    // console.log('mockSetCharacterBarter');
    return {
      data: {
        setCharacterBarter: {
          id: mockCharacter2.id,
          playbook: mockCharacter2.playbook,
          name: mockCharacter2.name,
          barter: mockCharacter2.barter,
        },
      },
    };
  },
};

export const mockGameForCharacterCreation11: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation11');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: mockCharacter2.gear,
                  barter: mockCharacter2.barter,
                  statsBlock: mockCharacter2.statsBlock,
                  hxBlock: [],
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: [],
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetAngelKit: MockedResponse = {
  request: {
    query: SET_ANGEL_KIT,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      stock: mockPlaybookCreatorAngel.playbookUniqueCreator?.angelKitCreator?.startingStock,
      hasSupplier: false,
    },
  },
  result: () => {
    console.log('mockSetAngelKit');
    return {
      data: {
        setAngelKit: {
          id: mockCharacter2.id,
          name: mockCharacter2.name,
          playbook: mockCharacter2.playbook,
          playbookUnique: mockCharacter2.playbookUnique,
        },
      },
    };
  },
};

export const mockGameForCharacterCreation12: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation12');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: mockCharacter2.gear,
                  statsBlock: mockCharacter2.statsBlock,
                  hxBlock: [],
                  barter: mockCharacter2.barter,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: [],
                  playbookUnique: mockCharacter2.playbookUnique,
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterMoves: MockedResponse = {
  request: {
    query: SET_CHARACTER_MOVES,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      moveIds: [
        mockPlaybookCreatorAngel.optionalMoves[1].id,
        mockPlaybookCreatorAngel.optionalMoves[2].id,
        mockPlaybookCreatorAngel.optionalMoves[0].id,
      ],
    },
  },
  result: () => {
    // console.log('mockSetCharacterMoves');
    return {
      data: {
        setCharacterMoves: {
          id: mockCharacter2.id,
          name: mockCharacter2.name,
          playbook: mockCharacter2.playbook,
          characterMoves: mockCharacter2.characterMoves,
        },
      },
    };
  },
};

export const mockGameForCharacterCreation13: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    console.log('mockGameForCharacterCreation13');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  gear: mockCharacter2.gear,
                  statsBlock: mockCharacter2.statsBlock,
                  hasCompletedCharacterCreation: false,
                  hxBlock: [],
                  barter: mockCharacter2.barter,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: mockCharacter2.characterMoves,
                  playbookUnique: mockCharacter2.playbookUnique,
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockToggleStatHighlight: MockedResponse = {
  request: {
    query: TOGGLE_STAT_HIGHLIGHT,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      stat: StatType.cool,
    },
  },
  result: () => {
    // console.log('mockToggleStatHighlight');
    return {
      data: {
        setCharacterHx: {
          id: mockCharacter2.id,
          name: mockCharacter2.name,
          playbook: mockCharacter2.playbook,
          statsBlock: mockStatsBlockWithHighlight,
        },
      },
    };
  },
};

export const mockGameForCharacterCreation14: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation14');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: mockCharacter2.gear,
                  statsBlock: mockStatsBlockWithHighlight,
                  hxBlock: mockCharacter2.hxBlock,
                  barter: mockCharacter2.barter,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: mockCharacter2.characterMoves,
                  playbookUnique: mockCharacter2.playbookUnique,
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockSetCharacterHx: MockedResponse = {
  request: {
    query: SET_CHARACTER_HX,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
      hxStats: [mockHxInput],
    },
  },
  result: () => {
    // console.log('mockSetCharacterHx');
    return {
      data: {
        setCharacterHx: {
          id: mockCharacter2.id,
          name: mockCharacter2.name,
          playbook: mockCharacter2.playbook,
          hxBlock: mockCharacter2.hxBlock,
        },
      },
    };
  },
};

export const mockGameForCharacterCreation15: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation15');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: false,
                  gear: mockCharacter2.gear,
                  statsBlock: mockCharacter2.statsBlock,
                  hxBlock: mockCharacter2.hxBlock,
                  barter: mockCharacter2.barter,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: mockCharacter2.characterMoves,
                  playbookUnique: mockCharacter2.playbookUnique,
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockfinishCharacterCreation: MockedResponse = {
  request: {
    query: FINISH_CHARACTER_CREATION,
    variables: {
      gameRoleId: mockGame5.gameRoles[2].id,
      characterId: mockCharacter2.id,
    },
  },
  result: () => {
    // console.log('mockfinishCharacterCreation');
    return {
      data: {
        finishCharacterCreation: {
          id: mockCharacter2.id,
          name: mockCharacter2.name,
          playbook: mockCharacter2.playbook,
          hasCompletedCharacterCreation: true,
        },
      },
    };
  },
};

export const mockGameForCharacterCreation16: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForCharacterCreation16');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: true,
                  gear: mockCharacter2.gear,
                  statsBlock: mockCharacter2.statsBlock,
                  hxBlock: mockCharacter2.hxBlock,
                  barter: mockCharacter2.barter,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: mockCharacter2.characterMoves,
                  playbookUnique: mockCharacter2.playbookUnique,
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockGameForPlayerPage: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    console.log('mockGameForPlayerPage');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: mockCharacter2.name,
                  hasCompletedCharacterCreation: true,
                  gear: mockCharacter2.gear,
                  statsBlock: mockCharacter2.statsBlock,
                  hxBlock: mockCharacter2.hxBlock,
                  barter: mockCharacter2.barter,
                  harm: mockCharacter2.harm,
                  looks: [
                    mockCharacter2.looks[0],
                    mockCharacter2.looks[1],
                    mockCharacter2.looks[2],
                    mockCharacter2.looks[3],
                    mockCharacter2.looks[4],
                  ],
                  characterMoves: mockCharacter2.characterMoves,
                  playbookUnique: mockCharacter2.playbookUnique,
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockAllMoves: MockedResponse = {
  request: {
    query: ALL_MOVES,
  },
  result: () => {
    // console.log('mockAllMoves');
    return {
      data: {
        allMoves: mockAllMovesArray,
      },
    };
  },
};

export const mockGameForPreGame1: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForPreGame1');
    return {
      data: {
        game: {
          ...mockGame5,
          __typename: 'Game',
        },
      },
    };
  },
};

export const mockGameForPreGame2: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame5.id },
  },
  result: () => {
    // console.log('mockGameForPreGame2');
    return {
      data: {
        game: {
          ...mockGame5,
          gameRoles: [
            mockGame5.gameRoles[0],
            mockGame5.gameRoles[1],
            {
              id: mockGame5.gameRoles[2].id,
              role: mockGame5.gameRoles[2].role,
              userId: mockGame5.gameRoles[2].userId,
              npcs: mockGame5.gameRoles[2].npcs,
              threats: mockGame5.gameRoles[2].threats,
              characters: [
                {
                  __typename: 'Character',
                  id: mockCharacter2.id,
                  playbook: mockCharacter2.playbook,
                  name: '',
                  gear: [],
                  statsBlock: [],
                  hxBlock: [],
                  looks: [],
                  hasCompletedCharacterCreation: false,
                  characterMoves: [],
                  playbookUnique: {
                    id: 'dummy',
                    type: 'dummy',
                    brainerGear: {
                      id: 'dummy',
                      brainerGear: [],
                    },
                    customWeapons: {
                      id: 'dummy',
                      weapons: [],
                    },
                    angelKit: {
                      id: 'dummy',
                      description: 'dummy',
                      stock: 0,
                      hasSupplier: false,
                      supplierText: 'dummy',
                      angelKitMoves: [dummyAngelKitMove],
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    };
  },
};

export const mockGameForPreGame3: MockedResponse = {
  request: {
    query: GAME,
    variables: { gameId: mockGame6.id },
  },
  result: () => {
    // console.log('mockGameForPreGame3');
    return {
      data: {
        game: mockGame6,
      },
    };
  },
};

export const mockFinishPreGame: MockedResponse = {
  request: {
    query: FINISH_PRE_GAME,
    variables: {
      gameId: mockGame6.id,
    },
  },
  result: () => {
    // console.log('mockFinishPreGame');
    return {
      data: {
        finishPreGame: {
          id: mockGame6.id,
        },
      },
    };
  },
};

export const mockPlaybook: MockedResponse = {
  request: {
    query: PLAYBOOK,
    variables: { playbookType: mockCharacter2.playbook },
  },
  result: () => {
    // console.log('mockPlaybook');
    return {
      data: {
        playbook: mockPlaybookAngel,
      },
    };
  },
};

export const mockDeleteGame: MockedResponse = {
  request: {
    query: DELETE_GAME,
    variables: {
      gameId: mockGame7.id,
    },
  },
  result: () => {
    // console.log('mockDeleteGame');
    return {
      data: {
        deleteGame: {
          id: 'mock-id',
        },
      },
    };
  },
};

export const mockGameRolesByUserId2: MockedResponse = {
  request: {
    query: GAMEROLES_BY_USER_ID,
    variables: { id: mockKeycloakUser2.id },
  },
  result: {
    data: {
      gameRolesByUserId: [
        {
          id: mockGameRole1.id,
          role: mockGameRole1.role,
          game: {
            id: mockGame1.id,
            name: mockGame1.name,
          },
          characters: [],
        },
        {
          id: mockGameRole2.id,
          role: mockGameRole2.role,
          game: {
            id: mockGame2.id,
            name: mockGame2.name,
          },
          characters: [],
        },
      ],
    },
  },
};

export const mockRemoveInvitee: MockedResponse = {
  request: {
    query: REMOVE_INVITEE,
    variables: {
      gameId: mockGame7.id,
      email: 'john@email.com',
    },
  },
  result: () => {
    // console.log('mockRemoveInvitee');
    return {
      data: {
        deleteGame: {
          ...mockGame7,
          invitees: ['sara@email.com'],
        },
      },
    };
  },
};

export const mockSetGameName: MockedResponse = {
  request: {
    query: SET_GAME_NAME,
    variables: {
      gameId: mockGame7.id,
      name: 'New Game Name',
    },
  },
  result: () => {
    // console.log('mockSetGameName');
    return {
      data: {
        deleteGame: {
          ...mockGame7,
          name: 'New Game Name',
        },
      },
    };
  },
};

export const mockAppCommsApp: MockedResponse = {
  request: {
    query: ADD_COMMS_APP,
    variables: {
      gameId: mockGame7.id,
      app: 'Skype',
    },
  },
  result: () => {
    // console.log('mockAppCommsApp');
    return {
      data: {
        deleteGame: {
          ...mockGame7,
          commsApp: 'Skype',
        },
      },
    };
  },
};

export const mockAppCommsUrl: MockedResponse = {
  request: {
    query: ADD_COMMS_URL,
    variables: {
      gameId: mockGame7.id,
      url: 'https://new.url.com',
    },
  },
  result: () => {
    // console.log('mockAppCommsUrl');
    return {
      data: {
        deleteGame: {
          ...mockGame7,
          commsUrl: 'https://new.url.com',
        },
      },
    };
  },
};

export const mockAddInvitee3: MockedResponse = {
  request: {
    query: ADD_INVITEE,
    variables: { gameId: mockGame7.id, email: 'new@email.com' },
  },
  result: {
    data: {
      game: {
        ...mockGame7,
        invitees: ['new@email.com'],
      },
    },
  },
};

export const mockSetVehicle: MockedResponse = {
  request: {
    query: SET_VEHICLE,
    variables: { gameroleId: 'mock-gamerole-id-8', characterId: mockCharacter2.id, vehicleInput: mockVehicleInput },
  },
  result: () => {
    console.log('mockSetVehicle');
    return {
      data: {
        setVehicle: {
          id: mockCharacter2.id,
          // name: mockCharacter2.name,
          // playbook: mockCharacter2.playbook,
          // playbookUnique: mockPlaybookUniqueDriver,
        },
      },
    };
  },
};

export const mockPlayBookCreatorQueryAngel: MockedResponse = {
  request: {
    query: PLAYBOOK_CREATOR,
    variables: { playbookType: PlaybookType.angel },
  },
  result: () => {
    // console.log('mockPlayBookCreatorQueryAngel');
    return {
      data: {
        playbookCreator: {
          id: 'driver-playbook-creator-id',
          playbookType: PlaybookType.angel,
          gearInstructions: mockgearInstructionsAngel,
          improvementInstructions: 'Whenever you roll a highlighted stat...',
          movesInstructions: 'You get all the basic moves. Choose 2 driver moves.',
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
          optionalMoves: [mockCharacterMoveAngel2, mockCharacterMoveAngel1, mockCharacterMoveAngel4],
          defaultMoves: [mockCharacterMoveAngel1],
          defaultMoveCount: 1,
          moveChoiceCount: 2,
          playbookUniqueCreator: mockUniqueCreatorAngel,
        },
      },
    };
  },
};

export const mockPlayBookCreatorQueryBrainer: MockedResponse = {
  request: {
    query: PLAYBOOK_CREATOR,
    variables: { playbookType: PlaybookType.brainer },
  },
  result: () => {
    console.log('mockPlayBookCreatorQueryBrainer');
    return {
      data: {
        playbookCreator: {
          id: 'brainer-playbook-creator-id',
          playbookType: PlaybookType.brainer,
          gearInstructions: mockgearInstructionsAngel,
          improvementInstructions: 'Whenever you roll a highlighted stat...',
          movesInstructions: 'You get all the basic moves. Choose 2 driver moves.',
          hxInstructions: 'Everyone introduces their characters by name, look and outlook...',
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
          names: [mockNameAngel1, mockNameAngel2],
          statsOptions: [mockStatsOptionsAngel1, mockStatsOptionsAngel2, mockStatsOptionsAngel3],
          defaultMoveCount: 1,
          moveChoiceCount: 2,
          optionalMoves: [mockCharacterMoveAngel2, mockCharacterMoveAngel1, mockCharacterMoveAngel4],
          defaultMoves: [mockCharacterMoveAngel1],
          playbookUniqueCreator: mockUniqueCreatorBrainer,
        },
      },
    };
  },
};

export const mockVehicleCreatorQuery: MockedResponse = {
  request: {
    query: VEHICLE_CREATOR,
  },
  result: () => {
    // console.log('mockVehicleCreator');
    return {
      data: {
        vehicleCreator: mockVehicleCreator,
      },
    };
  },
};
