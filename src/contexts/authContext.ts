import { createContext, useContext } from 'react';
import { Tokens } from '../@types';

// export const defaultValue = {} as { authTokens: Tokens, setAuthTokens: (tokens: Tokens) => void}

interface AuthContext {
  authTokens?: Tokens;
  setAuthTokens: (tokens: Tokens) => void;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

export const useAuth = () => useContext(AuthContext);
