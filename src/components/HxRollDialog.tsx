import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Box, Select } from 'grommet';

import DialogWrapper from './DialogWrapper';
import { HeadingWS, ParagraphWS, ButtonWS, HxRollBackground } from '../config/grommetConfig';
import PERFORM_HX_ROLL_MOVE, { PerformHxRollMoveData, PerformHxRollMoveVars } from '../mutations/performHxRollMove';
import { CharacterMove, Move } from '../@types/staticDataInterfaces';
import { useFonts } from '../contexts/fontContext';
import { useGame } from '../contexts/gameContext';

interface HxRollDialogProps {
  move: Move | CharacterMove;
  buttonTitle: string;
  handleClose: () => void;
}

const HxRollDialog: FC<HxRollDialogProps> = ({ move, buttonTitle, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [targetId, setTargetId] = useState('');
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole, otherPlayerGameRoles } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performHxRollMove, { loading: performingHxRollMove }] = useMutation<PerformHxRollMoveData, PerformHxRollMoveVars>(
    PERFORM_HX_ROLL_MOVE
  );

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const characters = otherPlayerGameRoles?.map((gameRole) => gameRole.characters[0]) || [];

  const handleHxRollMove = (move: Move | CharacterMove, targetId: string) => {
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingHxRollMove) {
      try {
        performHxRollMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            moveId: move.id,
            targetId,
          },
        });
        handleClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getText = () => {
    switch (move.name) {
      case 'HELP OR INTERFERE WITH SOMEONE':
        return 'Who are you helping or interfering?';
      default:
    }
  };
  // ------------------------------------------------------ Render -------------------------------------------------------- //

  return (
    <DialogWrapper background={HxRollBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <ParagraphWS alignSelf="start">{getText()}</ParagraphWS>
        <Select
          id="target-character-input"
          aria-label="target-character-input"
          name="target-character"
          placeholder="Who?"
          options={characters}
          labelKey={'name'}
          valueKey={'id'}
          onChange={(e) => setTargetId(e.value.id)}
        />
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
            label={buttonTitle.toUpperCase()}
            primary
            onClick={() => !!targetId && !performingHxRollMove && handleHxRollMove(move, targetId)}
            disabled={!targetId || performingHxRollMove}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default HxRollDialog;
