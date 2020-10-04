import { DiscordUser } from '../@types';
import { createContext, useContext } from 'react';

export const DiscordUserContext = createContext<DiscordUser>({} as DiscordUser);

export const useDiscordUser = () => useContext(DiscordUserContext);
