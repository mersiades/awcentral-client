import React from 'react';
import { render } from '../../utils/test-utils';
import { fireEvent } from '@testing-library/react';
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

  test('should render LandingPage in initial state', () => {
    const { getByText, getByAltText } = render(<LandingPage />);
    const loginButton = getByText('LOG IN');
    const heading = getByText('Log in with Discord');
    const helperText = getByText("You'll need a Discord account to rock the apocalypse with us");
    const coverTitle = getByAltText('D. Vincent Baker & Meguey Baker Apocalypse World');
    expect(loginButton).toBeInTheDocument();
    expect(coverTitle).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(helperText).toBeInTheDocument();
    expect(setItemSpy).toHaveBeenCalledWith('stateParameter', generateRandomString());
    expect(getItemSpy).toHaveBeenCalledWith('stateParameter');
    expect(getItemSpy).toHaveBeenCalledWith('access_token');
    expect(loginButton).toBeInTheDocument();
    jest.clearAllMocks();
  });

  test('should navigate to Discord on click', () => {
    const { getByText } = render(<LandingPage />);
    fireEvent.click(getByText('LOG IN'));
  });
});
