import { useQuery } from '@apollo/client';
import { createContext, FC, useContext, useEffect, useState } from 'react';
import { Character, Game, GameRole } from '../@types/dataInterfaces';
import { RoleType } from '../@types/enums';
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
  fetchingGame?: boolean;
  userGameRole?: GameRole;
  mcGameRole?: GameRole;
  allPlayerGameRoles?: GameRole[];
  otherPlayerGameRoles?: GameRole[];
  character?: Character;
  setGameContext?: (gameId: string, userId: string) => void;
  clearGameContext?: () => void;
}

interface GameProviderProps {
  children: JSX.Element;
  injectedGame?: Game; // Only used for mocking context in tests
  injectedUserId?: string; // Only used for mocking context in tests
}

const GameContext = createContext<IGameContext>({});

export const useGame = () => useContext(GameContext);

export const GameConsumer = GameContext.Consumer;

export const GameProvider: FC<GameProviderProps> = ({ children, injectedGame, injectedUserId }) => {
  const [gameId, setGameId] = useState<string | undefined>('');
  const [userId, setUserId] = useState<string | undefined>(injectedUserId);
  const [game, setGame] = useState<Game | undefined>(injectedGame);
  const [userGameRole, setUserGameRole] = useState<GameRole | undefined>(undefined);
  const [mcGameRole, setMcGameRole] = useState<GameRole | undefined>(undefined);
  const [allPlayerGameRoles, setAllPlayerGameRoles] = useState<GameRole[] | undefined>(undefined);
  const [otherPlayerGameRoles, setOtherPlayerGameRoles] = useState<GameRole[] | undefined>(undefined);
  const [character, setCharacter] = useState<Character | undefined>(undefined);

  const {
    data,
    loading: fetchingGame,
    stopPolling,
    // @ts-ignore
  } = useQuery<GameData, GameVars>(GAME, { variables: { gameId }, pollInterval: 2500, skip: !gameId });

  const setGameContext = (gameId: string, userId: string) => {
    setUserId(userId);
    setGameId(gameId);
  };

  const clearGameContext = () => {
    stopPolling();
    setGameId(undefined);
    setGame(undefined);
    setUserGameRole(undefined);
    setMcGameRole(undefined);
    setAllPlayerGameRoles(undefined);
    setOtherPlayerGameRoles(undefined);
    setCharacter(undefined);
  };

  useEffect(() => {
    if (!!game) {
      const userGameRole = game.gameRoles.find((gameRole) => gameRole.userId === userId);
      const mcGameRole = game.gameRoles.find((gameRole) => gameRole.role === RoleType.mc);
      const allPlayerGameRoles = game.gameRoles.filter((gameRole) => gameRole.role === RoleType.player);
      const otherPlayerGameRoles = game.gameRoles.filter(
        (gameRole) => gameRole.role === RoleType.player && gameRole.userId !== userId
      );
      if (!!userGameRole && userGameRole?.characters.length === 1) {
        setCharacter(userGameRole.characters[0]);
      } else if (!!userGameRole && userGameRole?.characters.length > 1) {
        // TODO: get PlayerPage to prompt user to select a character
      }
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
      value={{
        game,
        fetchingGame,
        userGameRole,
        mcGameRole,
        allPlayerGameRoles,
        otherPlayerGameRoles,
        character,
        setGameContext,
        clearGameContext,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
