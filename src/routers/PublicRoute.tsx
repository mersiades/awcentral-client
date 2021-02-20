import { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

interface PublicRootProps {
  component: any;
  path: string;
  exact?: boolean;
}

const PublicRoute: FC<PublicRootProps> = ({ component: Component, ...rest }) => {
  const { keycloak } = useKeycloak();

  return (
    <Route {...rest} render={(props) => (keycloak.authenticated ? <Redirect to="/menu" /> : <Component {...props} />)} />
  );
};

export default PublicRoute;
