import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

interface PrivateRootProps {
  component: any;
  path: string;
}

const PrivateRoute: FC<PrivateRootProps> = ({ component: Component, ...rest }) => {
  const { authTokens } = useAuth();

  return <Route {...rest} render={(props) => (authTokens ? <Component {...props} /> : <Redirect to="/" />)} />;
};

export default PrivateRoute;
