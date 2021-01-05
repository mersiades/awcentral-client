import React, { FC, useCallback, useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Box } from 'grommet';

import AppRouter from '../routers/AppRouter';
import { TextWS } from '../config/grommetConfig';
import { KeycloakUser, KeycloakUserInfo } from '../@types';
import { KeycloakUserContext } from '../contexts/keycloakUserContext';

// import SocketManager from './SocketManager';

const App: FC = () => {
  const [user, setUser] = useState<KeycloakUser | undefined>();
  const { keycloak, initialized } = useKeycloak();

  // Calling keycloak.loadUserInfo within getUser is causing a useEffect infinite loop,
  // so getUser has been removed from the useEffect's deps list. I think the keycloak
  // is changing on every render.
  const getUser = useCallback(async () => {
    if (!!keycloak && keycloak.authenticated) {
      try {
        return (await keycloak.loadUserInfo()) as KeycloakUserInfo;
      } catch (error) {
        console.error(error);
      }
    }
  }, [keycloak]);

  useEffect(() => {
    initialized &&
      getUser().then((response) => {
        !!response && setUser({ id: response.sub, email: response.email, username: response.preferred_username });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  if (!initialized) {
    return (
      <Box fill background="black" justify="center" align="center">
        <TextWS>initializing...</TextWS>
      </Box>
    );
  }

  console.log('user', user);

  return (
    <KeycloakUserContext.Provider value={{ ...user }}>
      <AppRouter />
    </KeycloakUserContext.Provider>
  );
};

export default App;
