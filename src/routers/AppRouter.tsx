import React from 'react';
import { Switch } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import { Box } from 'grommet';
import PrivateRoute from './PrivateRoute';
import MenuPage from '../components/MenuPage';
import PublicRoute from './PublicRoute';
import GamePage from '../components/GamePage';

const AppRouter = () => {
  return (
    <Box fill>
      <Switch>
        <PrivateRoute path="/menu" component={MenuPage} />
        <PrivateRoute path="/game/:gameID" component={GamePage} />
        <PublicRoute exact path="/" component={LandingPage} />
      </Switch>
    </Box>
  );
};

export default AppRouter;
