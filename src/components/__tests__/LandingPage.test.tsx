import React from 'react';
import { render } from '../../utils/test-utils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import LandingPage, { getDiscordUrl } from '../LandingPage';
import generateRandomString from '../../utils/__mocks__/generateRandomString';
import { DISCORD_CLIENT_ID } from '../../config/discordConfig';

jest.mock('../../utils/generateRandomString');

describe('Testing getDiscordUrl', () => {
  test('should generate url without state', () => {
    const expectedUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify`;
    const returnedUrl = getDiscordUrl();
    expect(returnedUrl).toEqual(expectedUrl);
  });
});

describe('Rendering Landing Page', () => {
  const setItemSpy = jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem');
  const getItemSpy = jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem');

  test('should render LandingPage in initial state', async () => {
    const rerender = render(<LandingPage />);
    const loginButton = screen.getByRole('link', { name: /log in/i });
    const heading = screen.getByRole('heading', { name: /Log in with Discord/i });
    const helperText = screen.getByText("You'll need a Discord account to rock the apocalypse with us");
    const coverTitle = screen.getByRole('img', { name: /D. Vincent Baker & Meguey Baker Apocalypse World/i });
    expect(loginButton).toBeInTheDocument();
    expect(coverTitle).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(helperText).toBeInTheDocument();
    expect(setItemSpy).toHaveBeenCalledWith('stateParameter', generateRandomString());
    expect(getItemSpy).toHaveBeenCalledWith('stateParameter');
    expect(getItemSpy).toHaveBeenCalledWith('access_token');
    jest.clearAllMocks();
  });
});
