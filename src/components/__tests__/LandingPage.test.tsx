import React from 'react';
import { render } from '../../utils/test-utils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import generateRandomString from '../../utils/__mocks__/generateRandomString';
import LandingPage from '../LandingPage';

jest.mock('../../utils/generateRandomString');

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
