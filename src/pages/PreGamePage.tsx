import { useQuery } from '@apollo/client';
import { Box } from 'grommet';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import GAME, { GameData, GameVars } from '../queries/game';

const PreGamePage = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();
  const { data: gameData } = useQuery<GameData, GameVars>(GAME, { variables: { gameId } });
  const game = gameData?.game;
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //

  // ------------------------------------------------------ Effects -------------------------------------------------------- //

  // useEffect(() => {
  //   game?.hasFinishedPreGame && history.push('')
  // }, [game])
  return (
    <Box background="black" fill align="center" justify="center">
      {gameId}
    </Box>
  );
};

export default PreGamePage;
