import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, RadioButtonGroup, Select } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { StyledMarkdown } from '../styledComponents';
import { HeadingWS, ParagraphWS, ButtonWS, chopperSpecialBackground } from '../../config/grommetConfig';
import PERFORM_CHOPPER_SPECIAL_MOVE, {
  PerformChopperSpecialMoveData,
  PerformChopperSpecialMoveVars,
} from '../../mutations/performChopperSpecialMove';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

interface ChopperSpecialDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const ChopperSpecialDialog: FC<ChopperSpecialDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [otherCharacterId, setotherCharacterId] = useState('');
  const [hxChange, setHxChange] = useState<string | undefined>();
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole, otherPlayerGameRoles } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performChopperSpecialMove, { loading: performingChopperSpecialMove }] = useMutation<
    PerformChopperSpecialMoveData,
    PerformChopperSpecialMoveVars
  >(PERFORM_CHOPPER_SPECIAL_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const characters = otherPlayerGameRoles?.map((gameRole) => gameRole.characters[0]) || [];
  const handleChopperSpecialMove = () => {
    if (
      !!userGameRole &&
      userGameRole.characters.length === 1 &&
      !performingChopperSpecialMove &&
      !!otherCharacterId &&
      !!hxChange
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
        performChopperSpecialMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            otherGameroleId,
            characterId: userGameRole.characters[0].id,
            otherCharacterId,
            hxChange: parseInt(hxChange),
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
    <DialogWrapper background={chopperSpecialBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <StyledMarkdown>{move.description}</StyledMarkdown>
        <Box direction="row" gap="24px">
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
          <Box fill align="start" justify="start">
            <ParagraphWS alignSelf="start">How do they want your Hx to change?</ParagraphWS>
            <RadioButtonGroup
              direction="row"
              justify="around"
              alignSelf="center"
              name="hxChange"
              value={hxChange}
              options={['+1', '-1']}
              onChange={(e: any) => setHxChange(e.target.value)}
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
            label="APPLY"
            primary
            onClick={() => !performingChopperSpecialMove && !!otherCharacterId && handleChopperSpecialMove()}
            disabled={performingChopperSpecialMove || !otherCharacterId}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default ChopperSpecialDialog;
