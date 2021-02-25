import React from 'react';
// import wait from 'waait';
import { screen } from '@testing-library/react';

import AngelKitForm from '../AngelKitForm';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import {
  blankCharacter,
  mockAngelKitCreator,
  mockCharacter2,
  mockGame5,
  mockKeycloakUserInfo1,
} from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { mockPlayBookCreatorQueryAngel } from '../../../../tests/mockQueries';
import { InMemoryCache } from '@apollo/client';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering AngelKitForm', () => {
  test('should load AngelKitForm in initial state', async () => {
    let cache = new InMemoryCache();
    const mockGame = {
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
            },
          ],
        },
      ],
    };

    renderWithRouter(<AngelKitForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryAngel],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('angel-kit-form');

    await screen.findByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S ANGEL KIT` });
    screen.getByRole('heading', { name: 'Stock' });
    const setButton = screen.getByRole('button', { name: /SET/i }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);

    expect(screen.getByRole('heading', { name: 'stock-value' }).textContent).toEqual(
      mockAngelKitCreator.startingStock.toString()
    );
  });
});
