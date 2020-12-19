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

  /**
   * If an unauthorised user navigates directly to a private page, such as when joining a new game via a link given in invitation email,
   * redirect them to the Keycloak login page. If they successfully login, Keycloak will redirect them to the private page
   * they originally wanted to access
   */
  if (!keycloak.authenticated) {
    keycloak.login();
  }

  /**
   * As a fallback option, redirect unauthorised users to LandingPage
   */
  return <Route {...rest} render={(props) => (keycloak.authenticated ? <Component {...props} /> : <Redirect to="/" />)} />;
};

export default PrivateRoute;
