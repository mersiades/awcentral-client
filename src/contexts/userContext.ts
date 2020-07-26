import { User } from '../@types';
import { createContext, useContext } from 'react';

export const UserContext = createContext<User>({} as User);

export const useUser = () => useContext(UserContext);
