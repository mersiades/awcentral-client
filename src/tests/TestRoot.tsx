import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { Grommet } from 'grommet';
import { theme } from '../config/grommetConfig';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { createKeycloakStub } from '../../__mocks__/@react-keycloak/web';

interface KeycloakStubOptions {
  // Has the keycloak client initialized?
  isInitialized: boolean;
  // Is the User authenticated?
  isAuthenticated: boolean;
}

interface GrommetOptions {
  // Has the VTKS font loaded?
  vtksReady: boolean;

  // Has the crust_clean font loaded?
  crustReady: boolean;
}

interface TestRootProps {
  children: JSX.Element;
  keycloakStubOptions?: KeycloakStubOptions;
  grommetOptions?: GrommetOptions;
}

const defaultKeycloakStubOptions = {
  isInitialized: true,
  isAuthenticated: true,
};

const defaultGrommetOptions = {
  vtksReady: true,
  crustReady: true,
};

/**
 * Provides a Test version of Root.tsx with all of the context providers mocked or replicated.
 * To use, wrap the component being tested in <TestRoot></TestRoot> in the test's render method.
 * Pass props into it to override defaults
 */
const TestRoot: FC<TestRootProps> = ({
  children,
  keycloakStubOptions: { isInitialized, isAuthenticated } = defaultKeycloakStubOptions,
  grommetOptions: { vtksReady, crustReady } = defaultGrommetOptions,
}) => {
  return (
    <BrowserRouter>
      <MockedProvider>
        <Grommet theme={theme(vtksReady, crustReady)} full>
          <ReactKeycloakProvider authClient={createKeycloakStub(isInitialized, isAuthenticated)}>
            {children}
          </ReactKeycloakProvider>
        </Grommet>
      </MockedProvider>
    </BrowserRouter>
  );
};

export default TestRoot;
