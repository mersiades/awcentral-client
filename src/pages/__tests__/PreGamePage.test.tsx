import React from 'react';
import wait from 'waait';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../components/App';
import { renderWithRouter } from '../../tests/test-utils';
import { mockKeycloakStub } from '../../../__mocks__/@react-keycloak/web';
import { mockCharacter1, mockCharacter2, mockGame5, mockKeycloakUser2, mockKeycloakUserInfo2 } from '../../tests/mocks';
import { mockGameForPreGame1, mockGameForPreGame2 } from '../../tests/mockQueries';
import { decapitalize } from '../../helpers/decapitalize';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo2), initialized: true }),
  };
});

describe('Rendering PreGamePage', () => {
  test('should render of MC with two Characters', async () => {
    renderWithRouter(<App />, `/pre-game/${mockGame5.id}`, {
      isAuthenticated: true,
      keycloakUser: mockKeycloakUser2,
      apolloMocks: [mockGameForPreGame1, mockGameForPreGame2],
    });
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
});

/**
 * Name "PRE-GAME":
      <h2
        class="StyledHeading-sc-1rdh4aw-0 fJuNWZ sc-gsTCUz fndJmk"
      />

      Name "Mock Character 1 -- Battlebabe":
      <h3
        class="StyledHeading-sc-1rdh4aw-0 gwqNst sc-gsTCUz fndJmk"
      />

      Name "Name -- Playbook":
      <h3
        class="StyledHeading-sc-1rdh4aw-0 gwqNst sc-gsTCUz fndJmk"
      />

      --------------------------------------------------
      button:

      Name "START GAME":
      <button
        class="StyledButtonKind-sc-1vhfpnt-0 cmBmdm"
        disabled=""
        kind="primary"
        type="button"
      />

      --------------------------------------------------
      list:

      Name "":
      <ul />

      --------------------------------------------------
      listitem:

      Name "":
      <li />

      Name "":
      <li />

      Name "":
      <li />

      Name "":
      <li />

      Name "":
      <li />

      --------------------------------------------------
 */
