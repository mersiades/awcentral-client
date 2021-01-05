import React from 'react';
import { render } from '../utils/test-utils';
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

jest.mock('../contexts/fontContext', () => {
  return {
    useFonts: () => ({ vtksReady: true, crustReady: true }),
  };
});

// jest.mock('../contexts/keycloakUserContext', () => {
//   return {
//     useKeycloakUser: () => ({
//       id: mockKeycloakUserInfo.sub,
//       username: mockKeycloakUserInfo.preferred_username,
//       email: mockKeycloakUserInfo.email,
//     }),
//   };
// });

describe('Testing flow for creating a game', () => {
  test('should render and submit create game form', async () => {
    // React and I are having issues with act() warnings. This disables them.
    // See https://github.com/facebook/react/issues/15379
    const consoleError = console.error;
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      if (!args[0].includes('Warning: An update to %s inside a test was not wrapped in act')) {
        consoleError(...args);
      }
    });

    render(
      <TestRoot apolloMocks={[mockGameRolesByUserId, mockCreateGame]}>
        <App />
      </TestRoot>
    );
    screen.debug();

    const button = await screen.findByRole('button', { name: /CREATE GAME/i });

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
