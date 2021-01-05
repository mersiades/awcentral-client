import React from 'react';
import { renderWithRouter } from './test-utils';
import { getAllByRole, getByTestId, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestRoot from './TestRoot';
import { mockKeycloakStub } from '../../__mocks__/@react-keycloak/web';
import { mockKeycloakUser1, mockKeycloakUserInfo, mockNewGameName } from './mocks';
import App from '../components/App';
import { mockCreateGame, mockGameRolesByUserId } from './mockQueries';

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
      apolloMocks: [mockGameRolesByUserId, mockCreateGame],
    });

    const button = await screen.findByRole('button', { name: /CREATE GAME/i });

    // screen.debug();

    // userEvent.click(button);
    // const closeIcon = screen.getByTestId('create-game-close-icon');
    // expect(closeIcon).toBeInTheDocument();
    // const heading = screen.getByRole('heading', { name: /CREATE GAME/i });
    // expect(heading).toBeInTheDocument();
    // const submitButton = screen.getByRole('button', { name: /SUBMIT/i });
    // expect(submitButton).toBeInTheDocument();
    // const input = screen.getByRole('textbox');
    // expect(input.getAttribute('placeholder')).toEqual(`${mockKeycloakUser1.username}'s game`);
    // // @ts-ignore
    // expect(input.value).toEqual('');

    // userEvent.type(input, mockNewGameName);
    // // @ts-ignore
    // expect(input.value).toBe(mockNewGameName);

    // userEvent.click(submitButton);
    // // There should be a spinner replacing the button text
    // const spinner = screen.getByTestId('spinner');
    // expect(spinner).toBeInTheDocument();

    // await waitFor(() => {
    //   expect(screen.getByRole('button')).toBeInTheDocument();
    // });
  });
});
