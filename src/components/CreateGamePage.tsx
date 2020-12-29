import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';
import { Box } from 'grommet';

import CommsForm from './CommsForm';
import GameCreationStepper from './GameCreationStepper';
import InviteesForm from './InviteesForm';
import Spinner from './Spinner';
import CloseButton from './CloseButton';
import GAME, { GameData, GameVars } from '../queries/game';

export const background = {
  color: 'black',
  dark: true,
  position: 'right top',
  size: 'contain',
  image: 'url(/images/background-image-4.jpg)',
};

const CreateGamePage = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [creationStep, setCreationStep] = useState<number>(0);

  // -------------------------------------------------- Context hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: gameData, loading: loadingGame } = useQuery<GameData, GameVars>(
    GAME,
    //@ts-ignore
    { variables: { gameId }, skip: !gameId }
  );

  const game = gameData?.game;

  // ---------------------------------------------------- UseEffects  ------------------------------------------------------ //
  useEffect(() => {
    if (!!game) {
      if (!game.commsApp || !game.commsUrl) {
        setCreationStep(0);
      } else {
        setCreationStep(1);
      }
    }
  }, [gameId, game, setCreationStep]);

  // -------------------------------------------------- Render component ---------------------------------------------------- //

  if (loadingGame || !game) {
    return (
      <Box fill background="black">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box fill background={background} pad="6px" overflow={{ vertical: 'auto' }}>
      <CloseButton handleClose={() => history.push('/menu')} />
      <Box fill direction="column" justify="start">
        <GameCreationStepper setCreationStep={setCreationStep} currentStep={creationStep} game={game} />
        {creationStep === 0 && <CommsForm game={game} setCreationStep={setCreationStep} />}
        {creationStep === 1 && <InviteesForm game={game} />}
      </Box>
    </Box>
  );
};

export default CreateGamePage;
