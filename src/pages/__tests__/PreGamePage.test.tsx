import React from 'react';
import wait from 'waait';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../components/App';
import { renderWithRouter } from '../../tests/test-utils';
import { mockKeycloakStub } from '../../../__mocks__/@react-keycloak/web';
import {
  mockCharacter1,
  mockCharacter2,
  mockGame5,
  mockGame6,
  mockKeycloakUser2,
  mockKeycloakUserInfo1,
  mockKeycloakUserInfo2,
} from '../../tests/mocks';
import { mockGameForPreGame1, mockFinishPreGame, mockGameForPreGame3 } from '../../tests/mockQueries';
import { decapitalize } from '../../helpers/decapitalize';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo2), initialized: true }),
  };
});

describe('Rendering PreGamePage', () => {
  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
  const mockScrollIntoView = jest.fn();
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
  });

  afterEach(() => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  test('should render for MC with two incomplete Characters', async () => {
    renderWithRouter(<App />, `/pre-game/${mockGame5.id}`, {
      isAuthenticated: true,
      keycloakUser: mockKeycloakUser2,
      apolloMocks: [mockGameForPreGame1],
    });
    await act(async () => await wait());
    await screen.findByTestId('pre-game-page');

    // Check everything has been rendered properly initially
    screen.getByRole('heading', { name: /PRE-GAME/ });
    screen.getByRole('heading', { name: `${mockCharacter1.name} -- ${decapitalize(mockCharacter1.playbook)}` });
    screen.getByRole('heading', { name: 'Name -- Playbook' });
    screen.getByRole('button', { name: /START GAME/ });
    let char1LooksBox = screen.getByTestId(`${mockCharacter1.id}-looks-box`);
    expect(char1LooksBox.querySelector('svg')?.getAttribute('aria-label')).toEqual('Checkbox');
    let char2LooksBox = screen.getByTestId('1-looks-box');
    expect(char2LooksBox.querySelector('svg')?.getAttribute('aria-label')).toEqual('Checkbox');

    // TODO: add tests for when new data comes in via polling
  });

  // test('should render for MC with two complete Characters', async () => {
  //   renderWithRouter(<App />, `/pre-game/${mockGame6.id}`, {
  //     isAuthenticated: true,
  //     keycloakUser: mockKeycloakUser2,
  //     injectedGame: mockGame6,
  //     injectedUserId: mockKeycloakUserInfo1.sub,
  //     apolloMocks: [mockGameForPreGame3, mockFinishPreGame],
  //   });
  //   await act(async () => await wait());
  //   await screen.findByTestId('pre-game-page');

  //   // Check everything has been rendered properly initially
  //   screen.getByRole('heading', { name: /PRE-GAME/ });
  //   screen.getByRole('heading', { name: `${mockCharacter1.name} -- ${decapitalize(mockCharacter1.playbook)}` });
  //   screen.getByRole('heading', { name: `${mockCharacter2.name} -- ${decapitalize(mockCharacter2.playbook)}` });
  //   const button = screen.getByRole('button', { name: /START GAME/ });
  //   let char1LooksBox = screen.getByTestId(`${mockCharacter1.id}-looks-box`);
  //   expect(char1LooksBox.querySelector('svg')?.getAttribute('aria-label')).toEqual('Checkbox');
  //   let char2LooksBox = screen.getByTestId(`${mockCharacter2.id}-looks-box`);
  //   expect(char2LooksBox.querySelector('svg')?.getAttribute('aria-label')).toEqual('Checkmark');

  //   userEvent.click(button);

  //   // Check that PlayerPage is open
  //   await screen.findByTestId('mc-page');
  // });
});
