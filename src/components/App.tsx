import React, { FC, useState } from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import AppRouter from '../routers/AppRouter';
import { Game } from '../@types';
import { GameContext } from '../contexts/gameContext';
import SocketManager from './SocketManager';
import keycloak from '../config/keycloakConfig';

const App: FC = () => {
  const [game, setGame] = useState<Game | undefined>();

  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <SocketManager>
        <GameContext.Provider value={{ game, setGame }}>
          <AppRouter />
        </GameContext.Provider>
      </SocketManager>
    </ReactKeycloakProvider>
  );
};

export default App;
