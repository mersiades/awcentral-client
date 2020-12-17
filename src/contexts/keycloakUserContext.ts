import { KeycloakUser } from '../@types';
import { createContext, useContext } from 'react';

export const KeycloakUserContext = createContext<KeycloakUser>({} as KeycloakUser);

export const useKeycloakUser = () => useContext(KeycloakUserContext);
