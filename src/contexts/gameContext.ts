import { createContext, useContext } from 'react';
import { GameContext as Game } from '../@types';

export const GameContext = createContext<Game>({} as Game);

export const useGame = () => useContext(GameContext);
