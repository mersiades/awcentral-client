import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Box, FormField, TextInput } from 'grommet';

import DialogWrapper from './DialogWrapper';
import { HeadingWS, ParagraphWS, RedBox, ButtonWS, BarterRollBackground } from '../config/grommetConfig';
import PERFORM_BARTER_ROLL_MOVE, {
  PerformBarterRollMoveData,
  PerformBarterRollMoveVars,
} from '../mutations/performBarterRollMove';
import { Move, CharacterMove } from '../@types/staticDataInterfaces';
import { useFonts } from '../contexts/fontContext';
import { useGame } from '../contexts/gameContext';

interface BarterRollDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const BarterRollDialog: FC<BarterRollDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [barter, setBarter] = useState(0);
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performBarterRollMove, { loading: performingBarterRollMove }] = useMutation<
    PerformBarterRollMoveData,
    PerformBarterRollMoveVars
  >(PERFORM_BARTER_ROLL_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const currentBarter = userGameRole?.characters[0].barter || 0;

  const handleBarterRollMove = (move: Move | CharacterMove, barter: number) => {
    if (currentBarter - barter < 0) {
      console.warn("You don't have enough barter");
      return;
    }
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingBarterRollMove) {
      try {
        performBarterRollMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            moveId: move.id,
            barter,
          },
        });
        handleClose();
      } catch (error) {
        console.error(error);
      }
    }
  };
  // ------------------------------------------------------ Render -------------------------------------------------------- //

  return (
    <DialogWrapper background={BarterRollBackground} handleClose={handleClose}>
      <Box gap="24px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>

        <ParagraphWS alignSelf="start">How much jingle will you drop?</ParagraphWS>
        <RedBox alignSelf="center" width="150px" align="center" justify="between" pad="24px">
          <FormField>
            <TextInput
              type="number"
              value={barter}
              size="xlarge"
              textAlign="center"
              onChange={(e) => setBarter(parseInt(e.target.value))}
            />
          </FormField>
        </RedBox>

        <ParagraphWS alignSelf="start">{`You currently have ${currentBarter} barter`}</ParagraphWS>
        <Box fill="horizontal" direction="row" justify="end" gap="small">
          <ButtonWS
            label="CANCEL"
            style={{
              background: 'transparent',
              textShadow: '0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000',
            }}
            onClick={handleClose}
          />
          <ButtonWS
            label={'DROP'}
            primary
            onClick={() => !!barter && !performingBarterRollMove && handleBarterRollMove(move, barter)}
            disabled={!barter || performingBarterRollMove || barter > 3}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default BarterRollDialog;
