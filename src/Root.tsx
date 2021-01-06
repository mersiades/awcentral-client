import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Grommet } from 'grommet';
import { ApolloProvider } from '@apollo/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import { FontsConsumer, FontsProvider } from './contexts/fontContext';
import { theme } from './config/grommetConfig';
import { apolloClient } from './config/apolloConfig';
import keycloak from './config/keycloakConfig';
import { KeycloakUserProvider } from './contexts/keycloakUserContext';

interface RootProps {
  children: JSX.Element;
}

const Root: FC<RootProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <FontsProvider>
          <FontsConsumer>
            {(context) => {
              const isVtksReady = context?.vtksReady || false;
              const isCrustReady = context?.crustReady || false;
              return (
                <Grommet theme={theme(isVtksReady, isCrustReady)} full>
                  <ReactKeycloakProvider
                    authClient={keycloak}
                    initOptions={{
                      onLoad: 'login-required',
                    }}
                  >
                    <KeycloakUserProvider>{children}</KeycloakUserProvider>
                  </ReactKeycloakProvider>
                </Grommet>
              );
            }}
          </FontsConsumer>
        </FontsProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default Root;
