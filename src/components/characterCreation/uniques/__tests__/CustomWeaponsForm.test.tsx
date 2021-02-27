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
  dummyAngelKitCreator,
  dummyEstablishmentCreator,
  dummyFollowerCreator,
  dummyGangCreator,
  dummyHoldingCreator,
  dummySkinnerGearCreator,
  dummyWeaponsCreator,
  dummyWorkspaceCreator,
  mockBrainerGearCreator,
  mockCharacterHarm,
  mockCharacterMoveAngel1,
  mockCharacterMoveAngel2,
  mockCharacterMoveAngel3,
  mockCustomWeaponsCreator,
  mockFirearmBaseOption,
  mockFirearmOption,
  mockFirearmOption2,
  mockHandBaseOption,
  mockHandOption,
  mockHandOption2,
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
import { InMemoryCache } from '@apollo/client';
import userEvent from '@testing-library/user-event';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

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

const mockBattlebabeUniqueCreator: PlaybookUniqueCreator = {
  id: 'mock-battlebae-unique-creator',
  type: UniqueTypes.customWeapons,
  angelKitCreator: dummyAngelKitCreator,
  brainerGearCreator: mockBrainerGearCreator,
  customWeaponsCreator: mockCustomWeaponsCreator,
  establishmentCreator: dummyEstablishmentCreator,
  followersCreator: dummyFollowerCreator,
  gangCreator: dummyGangCreator,
  holdingCreator: dummyHoldingCreator,
  skinnerGearCreator: dummySkinnerGearCreator,
  weaponsCreator: dummyWeaponsCreator,
  workspaceCreator: dummyWorkspaceCreator,
  __typename: 'PlaybookUniqueCreator',
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
  __typename: 'Character',
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
    variables: { playbookType: PlaybookType.battlebabe },
  },
  result: () => {
    // console.log('mockPlayBookCreatorQueryBattlebabe');
    return {
      data: {
        playbookCreator: mockBattlebabeCreator,
      },
    };
  },
};

describe('Rendering CustomWeaponsForm', () => {
  let cache = new InMemoryCache();

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  test('should render CustomWeaponsForm in initial state', async () => {
    renderWithRouter(<CustomWeaponsForm />, `/character-creation/${mockGame.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryBattlebabe],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('custom-weapons-form');
    await screen.findByRole('heading', { name: `WHAT ARE ${mockBattleBabe.name?.toUpperCase()}'S TWO CUSTOM WEAPONS?` });

    screen.getByRole('heading', { name: 'CUSTOM FIREARMS' });
    screen.getByRole('heading', { name: 'CUSTOM HAND WEAPONS' });
    const weaponInput = screen.getByRole('textbox', { name: 'weapon-input' }) as HTMLInputElement;
    expect(weaponInput.value).toEqual('');
    const resetButton = screen.getByRole('button', { name: 'RESET' }) as HTMLButtonElement;
    expect(resetButton.disabled).toEqual(true);
    const removeButton = screen.getByRole('button', { name: 'REMOVE' }) as HTMLButtonElement;
    expect(removeButton.disabled).toEqual(true);
    const addButton = screen.getByRole('button', { name: 'ADD' }) as HTMLButtonElement;
    expect(addButton.disabled).toEqual(true);
    const setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);
    screen.getByRole('list', { name: 'interim-weapons-list' });
  });

  test('should be able to add, remove and reset interim weapons and enable SET button', async () => {
    renderWithRouter(<CustomWeaponsForm />, `/character-creation/${mockGame.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryBattlebabe],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    const weaponInput = (await screen.findByRole('textbox', { name: 'weapon-input' })) as HTMLInputElement;
    const resetButton = (await screen.findByRole('button', { name: 'RESET' })) as HTMLButtonElement;
    const removeButton = screen.getByRole('button', { name: 'REMOVE' }) as HTMLButtonElement;
    const addButton = screen.getByRole('button', { name: 'ADD' }) as HTMLButtonElement;
    const setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    const interimList = screen.getByRole('list', { name: 'interim-weapons-list' });

    // Click base firearm pill
    const baseOption1 = screen.getByTestId(`${mockFirearmBaseOption.description}-base-option-pill`);
    userEvent.click(baseOption1);
    expect(weaponInput.value).toContain(mockFirearmBaseOption.description);
    mockFirearmBaseOption.tags.forEach((tag) => expect(weaponInput.value).toContain(tag));

    // Click RESET button
    userEvent.click(resetButton);
    expect(weaponInput.value).toEqual('');

    // Click base firearm pill again
    userEvent.click(baseOption1);

    // Click 1st firearm option (should add tag because +antique)
    const option1 = screen.getByTestId(`${mockFirearmOption.description}-option-pill`);
    userEvent.click(option1);
    expect(weaponInput.value).toContain(mockFirearmOption.description);

    // Click 2nd firearm option (should remove tag because -reload)
    const option2 = screen.getByTestId(`${mockFirearmOption2.description}-option-pill`);
    userEvent.click(option2);
    expect(weaponInput.value).toContain(mockFirearmOption2.description);
    expect(weaponInput.value).not.toContain(mockFirearmOption2.tag);

    // Click ADD button
    userEvent.click(addButton);
    expect(interimList.textContent).toContain(mockFirearmBaseOption.description);
    expect(interimList.textContent).toContain(mockFirearmOption.description);
    expect(interimList.textContent).toContain(mockFirearmOption2.description);
    expect(weaponInput.value).toEqual('');

    // TODO: Change form to only allow SET when there are two weapons in interim list
    // expect(setButton.disabled).toEqual(true);

    // Remove the weapon from interim list
    const interimWeapon1 = screen.getByRole('listitem', { name: 'interim-weapon-1' });
    userEvent.click(interimWeapon1);
    expect(weaponInput.value).toContain(mockFirearmOption2.description);
    expect(weaponInput.value).not.toContain(mockFirearmOption2.tag);
    expect(weaponInput.value).toContain(mockFirearmOption.description);
    expect(weaponInput.value).toContain(mockFirearmBaseOption.description);
    expect(removeButton.disabled).toEqual(false);
    userEvent.click(removeButton);
    expect(interimList.textContent).toEqual('');

    // Add firearm back into interim list
    userEvent.click(baseOption1);
    userEvent.click(option1);
    userEvent.click(option2);
    userEvent.click(addButton);

    // Add hand weapon to interim list
    const baseOption2 = screen.getByTestId(`${mockHandBaseOption.description}-base-option-pill`);
    userEvent.click(baseOption2);
    const option3 = screen.getByTestId(`${mockHandOption.description}-option-pill`);
    userEvent.click(option3);
    const option4 = screen.getByTestId(`${mockHandOption2.description}-option-pill`);
    userEvent.click(option4);

    expect(weaponInput.value).toContain('2-harm');
    userEvent.click(addButton);
    expect(interimList.textContent).toContain(mockFirearmBaseOption.description);
    expect(interimList.textContent).toContain(mockHandBaseOption.description);

    // Check SET button is enabled
    expect(setButton.disabled).toEqual(false);
  });
});
