import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Grommet } from 'grommet';
import { theme } from './config/grommetConfig';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './config/apolloConfig';

interface RootProps {
  children: JSX.Element;
}

const Root: FC<RootProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <Grommet theme={theme} full>
          {children}
        </Grommet>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default Root;
