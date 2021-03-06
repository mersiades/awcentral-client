import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NewGameIntro from '../NewGameIntro';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import { mockGame1, mockKeycloakUserInfo1 } from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering NewGameIntro', () => {
  test('should render NewGameIntro with commsApp and commsUrl', async () => {
    const mockCloseNewGameIntro = jest.fn();

    renderWithRouter(
      <NewGameIntro closeNewGameIntro={mockCloseNewGameIntro} />,
      `/character-creation/${mockGame1.id}?step=0`,
      {
        isAuthenticated: true,
        injectedGame: mockGame1,
        injectedUserId: mockKeycloakUserInfo1.sub,
      }
    );
    screen.getByRole('heading', { name: 'NEW GAME' });
    const nextButton = screen.getByRole('button', { name: 'NEXT' });
    const link = screen.getByRole('link', { name: mockGame1.commsApp }) as HTMLAnchorElement;
    expect(link.href).toEqual(mockGame1.commsUrl);

    userEvent.click(nextButton);
    expect(mockCloseNewGameIntro).toHaveBeenCalled();

    // This is need to prevent: Warning: An update to KeycloakUserProvider inside a test was not wrapped in act(...).
    await screen.findByRole('heading', { name: 'NEW GAME' });
  });

  test('should render NewGameIntro with commsApp only', async () => {
    const mockCloseNewGameIntro = jest.fn();

    renderWithRouter(
      <NewGameIntro closeNewGameIntro={mockCloseNewGameIntro} />,
      `/character-creation/${mockGame1.id}?step=0`,
      {
        isAuthenticated: true,
        injectedGame: { ...mockGame1, commsUrl: '' },
        injectedUserId: mockKeycloakUserInfo1.sub,
      }
    );
    screen.getByRole('heading', { name: 'NEW GAME' });
    screen.getByRole('button', { name: 'NEXT' });

    // This is need to prevent: Warning: An update to KeycloakUserProvider inside a test was not wrapped in act(...).
    await screen.findByRole('heading', { name: 'NEW GAME' });
  });

  test('should render NewGameIntro with commsUrl only', async () => {
    const mockCloseNewGameIntro = jest.fn();

    renderWithRouter(
      <NewGameIntro closeNewGameIntro={mockCloseNewGameIntro} />,
      `/character-creation/${mockGame1.id}?step=0`,
      {
        isAuthenticated: true,
        injectedGame: { ...mockGame1, commsApp: '' },
        injectedUserId: mockKeycloakUserInfo1.sub,
      }
    );
    screen.getByRole('heading', { name: 'NEW GAME' });
    screen.getByRole('button', { name: 'NEXT' });
    const link = screen.getByRole('link', { name: 'here' }) as HTMLAnchorElement;
    expect(link.href).toEqual(mockGame1.commsUrl);

    // This is need to prevent: Warning: An update to KeycloakUserProvider inside a test was not wrapped in act(...).
    await screen.findByRole('heading', { name: 'NEW GAME' });
  });
});
