import { KeycloakUser, KeycloakUserInfo } from '../@types';
import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

interface KeycloakUserProviderProps {
  children: JSX.Element;

  // Dependency injection for testing
  keycloakUser?: KeycloakUser;
}

/**
 * KeycloakUserContext maintains the User's data - id, email and displayName.
 * AWCentral derives this data from how the User registered with Keycloak.
 * In other words, when AWCentral creates a new User, it uses the User's
 * Keycloak id, email, displayName to create it.
 */
const KeyCloakUserContext = createContext<KeycloakUser>({});

export const useKeycloakUser = () => useContext(KeyCloakUserContext);

export const KeycloakUserConsumer = KeyCloakUserContext.Consumer;

export const KeycloakUserProvider: FC<KeycloakUserProviderProps> = ({ children, keycloakUser }) => {
  const [user, setUser] = useState<KeycloakUser | undefined>(keycloakUser);
  const { keycloak, initialized } = useKeycloak();

  // Calling keycloak.loadUserInfo within getUser() is causing a useEffect infinite loop,
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

  return <KeyCloakUserContext.Provider value={{ ...user }}>{children}</KeyCloakUserContext.Provider>;
};
