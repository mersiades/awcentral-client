import { createContext, FC, useCallback, useContext, useState } from 'react';
import { GameRole } from '../@types/dataInterfaces';
import { Roles } from '../@types/enums';

/**
 * This context keeps track of the gameRoles for the current Game.
 * It separates out the GameRoles into the following categories:
 *  - the GameRole for the Game's MC
 *  - the GameRole for the current User
 *  - all the player GameRoles
 *  - all the player GameRoles except the current User (if they are a player)
 */

interface IGameRolesContext {
  userGameRole?: GameRole;
  mcGameRole?: GameRole;
  allPlayerGameRoles?: GameRole[];
  otherPlayerGameRoles?: GameRole[];
  setGameRoles?: (gameRoles: GameRole[], userId: string) => void;
}

interface GameRoleProviderProps {
  children: JSX.Element;
}

const GameRolesContext = createContext<IGameRolesContext>({});

export const useGameRoles = () => useContext(GameRolesContext);

export const GameRolesConsumer = GameRolesContext.Consumer;

export const GameRolesProvider: FC<GameRoleProviderProps> = ({ children }) => {
  const [userGameRole, setUserGameRole] = useState<GameRole | undefined>(undefined);
  const [mcGameRole, setMcGameRole] = useState<GameRole | undefined>(undefined);
  const [allPlayerGameRoles, setAllPlayerGameRoles] = useState<GameRole[] | undefined>(undefined);
  const [otherPlayerGameRoles, setOtherPlayerGameRoles] = useState<GameRole[] | undefined>(undefined);

  const setGameRoles = useCallback(
    (gameRoles: GameRole[], userId: string) => {
      const userGameRole = gameRoles.find((gameRole) => gameRole.userId === userId);
      const mcGameRole = gameRoles.find((gameRole) => gameRole.role === Roles.mc);
      const allPlayerGameRoles = gameRoles.filter((gameRole) => gameRole.role === Roles.player);
      const otherPlayerGameRoles = gameRoles.filter(
        (gameRole) => gameRole.role === Roles.player && gameRole.userId !== userId
      );
      setUserGameRole(userGameRole);
      setMcGameRole(mcGameRole);
      setAllPlayerGameRoles(allPlayerGameRoles);
      setOtherPlayerGameRoles(otherPlayerGameRoles);
    },
    [setUserGameRole, setMcGameRole, setAllPlayerGameRoles, setOtherPlayerGameRoles]
  );

  return (
    <GameRolesContext.Provider value={{ userGameRole, mcGameRole, allPlayerGameRoles, otherPlayerGameRoles, setGameRoles }}>
      {children}
    </GameRolesContext.Provider>
  );
};
