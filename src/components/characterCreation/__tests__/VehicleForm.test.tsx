import React from 'react';
import { screen } from '@testing-library/react';

import VehicleForm from '../VehicleForm';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import { blankCharacter, mockCharacter2, mockGame5, mockKeycloakUserInfo1 } from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';
import { PlaybookType, VehicleFrameType } from '../../../@types/enums';
import { mockVehicleCreatorQuery } from '../../../tests/mockQueries';
import { InMemoryCache } from '@apollo/client';
import { Game } from '../../../@types/dataInterfaces';
import { DEFAULT_VEHICLE_NAME } from '../../../config/constants';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering VehicleForm', () => {
  const mockNavigationOnSet = jest.fn();

  let cache = new InMemoryCache();

  const mockGame: Game = {
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
            ...blankCharacter,
            id: mockCharacter2.id,
            playbook: mockCharacter2.playbook,
            name: mockCharacter2.name,
            looks: mockCharacter2.looks,
            statsBlock: mockCharacter2.statsBlock,
            gear: mockCharacter2.gear,
            playbookUnique: mockCharacter2.playbookUnique,
            characterMoves: mockCharacter2.characterMoves,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  test('should load an empty vehicle into the form', async () => {
    const game = {
      ...mockGame5,
      gameRoles: [
        mockGame5.gameRoles[0],
        mockGame5.gameRoles[1],
        {
          ...mockGame5.gameRoles[2],
          characters: [
            {
              id: mockCharacter2.id,
              hasCompletedCharacterCreation: mockCharacter2.hasCompletedCharacterCreation,
              hasPlusOneForward: false,
              harm: mockCharacter2.harm,
              name: mockCharacter2.name,
              playbook: PlaybookType.driver,
              looks: mockCharacter2.looks,
              statsBlock: mockCharacter2.statsBlock,
              gear: mockCharacter2.gear,
              barter: mockCharacter2.barter,
              vehicleCount: 0,
              playbookUnique: undefined,
              characterMoves: [],
              hxBlock: mockCharacter2.hxBlock,
              vehicles: [],
              battleVehicles: [],
              holds: [],
              battleVehicleCount: 0,
            },
          ],
        },
      ],
    };

    renderWithRouter(
      <VehicleForm existingVehicle={undefined} navigateOnSet={mockNavigationOnSet} />,
      `/character-creation/${mockGame5.id}?step=8`,
      {
        isAuthenticated: true,
        apolloMocks: [mockVehicleCreatorQuery],
        injectedGame: game,
        injectedUserId: mockKeycloakUserInfo1.sub,
      }
    );

    await screen.findByTestId('vehicle-form');
    const setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);
    const nameInput = screen.getByRole('textbox', { name: 'name-input' }) as HTMLInputElement;
    expect(nameInput.value).toEqual(DEFAULT_VEHICLE_NAME);
    const frame = screen.getByRole('heading', { name: 'frame-value' }) as HTMLHeadingElement;
    expect(frame.textContent).toEqual(VehicleFrameType.medium);
    const speed = screen.getByRole('heading', { name: 'Speed' }) as HTMLHeadingElement;
    expect(speed.textContent).toEqual('0');
    const handling = screen.getByRole('heading', { name: 'Handling' }) as HTMLHeadingElement;
    expect(handling.textContent).toEqual('0');
    const armor = screen.getByRole('heading', { name: 'Armor' }) as HTMLHeadingElement;
    expect(armor.textContent).toEqual('0');
    const massive = screen.getByRole('heading', { name: 'Massive' }) as HTMLHeadingElement;
    expect(massive.textContent).toEqual('2');
  });
});
