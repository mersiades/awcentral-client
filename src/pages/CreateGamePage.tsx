import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';
import { Box } from 'grommet';

import CommsForm from '../components/CommsForm';
import GameCreationStepper from '../components/GameCreationStepper';
import InviteesForm from '../components/InviteesForm';
import Spinner from '../components/Spinner';
import CloseButton from '../components/CloseButton';
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
  const [hasSkippedComms, setHasSkippedComms] = useState(false);

  // -------------------------------------------------- Context hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: gameData } = useQuery<GameData, GameVars>(
    GAME,
    //@ts-ignore
    { variables: { gameId }, skip: !gameId }
  );

  const game = gameData?.game;
  // console.log('game', game);

  // ---------------------------------------------------- UseEffects  ------------------------------------------------------ //
  useEffect(() => {
    if (!!game) {
      if ((!game.commsApp || !game.commsUrl) && !hasSkippedComms) {
        setCreationStep(1);
      } else {
        setCreationStep(2);
      }
    }
  }, [gameId, game, hasSkippedComms, setCreationStep]);

  // -------------------------------------------------- Render component ---------------------------------------------------- //

  return (
    <Box data-testid="create-game-page" fill background={background} pad="6px" overflow={{ vertical: 'auto' }}>
      {!game && (
        <div style={{ position: 'absolute', top: 'calc(50vh - 12px)', left: 'calc(50vw - 12px)' }}>
          <Spinner />
        </div>
      )}
      <CloseButton handleClose={() => history.push('/menu')} />
      <Box fill direction="column" justify="start">
        <GameCreationStepper
          setCreationStep={setCreationStep}
          currentStep={creationStep}
          game={game}
          setHasSkippedComms={setHasSkippedComms}
        />
        {creationStep === 1 && (
          <CommsForm game={game} setCreationStep={setCreationStep} setHasSkippedComms={setHasSkippedComms} />
        )}
        {creationStep === 2 && <InviteesForm game={game} />}
      </Box>
    </Box>
  );
};

export default CreateGamePage;
