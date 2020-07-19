import React from 'react';
import { Switch } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import { Box } from 'grommet';
import PrivateRoute from './PrivateRoute';
import MenuPage from '../components/MenuPage';
import PublicRoute from './PublicRoute';

const AppRouter = () => {
  return (
    <Box fill>
      <Switch>
        <PrivateRoute path="/games" component={MenuPage} />
        <PublicRoute exact path="/" component={LandingPage} />
      </Switch>
    </Box>
  );
};

export default AppRouter;
