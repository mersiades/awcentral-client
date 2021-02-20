import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockKeycloakStub } from '../../__mocks__/@react-keycloak/web';
import { mockGame4, mockKeycloakUserInfo1 } from './mocks';
import { renderWithRouter } from './test-utils';
import { mockAddUserToGame, mockGameRolesByUserId, mockGamesForInvitee } from './mockQueries';
import App from '../components/App';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Testing flow for joining a game', () => {
  test('should join a game (happy path)', async () => {
    renderWithRouter(<App />, '/menu', {
      isAuthenticated: true,
      apolloMocks: [mockGameRolesByUserId, mockGamesForInvitee, mockAddUserToGame],
    });

    // Click JOIN GAME to navigate to /join-game
    const button = await screen.findByRole('button', { name: /JOIN GAME/i });
    userEvent.click(button);

    // Check invitation content is correct
    const listItem = await screen.findByTestId('invitation-list-item');
    expect(listItem.textContent).toContain(mockGame4.name);
    expect(listItem.textContent).toContain(mockGame4.mc.displayName);
    mockGame4.players.forEach((player) => expect(listItem.textContent).toContain(player.displayName));

    // Click JOIN to join game and navigate to /character-creation/:gameId
    userEvent.click(screen.getByRole('button', { name: /JOIN/i }));

    // Check have navigated to /character-creation/:gameId
    await screen.findByTestId('character-creation-page');
  });
});
