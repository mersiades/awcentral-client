import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../components/App';
import { renderWithRouter } from './test-utils';
import { mockKeycloakStub } from '../../__mocks__/@react-keycloak/web';
import { mockKeycloakUser1, mockKeycloakUserInfo, mockNewGameName } from './mocks';
import {
  mockAddCommsApp,
  mockAddCommsUrl,
  mockAddInvitee1,
  mockAddInvitee2,
  mockCreateGame,
  mockGameAfterAddCommsApp,
  mockGameAfterAddCommsUrl,
  mockGameAfterAddInvitee1,
  mockGameAfterAddInvitee2,
  mockGameForNewGame,
  mockGameRolesByUserId,
} from './mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo), initialized: true }),
  };
});

describe('Testing flow for creating a game', () => {
  test('should create a game with all comms app, comms url and two invitees', async () => {
    renderWithRouter(<App />, '/menu', {
      isAuthenticated: true,
      apolloMocks: [
        mockGameRolesByUserId,
        mockCreateGame,
        mockGameForNewGame,
        mockGameRolesByUserId,
        mockAddCommsApp,
        mockGameAfterAddCommsApp,
        mockAddCommsUrl,
        mockGameAfterAddCommsUrl,
        mockAddInvitee1,
        mockGameAfterAddInvitee1,
        mockAddInvitee2,
        mockGameAfterAddInvitee2,
      ],
    });

    // Click button to open the create game mini-form
    const button = await screen.findByRole('button', { name: /CREATE GAME/i });
    userEvent.click(button);

    // Check the game name input is correctly set up
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('placeholder')).toEqual(`${mockKeycloakUser1.username}'s game`);
    // @ts-ignore
    expect(input.value).toEqual('');

    // Enter the new game's name
    userEvent.type(input, mockNewGameName);
    // @ts-ignore
    expect(input.value).toBe(mockNewGameName);

    // Click to submit and create game
    userEvent.click(screen.getByRole('button', { name: /SUBMIT/i }));

    // Check spinner in SUBMIT button
    screen.getByTestId('spinner');

    // Check have navigated to /create-game
    await screen.findByTestId('create-game-page');

    // Check the game's name is in the GameCreationStepper
    const nameBox = await screen.findByTestId('name-box');
    await screen.findByTestId('channel-box'); // For some reason I need to advance by two 'ticks' here
    await screen.findByTestId('channel-box'); // It's related to adding createGenericContext
    expect(nameBox.textContent).toEqual('Name' + mockNewGameName);

    // Open the comms app drop list
    userEvent.click(screen.getByRole('button', { name: 'Open Drop' }));

    // Select 'Discord' from the list
    userEvent.click(screen.getByRole('menuitem', { name: 'Discord' }));
    expect(screen.getByRole('button', { name: 'Open Drop' }).querySelector('input')?.value).toEqual('Discord');

    // Set 'Discord' as the comms app
    userEvent.click(screen.getByTestId('button-set-app'));
    let channelBox = await screen.findByTestId('channel-box');
    expect(channelBox.textContent).toContain('Discord');

    // Type in a url to the Discord channel
    const textArea = await screen.findByRole('textbox', { name: 'comms-url-input' });
    userEvent.type(textArea, 'https://discord.com/urltodiscordchannel');
    screen.getByText('https://discord.com/urltodiscordchannel');

    // Set the comms channel url
    userEvent.click(screen.getByTestId('button-set-url'));
    screen.getByTestId('spinner');
    channelBox = await screen.findByTestId('channel-box');
    expect(channelBox.textContent).toContain('Discord @ https://discord.com/urltodiscordchannel');

    // Enter an email address for an invitee
    let inviteeInput = screen.getByRole('textbox');
    userEvent.type(inviteeInput, 'mockUser2@email.com');
    // @ts-ignore
    expect(inviteeInput.value).toEqual('mockUser2@email.com');

    // Add the email to the invitees
    userEvent.click(screen.getByRole('button', { name: /ADD/i }));
    let invitationTextarea = screen.getByRole('textbox');
    expect(invitationTextarea.textContent).toContain(mockNewGameName);
    expect(invitationTextarea.textContent).toContain('mockUser2@email.com');
    let invitationsBox = await screen.findByTestId('invitations-box');
    expect(invitationsBox.textContent).toContain('mockUser2@email.com');

    // Click the INVITE ANOTHER button
    userEvent.click(screen.getByRole('button', { name: /INVITE ANOTHER/i }));

    // Type another email
    userEvent.type(screen.getByRole('textbox'), 'mockUser3@email.com');
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual('mockUser3@email.com');

    // Add the second email to the invitees list
    userEvent.click(screen.getByRole('button', { name: /ADD/i }));
    invitationTextarea = screen.getByRole('textbox');
    expect(invitationTextarea.textContent).toContain(mockNewGameName);
    expect(invitationTextarea.textContent).toContain('mockUser3@email.com');
    invitationsBox = await screen.findByTestId('invitations-box');
    expect(invitationsBox.textContent).toContain('mockUser3@email.com');

    // Click the FINISH button
    userEvent.click(screen.getByRole('button', { name: /FINISH/i }));

    // Check have navigated to /mc-page
    screen.getAllByTestId('mc-page');
  });

  // skipping app

  // skipping url

  // skipping invitees

  // skip app, add invitee, then go back and add app
});
