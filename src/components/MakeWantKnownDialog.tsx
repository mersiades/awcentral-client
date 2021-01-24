import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Box, FormField, TextInput } from 'grommet';

import DialogWrapper from './DialogWrapper';
import { HeadingWS, ParagraphWS, RedBox, ButtonWS, makeWantKnownBackground } from '../config/grommetConfig';
import PERFORM_MAKE_WANT_KNOWN_MOVE, {
  PerformMakeWantKnownMoveData,
  PerformMakeWantKnownMoveVars,
} from '../mutations/performMakeWantKnownMove';
import { Move, CharacterMove } from '../@types/staticDataInterfaces';
import { useFonts } from '../contexts/fontContext';
import { useGame } from '../contexts/gameContext';

interface MakeWantKnownDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const MakeWantKnownDialog: FC<MakeWantKnownDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [barter, setBarter] = useState(0);
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performMakeWantKnownMove, { loading: performingMakeWantKnownMove }] = useMutation<
    PerformMakeWantKnownMoveData,
    PerformMakeWantKnownMoveVars
  >(PERFORM_MAKE_WANT_KNOWN_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const currentBarter = userGameRole?.characters[0].barter || 0;

  const handleMakeWantKnownMove = (move: Move | CharacterMove, barter: number) => {
    if (currentBarter - barter < 0) {
      console.warn("You don't have enough barter");
      return;
    }
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingMakeWantKnownMove) {
      try {
        performMakeWantKnownMove({
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
    <DialogWrapper background={makeWantKnownBackground} handleClose={handleClose}>
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
            onClick={() => !!barter && !performingMakeWantKnownMove && handleMakeWantKnownMove(move, barter)}
            disabled={!barter || performingMakeWantKnownMove || barter > 3}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default MakeWantKnownDialog;
