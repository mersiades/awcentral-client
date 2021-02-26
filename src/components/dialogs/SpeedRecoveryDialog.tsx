import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, RadioButtonGroup } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { HeadingWS, ParagraphWS, ButtonWS, speedRecoveryBackground } from '../../config/grommetConfig';
import PERFORM_STOCK_MOVE, { PerformStockMoveData, PerformStockMoveVars } from '../../mutations/performStockMove';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { StyledMarkdown } from '../styledComponents';

interface SpeedRecoveryDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const SpeedRecoveryDialog: FC<SpeedRecoveryDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [option, setOption] = useState<'Yes' | 'No'>('Yes');
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performStockMove, { loading: performingStockMove }] = useMutation<PerformStockMoveData, PerformStockMoveVars>(
    PERFORM_STOCK_MOVE
  );

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const currentStock = userGameRole?.characters[0].playbookUnique?.angelKit?.stock || 0;

  const handleStockMove = () => {
    const stockSpent = option === 'Yes' ? 1 : 0;
    if (currentStock - stockSpent < 0) {
      console.warn("You don't have enough stock");
      return;
    }
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingStockMove) {
      try {
        performStockMove({
          variables: {
            gameId,
            gameRoleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            moveName: move.name,
            stockSpent,
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
    <DialogWrapper background={speedRecoveryBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <StyledMarkdown>{move.description}</StyledMarkdown>
        <Box direction="column" align="center" justify="start" gap="12px" margin={{ bottom: '12px' }}>
          <Box align="start">
            <ParagraphWS>Do they want you to use any stock?</ParagraphWS>
            <RadioButtonGroup
              name="use-stock"
              options={['Yes', 'No']}
              value={option}
              onChange={(e: any) => setOption(e.target.value)}
              alignSelf="start"
            />
          </Box>
        </Box>
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
            label="SPEED RECOVERY"
            primary
            onClick={() => !performingStockMove && handleStockMove()}
            disabled={performingStockMove}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default SpeedRecoveryDialog;
