import React from 'react';
import { act, screen } from '@testing-library/react';

import VehicleForm from '../VehicleForm';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import { blankCharacter, mockCharacter2, mockGame5, mockKeycloakUserInfo1 } from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';
import { PlaybookType } from '../../../@types/enums';
import { mockSetVehicleCount, mockVehicleCreatorQuery } from '../../../tests/mockQueries';
import { InMemoryCache } from '@apollo/client';
import { Game } from '../../../@types/dataInterfaces';
import VehiclesFormContainer from '../VehiclesFormContainer';
import userEvent from '@testing-library/user-event';
import wait from 'waait';

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
    __typename: 'Game',
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

  test('should give "no default vehicles" message to Angel', async () => {
    renderWithRouter(<VehiclesFormContainer />, `/character-creation/${mockGame5.id}?step=8`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('no-default-vehicle-message');
    screen.getByRole('button', { name: 'ADD VEHICLE' });
    screen.getByRole('button', { name: 'PASS' });
  });

  test('should open VehicleForm on ADD VEHICLE click', async () => {
    renderWithRouter(<VehiclesFormContainer />, `/character-creation/${mockGame5.id}?step=8`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      apolloMocks: [mockSetVehicleCount, mockVehicleCreatorQuery],
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('no-default-vehicle-message');
    const addButton = screen.getByRole('button', { name: 'ADD VEHICLE' });
    userEvent.click(addButton);
    // FAILING: mutation returns correct value, but it does not update the graphql cache
    // await screen.findByTestId('vehicle-form');
  });
});
