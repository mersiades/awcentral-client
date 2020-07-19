import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

interface PublicRootProps {
  component: any;
  path: string;
  exact: boolean;
}

const PublicRoute: FC<PublicRootProps> = ({ component: Component, ...rest }) => {
  const { authTokens } = useAuth();

  return <Route {...rest} render={(props) => (authTokens ? <Redirect to="/games" /> : <Component {...props} />)} />;
};

export default PublicRoute;
