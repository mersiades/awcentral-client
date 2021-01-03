import React, { FC, useState } from 'react';

import AppRouter from '../routers/AppRouter';
import { Game } from '../@types';
import { GameContext } from '../contexts/gameContext';
// import SocketManager from './SocketManager';

const App: FC = () => {
  const [game, setGame] = useState<Game | undefined>();

  return (
    <GameContext.Provider value={{ game, setGame }}>
      <AppRouter />
    </GameContext.Provider>
  );
};

export default App;
