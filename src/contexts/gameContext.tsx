import { useQuery } from '@apollo/client';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { Game, GameRole } from '../@types/dataInterfaces';
import { Roles } from '../@types/enums';
import GAME, { GameData, GameVars } from '../queries/game';

/**
 * This context keeps track of the current Game. In particular,
 * it separates out the GameRoles into the following categories:
 *  - the GameRole for the Game's MC
 *  - the GameRole for the current User
 *  - all the player GameRoles
 *  - all the player GameRoles except the current User (if they are a player)
 */

interface IGameContext {
  game?: Game;
  userGameRole?: GameRole;
  mcGameRole?: GameRole;
  allPlayerGameRoles?: GameRole[];
  otherPlayerGameRoles?: GameRole[];
  setGameContext?: (gameId: string, userId: string) => void;
}

interface GameProviderProps {
  children: JSX.Element;
}

const GameContext = createContext<IGameContext>({});

export const useGame = () => useContext(GameContext);

export const GameConsumer = GameContext.Consumer;

export const GameProvider: FC<GameProviderProps> = ({ children }) => {
  const [gameId, setGameId] = useState<string | undefined>('');
  const [userId, setUserId] = useState<string | undefined>('');
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [userGameRole, setUserGameRole] = useState<GameRole | undefined>(undefined);
  const [mcGameRole, setMcGameRole] = useState<GameRole | undefined>(undefined);
  const [allPlayerGameRoles, setAllPlayerGameRoles] = useState<GameRole[] | undefined>(undefined);
  const [otherPlayerGameRoles, setOtherPlayerGameRoles] = useState<GameRole[] | undefined>(undefined);

  // @ts-ignore
  const { data } = useQuery<GameData, GameVars>(GAME, { variables: { gameId }, pollInterval: 2500, skip: !gameId });

  const setGameContext = (gameId: string, userId: string) => {
    setUserId(userId);
    setGameId(gameId);
  };

  useEffect(() => {
    if (!!game) {
      const userGameRole = game.gameRoles.find((gameRole) => gameRole.userId === userId);
      const mcGameRole = game.gameRoles.find((gameRole) => gameRole.role === Roles.mc);
      const allPlayerGameRoles = game.gameRoles.filter((gameRole) => gameRole.role === Roles.player);
      const otherPlayerGameRoles = game.gameRoles.filter(
        (gameRole) => gameRole.role === Roles.player && gameRole.userId !== userId
      );
      setUserGameRole(userGameRole);
      setMcGameRole(mcGameRole);
      setAllPlayerGameRoles(allPlayerGameRoles);
      setOtherPlayerGameRoles(otherPlayerGameRoles);
    }
  }, [game, userId, setUserGameRole, setMcGameRole, setAllPlayerGameRoles, setOtherPlayerGameRoles]);

  useEffect(() => {
    !!data && setGame(data.game);
  }, [data]);

  return (
    <GameContext.Provider
      value={{ game, userGameRole, mcGameRole, allPlayerGameRoles, otherPlayerGameRoles, setGameContext }}
    >
      {children}
    </GameContext.Provider>
  );
};
