import React from 'react';
// import wait from 'waait';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRenderForComponent } from '../../tests/test-utils';
import { mockKeycloakStub } from '../../../__mocks__/@react-keycloak/web';
import { mockGame7, mockKeycloakUserInfo1, mockKeycloakUserInfo2 } from '../../tests/mocks';
import { mockAllMoves } from '../../tests/mockQueries';
import MCPage from '../MCPage';
import { RoleType } from '../../@types/enums';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo2), initialized: true }),
  };
});

describe('Rendering MCPage', () => {
  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
  const mockScrollIntoView = jest.fn();
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });

  afterEach(() => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  test('should render initial MCPage with GamePanel open', async () => {
    customRenderForComponent(<MCPage />, {
      isAuthenticated: true,
      apolloMocks: [mockAllMoves],
      injectedGame: mockGame7,
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    // Check that inital parts have been rendered
    screen.getByRole('banner');
    screen.getByRole('button', { name: 'Open Menu' });
    mockGame7.gameRoles.forEach((gameRole) => {
      if (gameRole.role === RoleType.player) {
        screen.getByRole('button', { name: gameRole.characters[0].name });
      }
    });
    screen.getByRole('button', { name: 'Threat map' });
    screen.getByRole('button', { name: 'Pre-game' });
    screen.getByRole('tab', { name: 'Game' });
    screen.getByRole('tab', { name: 'MC Moves' });
    screen.getByRole('tab', { name: 'Threats' });
    screen.getByRole('tab', { name: 'NPCs' });
    screen.getByRole('tabpanel', { name: 'Game Tab Contents' });
    await screen.findByRole('tab', { name: 'Moves' });
  });

  test('should open each tab', async () => {
    customRenderForComponent(<MCPage />, {
      isAuthenticated: true,
      apolloMocks: [mockAllMoves],
      injectedGame: mockGame7,
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    screen.getByRole('tabpanel', { name: 'Game Tab Contents' });
    const movesTab = await screen.findByRole('tab', { name: 'Moves' });
    userEvent.click(movesTab);
    screen.getByRole('tabpanel', { name: 'Moves Tab Contents' });

    userEvent.click(screen.getByRole('tab', { name: 'MC Moves' }));
    screen.getByRole('tabpanel', { name: 'MC Moves Tab Contents' });

    userEvent.click(screen.getByRole('tab', { name: 'Threats' }));
    screen.getByRole('tabpanel', { name: 'MC Moves Tab Contents' });
    screen.getByRole('tabpanel', { name: 'Threats Tab Contents' });

    userEvent.click(screen.getByRole('tab', { name: 'NPCs' }));
    screen.getByRole('tabpanel', { name: 'MC Moves Tab Contents' });
    screen.getByRole('tabpanel', { name: 'NPCs Tab Contents' });
  });

  test('should open delete-game dialog', async () => {
    customRenderForComponent(<MCPage />, {
      isAuthenticated: true,
      apolloMocks: [mockAllMoves],
      injectedGame: mockGame7,
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    await screen.findByRole('tab', { name: 'Moves' });
    userEvent.click(screen.getByTestId(`${mockGame7.name.toLowerCase()}-down-chevron`));
    userEvent.click(screen.getByRole('button', { name: /DELETE GAME/ }));
    screen.getByTestId('delete game?-warning-dialog');
  });

  test('should open and close GameForm', async () => {
    customRenderForComponent(<MCPage />, {
      isAuthenticated: true,
      apolloMocks: [mockAllMoves],
      injectedGame: mockGame7,
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    await screen.findByRole('tab', { name: 'Moves' });
    userEvent.click(screen.getByTestId(`${mockGame7.name.toLowerCase()}-edit-link`));
    screen.getByTestId('game-form');
    userEvent.click(screen.getByTestId('close-icon-button'));
  });

  test('should open and close InvitationForm using INVITE PLAYER button', async () => {
    customRenderForComponent(<MCPage />, {
      isAuthenticated: true,
      apolloMocks: [mockAllMoves],
      injectedGame: mockGame7,
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    await screen.findByRole('tab', { name: 'Moves' });
    userEvent.click(screen.getByRole('button', { name: /INVITE PLAYER/ }));
    screen.getByTestId('invitation-form');

    // Check InvitationForm is open to the email input part
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('type')).toEqual('email');

    userEvent.click(screen.getByTestId('close-icon-button'));
  });

  test('should open and close InvitationForm by clicking on player name', async () => {
    customRenderForComponent(<MCPage />, {
      isAuthenticated: true,
      apolloMocks: [mockAllMoves],
      injectedGame: { ...mockGame7, invitees: ['john@email.com', 'sara@email.com'] },
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    await screen.findByRole('tab', { name: 'Moves' });
    userEvent.click(screen.getByTestId(`john@email.com-list-item`));
    screen.getByTestId('invitation-form');

    // Check InvitationForm is open to the email input part
    screen.getByRole('button', { name: /COPY TO CLIPBOARD/ });

    userEvent.click(screen.getByTestId('close-icon-button'));
  });
});
