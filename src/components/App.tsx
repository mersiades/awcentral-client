import React, { FC, useState, useEffect } from 'react';
import AppRouter from '../routers/AppRouter';
import { AuthContext } from '../contexts/auth';
import { Tokens } from '../@types';

const App: FC = () => {
  const [authTokens, setAuthTokens] = useState<Tokens | undefined>();

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
      <AppRouter />
    </AuthContext.Provider>
  );
};

export default App;
