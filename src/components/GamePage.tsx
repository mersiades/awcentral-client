import React from 'react';
import { Roles } from '../@types/enums';
import PlayerPage from './PlayerPage';
import MCPage from './MCPage';
import { useLocation } from 'react-router-dom';

interface LocationState {
  role: Roles
}

const GamePage = () => {
  const { state: { role } } = useLocation<LocationState>()

  if (role === Roles.mc) {
    return <MCPage />;
  } else {
    return <PlayerPage />;
  }
};

export default GamePage;
