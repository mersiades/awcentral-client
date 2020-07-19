import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import { Box } from 'grommet';

const AppRouter = () => {
  return (
    <Box fill>
      <Switch>
        <Route path="/" component={LandingPage} />
      </Switch>
    </Box>
  );
};

export default AppRouter;
