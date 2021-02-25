import React from 'react';
// import wait from 'waait';
import userEvent from '@testing-library/user-event';
import { InMemoryCache } from '@apollo/client';
import { screen } from '@testing-library/react';

import CharacterGearForm from '../CharacterGearForm';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import { blankCharacter, mockCharacter2, mockGame5, mockKeycloakUserInfo1 } from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';
import { mockPlaybookCreator } from '../../../tests/mockQueries';
import CharacterMovesForm from '../CharacterMovesForm';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering CharacterMovesForm', () => {
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
            playbookUnique: mockCharacter2.playbookUnique,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  test('should render CharacterMovesForm in initial state (Angel)', async () => {
    renderWithRouter(<CharacterMovesForm />, `/character-creation/${mockGame5.id}?step=7`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      apolloMocks: [mockPlaybookCreator],
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('character-moves-form');
    await screen.findByRole('heading', { name: `WHAT ARE ${mockCharacter2.name?.toUpperCase()}'S MOVES?` });

    // Unable to load PlaybookCreator into component via MockedProvider
  });
});
