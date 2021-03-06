import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { HeadingWS, ParagraphWS, ButtonWS, reviveBackground } from '../../config/grommetConfig';
import PERFORM_STOCK_MOVE, { PerformStockMoveData, PerformStockMoveVars } from '../../mutations/performStockMove';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { StyledMarkdown } from '../styledComponents';

interface ReviveDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const ReviveDialog: FC<ReviveDialogProps> = ({ move, handleClose }) => {
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
    const stockSpent = 2;
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
    <DialogWrapper background={reviveBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <StyledMarkdown>{move.description}</StyledMarkdown>
        <ParagraphWS alignSelf="start">{`This will cost 2-stock. You currently have ${currentStock} stock.`}</ParagraphWS>
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
            label="REVIVE"
            primary
            onClick={() => !performingStockMove && handleStockMove()}
            disabled={performingStockMove || currentStock < 2}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default ReviveDialog;
