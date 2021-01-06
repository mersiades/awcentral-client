import React, { FC, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';
import { BrowserRouter } from 'react-router-dom';
import { Grommet } from 'grommet';
import { ApolloProvider } from '@apollo/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import { FontContext } from './contexts/fontContext';
import { theme } from './config/grommetConfig';
import { apolloClient } from './config/apolloConfig';
import keycloak from './config/keycloakConfig';

interface RootProps {
  children: JSX.Element;
}

const Root: FC<RootProps> = ({ children }) => {
  const [vtksReady, setVtksReady] = useState(false);
  const [crustReady, setCrustReady] = useState(false);

  const vtksFont = new FontFaceObserver('Vtks good luck for you');
  const crustFont = new FontFaceObserver('crust_clean');

  vtksFont.load(null, 15000).then(
    () => setVtksReady(true),
    () => console.log('vtks failed to load')
  );

  crustFont.load(null, 15000).then(
    () => setCrustReady(true),
    () => console.log('crust failed to load')
  );

  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <FontContext.Provider value={{ vtksReady, crustReady }}>
          <Grommet theme={theme(vtksReady, crustReady)} full>
            <ReactKeycloakProvider
              authClient={keycloak}
              initOptions={{
                onLoad: 'login-required',
              }}
            >
              {children}
            </ReactKeycloakProvider>
          </Grommet>
        </FontContext.Provider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default Root;
