import React, { FC, useState, useEffect } from 'react';
import AppRouter from '../routers/AppRouter';
import { AuthContext } from '../contexts/authContext';
import { Tokens, DiscordUser, Game } from '../@types';
import { getDiscordUser } from '../services/discordService';
import { DiscordUserContext } from '../contexts/discordUserContext';
import { GameContext } from '../contexts/gameContext';

const App: FC = () => {
  const [authTokens, setAuthTokens] = useState<Tokens | undefined>();
  const [user, setUser] = useState<DiscordUser | undefined>();
  const [game, setGame] = useState<Game | undefined>();

  useEffect(() => {
    const existingAccessToken = localStorage.getItem('access_token');
    const existingRefreshToken = localStorage.getItem('refresh_token');
    const existingExpiresIn = localStorage.getItem('expires_in');
    !!existingAccessToken &&
      !!existingRefreshToken &&
      !!existingExpiresIn &&
      setTokens({
        accessToken: existingAccessToken,
        refreshToken: existingRefreshToken,
        expiresIn: existingExpiresIn,
      });
  }, []);

  useEffect(() => {
    if (!!authTokens?.accessToken) {
      getUser();
    }
  }, [authTokens]);

  const getUser = async () => {
    const {
      data: { id, username, avatar, discriminator },
    } = await getDiscordUser();

    // Cors policy is blocking my efforts to get avatar from Discord from localhost
    // let avatarImage;
    // if (!!avatar) {
    //   avatarImage = await getUserAvatar(id, avatar);
    // } else if (!!discriminator) {
    //   avatarImage = await getDefaultAvatar(discriminator);
    // }
    setUser({ discordId: id, username, avatarHash: avatar });
  };

  const setTokens = (tokens: Tokens) => {
    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);
    localStorage.setItem('expires_in', tokens.expiresIn);
    setAuthTokens(tokens);
  };

  const logOut = () => {
    localStorage.clear();
    setAuthTokens(undefined);
  };

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, logOut }}>
      <DiscordUserContext.Provider value={{ ...user }}>
        <GameContext.Provider value={{ game, setGame }}>
          <AppRouter />
        </GameContext.Provider>
      </DiscordUserContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
