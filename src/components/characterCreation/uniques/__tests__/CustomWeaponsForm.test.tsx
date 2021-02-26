import React from 'react';
import { screen } from '@testing-library/react';
import {
  GearInstructions,
  Look,
  Name,
  PlaybookCreator,
  PlaybookUniqueCreator,
} from '../../../../@types/staticDataInterfaces';
import { Character, Game } from '../../../../@types/dataInterfaces';
import {
  mockCharacterHarm,
  mockCharacterMoveAngel1,
  mockCharacterMoveAngel2,
  mockCharacterMoveAngel3,
  mockKeycloakUserInfo1,
  mockLookBattlebabe2,
  mockPlaybookUniqueBattlebabe,
  mockStatsBlock1,
  mockStatsOptionsAngel1,
  mockStatsOptionsAngel2,
} from '../../../../tests/mocks';
import { LookType, PlaybookType, RoleType, UniqueTypes } from '../../../../@types/enums';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import CustomWeaponsForm from '../CustomWeaponsForm';
import { renderWithRouter } from '../../../../tests/test-utils';
import { MockedResponse } from '@apollo/client/testing';
import PLAYBOOK_CREATOR from '../../../../queries/playbookCreator';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

const mockBattlebabeUniqueCreator: PlaybookUniqueCreator = {
  id: 'mock-battlebae-unique-creator',
  type: UniqueTypes.customWeapons,
  /**
   * Add uniques:
  angelKitCreator?: AngelKitCreator;
  customWeaponsCreator?: CustomWeaponsCreator;
  brainerGearCreator?: BrainerGearCreator;
  carCreator?: CarCreator;
  bikeCreator?: BikeCreator;
 */
};

const dummyBattlebabeGearInstructions: GearInstructions = {
  id: 'dummy',
  gearIntro: 'dummy',
  youGetItems: ['dummy'],
  introduceChoice: 'dummy',
  numberCanChoose: 0,
  chooseableGear: ['dummy'],
  withMC: 'dummy',
  startingBarter: 0,
};

const mockBattlebabeName: Name = {
  id: 'mock-battlebabe-name-id-1',
  name: 'Scarlet',
};

const mockBattlebabeLook: Look = {
  id: 'mock-battlebabe-look-id-2',
  look: 'woman',
  category: LookType.gender,
  playbookType: PlaybookType.battlebabe,
};

const mockBattlebabeCreator: PlaybookCreator = {
  id: 'mock-battlebabe-playbook-creator',
  playbookType: PlaybookType.battlebabe,
  gearInstructions: dummyBattlebabeGearInstructions,
  improvementInstructions: 'Whenever you roll a highlighted stat...',
  movesInstructions: 'You get all the basic moves. Choose 2 battlebabe moves.',
  hxInstructions: 'Everyone introduces their characters by name, look and outlook...',
  names: [mockBattlebabeName],
  looks: [mockBattlebabeLook],
  statsOptions: [mockStatsOptionsAngel1, mockStatsOptionsAngel2],
  defaultMoves: [mockCharacterMoveAngel1],
  optionalMoves: [mockCharacterMoveAngel2, mockCharacterMoveAngel3],
  defaultMoveCount: 1,
  moveChoiceCount: 2,
  playbookUniqueCreator: mockBattlebabeUniqueCreator,
  defaultVehicleCount: 0,
};

const mockBattleBabe: Character = {
  id: 'mock-character-id-1',
  name: 'Mock Character 1',
  playbook: PlaybookType.battlebabe,
  hasCompletedCharacterCreation: false,
  gear: ['leather jacket', 'Timberland boots'],
  statsBlock: mockStatsBlock1,
  barter: 2,
  hxBlock: [],
  harm: mockCharacterHarm,
  looks: [mockBattlebabeLook, mockLookBattlebabe2],
  characterMoves: [
    mockCharacterMoveAngel1,
    { ...mockCharacterMoveAngel2, isSelected: true },
    { ...mockCharacterMoveAngel3, isSelected: true },
  ], // TODO: change to battlebabe moves
  playbookUnique: mockPlaybookUniqueBattlebabe,
  vehicleCount: 0,
  battleVehicleCount: 0,
  battleVehicles: [],
  hasPlusOneForward: false,
  holds: [],
  vehicles: [],
};

const mockGame: Game = {
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
      id: 'mock-gameRole-id-6',
      role: RoleType.mc,
      userId: 'mock-keycloak-id-2',
      npcs: [],
      threats: [],
      characters: [],
    },
    {
      id: 'mock-gameRole-id-8',
      role: RoleType.player,
      userId: 'mock-keycloak-id-1',
      npcs: [],
      threats: [],
      characters: [{ ...mockBattleBabe, playbookUnique: undefined }],
    },
  ],
  invitees: [],
  gameMessages: [],
};

export const mockPlayBookCreatorQueryBattlebabe: MockedResponse = {
  request: {
    query: PLAYBOOK_CREATOR,
    variables: { playbookType: PlaybookType.brainer },
  },
  result: () => {
    console.log('mockPlayBookCreatorQueryBattlebabe');
    return {
      data: {
        playbookCreator: mockBattlebabeCreator,
      },
    };
  },
};

describe('Rendering CustomWeaponsForm', () => {
  test('should render CustomWeaponsForm in default start state', async () => {
    renderWithRouter(<CustomWeaponsForm />, `/character-creation/${mockGame.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryBattlebabe],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    await screen.findByTestId('custom-weapons-form');
    await screen.findByTestId('custom-weapons-form');
    await screen.findByTestId('custom-weapons-form');
  });
});
