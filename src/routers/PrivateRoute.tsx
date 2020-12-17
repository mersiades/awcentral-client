import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

interface PrivateRootProps {
  component: any;
  path: string;
  exact?: boolean;
}

const PrivateRoute: FC<PrivateRootProps> = ({ component: Component, ...rest }) => {
  const { keycloak } = useKeycloak();

  return <Route {...rest} render={(props) => (keycloak.authenticated ? <Component {...props} /> : <Redirect to="/" />)} />;
};

export default PrivateRoute;
