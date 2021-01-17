import React from 'react';
// import wait from 'waait';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PlayerPage from '../PlayerPage';
import { customRenderForComponent } from '../../tests/test-utils';
import { mockKeycloakStub } from '../../../__mocks__/@react-keycloak/web';
import { mockGame7, mockKeycloakUserInfo1 } from '../../tests/mocks';
import { mockAllMoves, mockPlaybook } from '../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering PlayerPage', () => {
  test('should render PlayerPage with PlaybookPanel and MovesPanel', async () => {
    customRenderForComponent(<PlayerPage />, {
      isAuthenticated: true,
      apolloMocks: [mockAllMoves, mockPlaybook],
      injectedGame: mockGame7,
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    // Check base roles are rendered
    await screen.findByTestId('player-page');
    screen.getByRole('button', { name: 'Open Menu' });
    screen.getByRole('tablist');
    screen.getByRole('banner');
    screen.getByRole('tabpanel', { name: 'Tab Contents' });
    const playbookTab = screen.getByRole('tab', { name: 'Playbook' });
    const movesTab = screen.getByRole('tab', { name: 'Moves' });

    // Check that PlaybookPanel opens
    userEvent.click(playbookTab);
    await screen.findByTestId('character-sheet');
    screen.getByRole('tabpanel', { name: 'Playbook Tab Contents' });

    // Check that MovesPanel opens
    userEvent.click(movesTab);
    screen.getByTestId('moves-panel');
    screen.getByRole('tabpanel', { name: 'Moves Tab Contents' });
  });
});
