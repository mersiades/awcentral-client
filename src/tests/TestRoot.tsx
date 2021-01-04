import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Grommet } from 'grommet';
import { theme } from '../config/grommetConfig';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { mockKeycloakStub } from '../../__mocks__/@react-keycloak/web';

interface KeycloakStubOptions {
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
  apolloMocks?: MockedResponse[];
}

const defaultKeycloakStubOptions = {
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
  keycloakStubOptions: { isAuthenticated } = defaultKeycloakStubOptions,
  grommetOptions: { vtksReady, crustReady } = defaultGrommetOptions,
  apolloMocks = [],
}) => {
  return (
    <BrowserRouter>
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        <Grommet theme={theme(vtksReady, crustReady)} full>
          <ReactKeycloakProvider
            authClient={mockKeycloakStub(isAuthenticated)}
            initOptions={{
              onLoad: 'login-required',
            }}
          >
            {children}
          </ReactKeycloakProvider>
        </Grommet>
      </MockedProvider>
    </BrowserRouter>
  );
};

export default TestRoot;
