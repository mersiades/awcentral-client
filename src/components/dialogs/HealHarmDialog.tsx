import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, FormField, Select, TextInput } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { StyledMarkdown } from '../styledComponents';
import { HeadingWS, ParagraphWS, ButtonWS, RedBox, healHarmBackground } from '../../config/grommetConfig';
import PERFORM_HEAL_HARM_MOVE, {
  PerformHealHarmMoveData,
  PerformHealHarmMoveVars,
} from '../../mutations/performHealHarmMove';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

interface HealHarmDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const HealHarmDialog: FC<HealHarmDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [otherCharacterId, setotherCharacterId] = useState('');
  const [harm, setHarm] = useState(0);
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole, otherPlayerGameRoles } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performHealHarmMove, { loading: performingHealHarmMove }] = useMutation<
    PerformHealHarmMoveData,
    PerformHealHarmMoveVars
  >(PERFORM_HEAL_HARM_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const characters = otherPlayerGameRoles?.map((gameRole) => gameRole.characters[0]) || [];
  const handleHealHarmMove = () => {
    if (
      !!userGameRole &&
      userGameRole.characters.length === 1 &&
      !performingHealHarmMove &&
      harm > 0 &&
      !!otherCharacterId
    ) {
      const otherGameroleId = otherPlayerGameRoles?.find((gameRole) => {
        let isMatch = false;
        gameRole.characters.forEach((character) => {
          if (character.id === otherCharacterId) isMatch = true;
        });
        return isMatch;
      })?.id;

      if (!otherGameroleId) return;

      try {
        performHealHarmMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            otherGameroleId,
            characterId: userGameRole.characters[0].id,
            otherCharacterId,
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
    <DialogWrapper background={healHarmBackground} handleClose={handleClose}>
      <Box gap="24px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <StyledMarkdown>{move.description}</StyledMarkdown>
        <Box fill direction="row" align="start" justify="between" pad="12px" gap="12px">
          <Box fill>
            <ParagraphWS alignSelf="start">Who did you heal?</ParagraphWS>
            <Select
              id="target-character-input"
              aria-label="target-character-input"
              name="target-character"
              placeholder="Who?"
              options={characters}
              labelKey={'name'}
              valueKey={'id'}
              onChange={(e) => setotherCharacterId(e.value.id)}
            />
          </Box>
          <Box fill>
            <ParagraphWS alignSelf="center">...and how much did you heal?</ParagraphWS>
            <RedBox alignSelf="center" width="150px" align="center" justify="between" pad="24px">
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
            label="APPLY"
            primary
            onClick={() => !performingHealHarmMove && harm > 0 && !!otherCharacterId && handleHealHarmMove()}
            disabled={performingHealHarmMove || harm === 0 || !otherCharacterId}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default HealHarmDialog;
