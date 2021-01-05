import React from 'react';
import { findByTestId, getAllByRole, getByTestId, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../components/App';
import { renderWithRouter } from './test-utils';
import { mockKeycloakStub } from '../../__mocks__/@react-keycloak/web';
import { mockKeycloakUser1, mockKeycloakUserInfo, mockNewGameName } from './mocks';
import { mockCreateGame, mockGameForNewGame, mockGameRolesByUserId } from './mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo), initialized: true }),
  };
});

describe('Testing flow for creating a game', () => {
  test('should render and submit create game form', async () => {
    renderWithRouter(<App />, '/menu', {
      isAuthenticated: true,
      apolloMocks: [mockGameRolesByUserId, mockCreateGame, mockGameForNewGame, mockGameRolesByUserId],
    });

    const button = await screen.findByRole('button', { name: /CREATE GAME/i });

    userEvent.click(button);
    const closeIcon = screen.getByTestId('create-game-close-icon');
    expect(closeIcon).toBeInTheDocument();
    let heading = screen.getByRole('heading', { name: /CREATE GAME/i });
    expect(heading).toBeInTheDocument();
    const submitButton = screen.getByRole('button', { name: /SUBMIT/i });
    expect(submitButton).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('placeholder')).toEqual(`${mockKeycloakUser1.username}'s game`);
    // @ts-ignore
    expect(input.value).toEqual('');

    userEvent.type(input, mockNewGameName);
    // @ts-ignore
    expect(input.value).toBe(mockNewGameName);

    userEvent.click(submitButton);
    // There should be a spinner replacing the button text
    let spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();

    const CreateGamePage = await screen.findByTestId('create-game-page');
    expect(CreateGamePage).toBeInTheDocument();

    // screen.debug();
    const select = await screen.findByRole('heading');

    // await waitFor(() => {
    //   expect(screen.getByRole('button')).toBeInTheDocument();
    // });
  });
});
