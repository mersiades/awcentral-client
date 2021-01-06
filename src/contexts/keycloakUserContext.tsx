import { KeycloakUser, KeycloakUserInfo } from '../@types';
import { FC, useCallback, useEffect, useState } from 'react';
import { createGenericContext } from './createGenericContext';
import { useKeycloak } from '@react-keycloak/web';

interface KeycloakUserProviderProps {
  children: JSX.Element;

  // Dependency injection for testing
  keycloakUser?: KeycloakUser;
}

// Using createGenericContext wraps createContext in a checker for undefined
// https://medium.com/@rivoltafilippo/typing-react-context-to-avoid-an-undefined-default-value-2c7c5a7d5947
const [useKeycloakUser, GenericProvider, KeycloakUserConsumer] = createGenericContext<KeycloakUser>();

const KeycloakUserProvider: FC<KeycloakUserProviderProps> = ({ children, keycloakUser }) => {
  const [user, setUser] = useState<KeycloakUser | undefined>(keycloakUser);
  const { keycloak, initialized } = useKeycloak();

  // Calling keycloak.loadUserInfo within getUser is causing a useEffect infinite loop,
  // so getUser has been removed from the useEffect's deps list. I think the keycloak
  // is changing on every render.
  const getUser = useCallback(async () => {
    if (!!keycloak && keycloak.authenticated) {
      try {
        return (await keycloak.loadUserInfo()) as KeycloakUserInfo;
      } catch (error) {
        console.error(error);
      }
    }
  }, [keycloak]);

  useEffect(() => {
    initialized &&
      getUser().then((response) => {
        !!response && setUser({ id: response.sub, email: response.email, username: response.preferred_username });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  return <GenericProvider value={{ ...user }}>{children}</GenericProvider>;
};

export { useKeycloakUser, KeycloakUserProvider, KeycloakUserConsumer };
