import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, Select } from 'grommet';

import DialogWrapper from './DialogWrapper';
import { StyledMarkdown } from './styledComponents';
import { HeadingWS, ParagraphWS, ButtonWS, angelSpecialBackground } from '../config/grommetConfig';
import PERFORM_ANGEL_SPECIAL_MOVE, {
  PerformAngelSpecialMoveData,
  PerformAngelSpecialMoveVars,
} from '../mutations/performAngelSpecialMove';
import { CharacterMove, Move } from '../@types/staticDataInterfaces';
import { useFonts } from '../contexts/fontContext';
import { useGame } from '../contexts/gameContext';

interface AngelSpecialDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const AngelSpecialDialog: FC<AngelSpecialDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [otherCharacterId, setotherCharacterId] = useState('');
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole, otherPlayerGameRoles } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performAngelSpecialMove, { loading: performingAngelSpecialMove }] = useMutation<
    PerformAngelSpecialMoveData,
    PerformAngelSpecialMoveVars
  >(PERFORM_ANGEL_SPECIAL_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const characters = otherPlayerGameRoles?.map((gameRole) => gameRole.characters[0]) || [];
  const handleAngelSpecialMove = () => {
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingAngelSpecialMove && !!otherCharacterId) {
      const otherGameroleId = otherPlayerGameRoles?.find((gameRole) => {
        let isMatch = false;
        gameRole.characters.forEach((character) => {
          if (character.id === otherCharacterId) isMatch = true;
        });
        return isMatch;
      })?.id;

      if (!otherGameroleId) return;

      try {
        performAngelSpecialMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            otherGameroleId,
            characterId: userGameRole.characters[0].id,
            otherCharacterId,
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
    <DialogWrapper background={angelSpecialBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <StyledMarkdown>{move.description}</StyledMarkdown>
        <Box fill align="start" justify="start">
          <ParagraphWS alignSelf="start">Who did you have sex with?</ParagraphWS>
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
            onClick={() => !performingAngelSpecialMove && !!otherCharacterId && handleAngelSpecialMove()}
            disabled={performingAngelSpecialMove || !otherCharacterId}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default AngelSpecialDialog;
