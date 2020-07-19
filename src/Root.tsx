import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Grommet } from 'grommet';
import { theme } from './config/grommetConfig';

interface RootProps {
  children: JSX.Element;
}

const Root: FC<RootProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <Grommet theme={theme} full>
        {children}
      </Grommet>
    </BrowserRouter>
  );
};

export default Root;
