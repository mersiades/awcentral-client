import React, { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';

interface PublicRootProps {
  component: any;
  path: string;
  exact?: boolean;
}

const PublicRoute: FC<PublicRootProps> = ({ component: Component, ...rest }) => {
  const accessToken = localStorage.getItem('access_token');
  const expiresIn = localStorage.getItem('expires_in');
  const isLoggedIn = accessToken?.length === 30 && !!expiresIn && parseInt(expiresIn) > 0;
  console.log('accessToken length', accessToken?.length);

  return <Route {...rest} render={(props) => (isLoggedIn ? <Redirect to="/menu" /> : <Component {...props} />)} />;
};

export default PublicRoute;
