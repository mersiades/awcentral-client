import React from 'react';
// import wait from 'waait';
import userEvent from '@testing-library/user-event';
import { InMemoryCache } from '@apollo/client';
import { screen } from '@testing-library/react';

import CharacterStatsForm from '../CharacterStatsForm';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import {
  blankCharacter,
  mockCharacter2,
  mockGame5,
  mockKeycloakUserInfo1,
  mockPlaybookCreatorAngel,
} from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';
import { mockPlaybookCreator } from '../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering CharacterStatsForm', () => {
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
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  test('should render CharacterStatsForm in initial state', async () => {
    renderWithRouter(<CharacterStatsForm />, `/character-creation/${mockGame5.id}?step=4`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      apolloMocks: [mockPlaybookCreator],
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('character-stats-form');
    screen.getByRole('heading', { name: `WHAT ARE ${mockCharacter2.name?.toUpperCase()}'S STRENGTHS AND WEAKNESSES?` });
    screen.getByRole('heading', { name: 'Choose a set:' });
    screen.getByRole('button', { name: 'SET' });
    await screen.findByTestId(`${mockPlaybookCreatorAngel.statsOptions[0].id}-stats-option-box`);
    await screen.findByTestId(`${mockPlaybookCreatorAngel.statsOptions[1].id}-stats-option-box`);
    await screen.findByTestId(`${mockPlaybookCreatorAngel.statsOptions[2].id}-stats-option-box`);
  });

  test('should select StatsOption and click SET button', async () => {
    renderWithRouter(<CharacterStatsForm />, `/character-creation/${mockGame5.id}?step=4`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      apolloMocks: [mockPlaybookCreator],
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    const setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);
    const statsOption1 = await screen.findByTestId(`${mockPlaybookCreatorAngel.statsOptions[0].id}-stats-option-box`);
    userEvent.click(statsOption1);
    expect(setButton.disabled).toEqual(false);
    userEvent.click(setButton);
  });
});
