import React from 'react';
import { render } from '../../utils/test-utils';
import { getAllByRole, getByTestId, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestRoot from '../../tests/TestRoot';
import { mockKeycloakStub } from '../../../__mocks__/@react-keycloak/web';
import { mockKeycloakUser1, mockKeycloakUserInfo, mockNewGameName } from '../../tests/mocks';
import MenuPage from '../MenuPage';
import { mockCreateGame, mockGameRolesByUserId } from '../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo), initialized: true }),
  };
});

jest.mock('../../contexts/fontContext', () => {
  return {
    useFonts: () => ({ vtksReady: true, crustReady: true }),
  };
});

jest.mock('../../contexts/keycloakUserContext', () => {
  return {
    useKeycloakUser: () => ({
      id: mockKeycloakUserInfo.sub,
      username: mockKeycloakUserInfo.preferred_username,
      email: mockKeycloakUserInfo.email,
    }),
  };
});

describe('Rendering MenuPage', () => {
  test('should render spinner when no gameRoles', () => {
    render(
      <TestRoot>
        <MenuPage />
      </TestRoot>
    );

    const welcomeHeading = screen.getByRole('heading');
    expect(welcomeHeading.textContent).toEqual(`Welcome, ${mockKeycloakUserInfo.preferred_username}`);
    const titleImage = screen.getByRole('img');
    expect(titleImage.getAttribute('alt')).toEqual('D. Vincent Baker & Meguey Baker Apocalypse World');
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('should render buttons when gameRoles', async () => {
    render(
      <TestRoot apolloMocks={[mockGameRolesByUserId]}>
        <MenuPage />
      </TestRoot>
    );

    const buttons = await screen.findAllByRole('button');
    expect(buttons[0].textContent).toEqual('RETURN TO GAME');
    expect(buttons[1].textContent).toEqual('JOIN GAME');
    expect(buttons[2].textContent).toEqual('CREATE GAME');
    expect(buttons[3].textContent).toEqual('LOG OUT');
  });

  test('should render and submit create game form', async () => {
    render(
      <TestRoot apolloMocks={[mockGameRolesByUserId, mockCreateGame]}>
        <MenuPage />
      </TestRoot>
    );

    const button = await screen.findByRole('button', { name: /CREATE GAME/i });

    userEvent.click(button);
    const closeIcon = screen.getByTestId('create-game-close-icon');
    expect(closeIcon).toBeInTheDocument();
    const heading = screen.getByRole('heading', { name: /CREATE GAME/i });
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
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
