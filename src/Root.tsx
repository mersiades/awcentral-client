import React, { FC, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';
import { BrowserRouter } from 'react-router-dom';
import { Grommet } from 'grommet';
import { ApolloProvider } from '@apollo/client';
import { ReactKeycloakProvider } from '@react-keycloak/web';

import { FontsConsumer, FontsProvider, IFontContext } from './contexts/fontContext';
import { theme } from './config/grommetConfig';
import { apolloClient } from './config/apolloConfig';
import keycloak from './config/keycloakConfig';

interface RootProps {
  children: JSX.Element;
}

const Root: FC<RootProps> = ({ children }) => {
  // const [vtksReady, setVtksReady] = useState(false);
  // const [crustReady, setCrustReady] = useState(false);

  // const vtksFont = new FontFaceObserver('Vtks good luck for you');
  // const crustFont = new FontFaceObserver('crust_clean');

  // vtksFont.load(null, 15000).then(
  //   () => setVtksReady(true),
  //   () => console.log('vtks failed to load')
  // );

  // crustFont.load(null, 15000).then(
  //   () => setCrustReady(true),
  //   () => console.log('crust failed to load')
  // );

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
                    {children}
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
