import { useQuery } from '@apollo/client';
import { Box } from 'grommet';
import { set } from 'lodash';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useGameRoles } from '../contexts/gameRoleContext';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import GAME, { GameData, GameVars } from '../queries/game';

const PreGamePage = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();
  const { data: gameData } = useQuery<GameData, GameVars>(GAME, { variables: { gameId } });
  const game = gameData?.game;
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { userGameRole, mcGameRole, allPlayerGameRoles, otherPlayerGameRoles, setGameRoles } = useGameRoles();

  // ------------------------------------------------------ Effects -------------------------------------------------------- //

  // useEffect(() => {
  //   game?.hasFinishedPreGame && history.push('')
  // }, [game])

  useEffect(() => {
    if (!!game && game.gameRoles.length > 0 && !!userId && !!setGameRoles) {
      setGameRoles(game.gameRoles, userId);
    }
  }, [game, userId, setGameRoles]);

  return (
    <Box background="black" fill align="center" justify="center">
      {gameId}
    </Box>
  );
};

export default PreGamePage;
