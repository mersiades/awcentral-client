import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Switch } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import { Box } from 'grommet';
import PrivateRoute from './PrivateRoute';
import MenuPage from '../components/MenuPage';
import PublicRoute from './PublicRoute';
import GamePage from '../components/GamePage';
import CharacterCreator from '../components/CharacterCreator';
import { KeycloakUserContext } from '../contexts/keycloakUserContext';
import { KeycloakUser, KeycloakUserInfo } from '../@types';

const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/cover-background.jpg)',
};

const AppRouter = () => {
  const [user, setUser] = useState<KeycloakUser | undefined>();
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    const getUser = async () => {
      if (initialized && !!keycloak && keycloak.authenticated) {
        const { sub, email, preferred_username } = (await keycloak.loadUserInfo()) as KeycloakUserInfo;
        setUser({ id: sub, email, username: preferred_username });
      }
    };

    getUser();
  }, [keycloak, initialized]);

  if (!initialized) {
    return <Box fill background={background} />;
  }

  return (
    <Box fill>
      <KeycloakUserContext.Provider value={{ ...user }}>
        <Switch>
          <PublicRoute exact path="/" component={LandingPage} />
          <PrivateRoute path="/menu" component={MenuPage} />
          <PrivateRoute path="/game/:gameID" component={GamePage} />
          <PrivateRoute path="/new-game/:gameID" component={CharacterCreator} />
        </Switch>
      </KeycloakUserContext.Provider>
    </Box>
  );
};

export default AppRouter;
