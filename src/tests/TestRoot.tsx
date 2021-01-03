import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { Grommet } from 'grommet';
import { theme } from '../config/grommetConfig';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { createKeycloakStub } from '../../__mocks__/@react-keycloak/web';

interface TestRootProps {
  children: JSX.Element;
}

const TestRoot: FC<TestRootProps> = ({ children }) => {
  const vtksReady = true;
  const crustReady = true;
  return (
    <BrowserRouter>
      <MockedProvider>
        <Grommet theme={theme(vtksReady, crustReady)} full>
          <ReactKeycloakProvider authClient={createKeycloakStub()}>{children}</ReactKeycloakProvider>
        </Grommet>
      </MockedProvider>
    </BrowserRouter>
  );
};

export default TestRoot;
