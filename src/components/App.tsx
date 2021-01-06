import React, { FC } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Box } from 'grommet';

import AppRouter from '../routers/AppRouter';
import { TextWS } from '../config/grommetConfig';

// import SocketManager from './SocketManager';

const App: FC = () => {
  const { initialized } = useKeycloak();

  if (!initialized) {
    return (
      <Box fill background="black" justify="center" align="center">
        <TextWS>initializing...</TextWS>
      </Box>
    );
  }

  return <AppRouter />;
};

export default App;
