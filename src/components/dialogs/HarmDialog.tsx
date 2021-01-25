import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, FormField, TextInput } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { HeadingWS, ParagraphWS, ButtonWS, RedBox, sufferHarmBackground } from '../../config/grommetConfig';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import PERFORM_SUFFER_HARM_MOVE, {
  PerformSufferHarmMoveData,
  PerformSufferHarmMoveVars,
} from '../../mutations/performSufferHarmMove';
import HarmClock from '../HarmClock';

interface HarmDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const HarmDialog: FC<HarmDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [harm, setHarm] = useState(0);
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performSufferHarmMove, { loading: performingSufferHarmMove }] = useMutation<
    PerformSufferHarmMoveData,
    PerformSufferHarmMoveVars
  >(PERFORM_SUFFER_HARM_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const currentHarm = userGameRole?.characters[0].harm;

  const handleSufferHarmMove = (move: Move | CharacterMove, barter: number) => {
    if ((currentHarm?.value || 0) + harm >= 6) {
      console.warn("You're dead");
      return;
    }
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingSufferHarmMove) {
      try {
        performSufferHarmMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            moveId: move.id,
            harm,
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
    <DialogWrapper background={sufferHarmBackground} handleClose={handleClose}>
      <Box gap="24px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <Box fill direction="row" align="start" justify="between" pad="12px" gap="12px">
          <Box fill>
            <ParagraphWS alignSelf="center">Your current harm</ParagraphWS>
            {!!currentHarm && <HarmClock harmValue={currentHarm.value} isStabilized={currentHarm.isStabilized} />}
          </Box>
          <Box fill>
            <ParagraphWS alignSelf="center">How much harm did you suffer? (after armor, if you’re wearing any)</ParagraphWS>
            <RedBox
              alignSelf="center"
              width="150px"
              align="center"
              justify="between"
              pad="24px"
              margin={{ vertical: '52px' }}
            >
              <FormField>
                <TextInput
                  type="number"
                  value={harm}
                  size="xlarge"
                  textAlign="center"
                  onChange={(e) => setHarm(parseInt(e.target.value))}
                />
              </FormField>
            </RedBox>
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
            label="ROLL"
            primary
            onClick={() => !!harm && !performingSufferHarmMove && handleSufferHarmMove(move, harm)}
            disabled={!harm || performingSufferHarmMove}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default HarmDialog;
