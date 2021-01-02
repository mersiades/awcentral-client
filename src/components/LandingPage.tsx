import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Box } from 'grommet';
import Spinner from './Spinner';

const LandingPage = () => {
  // --------------------------------------- Hooking into contexts ---------------------------------------------- //
  const { keycloak } = useKeycloak();

  // ----------------------------------------- Render component  ------------------------------------------------ //
  return (
    <Box fill background="black" justify="center" align="center">
      {!keycloak.authenticated && <Spinner />}
    </Box>
  );
};

export default LandingPage;
