import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, FormField, TextInput } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { HeadingWS, ParagraphWS, ButtonWS, RedBox, stabilizeBackground } from '../../config/grommetConfig';
import PERFORM_STABILIZE_AND_HEAL_MOVE, {
  PerformStabilizeAndHealMoveData,
  PerformStabilizeAndHealMoveVars,
} from '../../mutations/performStabilizeAndHealMove';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { StyledMarkdown } from '../styledComponents';

interface StabilizeDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const StabilizeDialog: FC<StabilizeDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [stockSpent, setStockSpent] = useState(0);
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performStabilizeAndHealMove, { loading: performingStabilizeAndHealMove }] = useMutation<
    PerformStabilizeAndHealMoveData,
    PerformStabilizeAndHealMoveVars
  >(PERFORM_STABILIZE_AND_HEAL_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const currentStock = userGameRole?.characters[0].playbookUnique?.angelKit?.stock || 0;

  const handleStabilizeAndHealMove = () => {
    if (currentStock - stockSpent < 0) {
      console.warn("You don't have enough stock");
      return;
    }
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingStabilizeAndHealMove) {
      try {
        performStabilizeAndHealMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
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
    <DialogWrapper background={stabilizeBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <StyledMarkdown>{move.description}</StyledMarkdown>
        <Box direction="row" align="start" justify="start" gap="12px">
          <RedBox alignSelf="center" width="150px" align="center" justify="between" pad="24px">
            <FormField>
              <TextInput
                type="number"
                value={stockSpent}
                size="xlarge"
                textAlign="center"
                onChange={(e) => [0, 1, 2, 3].includes(parseInt(e.target.value)) && setStockSpent(parseInt(e.target.value))}
              />
            </FormField>
          </RedBox>
          <Box>
            <ParagraphWS alignSelf="start">{`How much stock do you use?`}</ParagraphWS>
            <ParagraphWS alignSelf="start">{`You currently have ${currentStock} stock`}</ParagraphWS>
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
            label="STABILIZE"
            primary
            onClick={() =>
              [0, 1, 2, 3].includes(stockSpent) && !performingStabilizeAndHealMove && handleStabilizeAndHealMove()
            }
            disabled={![0, 1, 2, 3].includes(stockSpent) || performingStabilizeAndHealMove}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default StabilizeDialog;
