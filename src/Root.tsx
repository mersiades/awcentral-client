import React, { FC, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Grommet } from 'grommet';
import { theme } from './config/grommetConfig';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './config/apolloConfig';
import FontFaceObserver from 'fontfaceobserver';
import { FontContext } from './contexts/fontContext';

interface RootProps {
  children: JSX.Element;
}

const Root: FC<RootProps> = ({ children }) => {
  const [vtksReady, setVtksReady] = useState(false);
  const [crustReady, setCrustReady] = useState(false);

  const vtksFont = new FontFaceObserver('Vtks good luck for you');
  const crustFont = new FontFaceObserver('Vtks good luck for you');

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
            {children}
          </Grommet>
        </FontContext.Provider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default Root;
