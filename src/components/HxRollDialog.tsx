import { useMutation } from '@apollo/client';
import { Box, Layer, Select } from 'grommet';
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CharacterMove, Move } from '../@types/staticDataInterfaces';
import { HeadingWS, ParagraphWS, ButtonWS, HxRollBackground } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';
import { useGame } from '../contexts/gameContext';
import PERFORM_HX_ROLL_MOVE, { PerformHxRollMoveData, PerformHxRollMoveVars } from '../mutations/performHxRollMove';

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
    <Layer onEsc={handleClose} onClickOutside={handleClose}>
      <Box
        data-testid={`hx-roll-dialog`}
        direction="column"
        fill
        align="center"
        justify="center"
        pad="24px"
        gap="24px"
        border={{ color: 'brand' }}
        background={HxRollBackground}
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        style={{ boxShadow: '0 0 15px 1px #000, 0 0 20px 3px #000' }}
      >
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
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default HxRollDialog;
