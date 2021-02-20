import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, RadioButtonGroup, Select } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { HeadingWS, ParagraphWS, ButtonWS, TextWS, skinnerSpecialDialogBackground } from '../../config/grommetConfig';
import PERFORM_SKINNER_SPECIAL_MOVE, {
  PerformSkinnerSpecialMoveData,
  PerformSkinnerSpecialMoveVars,
} from '../../mutations/performSkinnerSpecialMove';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

interface SkinnerSpecialDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const SkinnerSpecialDialog: FC<SkinnerSpecialDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [otherCharacterId, setotherCharacterId] = useState('');
  const [option, setOption] = useState('');
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole, otherPlayerGameRoles } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performSkinnerSpecialMove, { loading: performingSkinnerSpecialMove }] = useMutation<
    PerformSkinnerSpecialMoveData,
    PerformSkinnerSpecialMoveVars
  >(PERFORM_SKINNER_SPECIAL_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const characters = otherPlayerGameRoles?.map((gameRole) => gameRole.characters[0]) || [];
  const options = [
    'You take +1forward and so do they.',
    'You take +1forward; they take -1.',
    'They must give you a gift worth at least 1-barter.',
    "You can hypnotize them as though you'd rolled a 10+, even if you haven't chosen the move.",
  ];
  const handleSkinnerSpecialMove = () => {
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingSkinnerSpecialMove && !!otherCharacterId) {
      const otherGameroleId = otherPlayerGameRoles?.find((gameRole) => {
        let isMatch = false;
        gameRole.characters.forEach((character) => {
          if (character.id === otherCharacterId) isMatch = true;
        });
        return isMatch;
      })?.id;

      if (!otherGameroleId) return;

      try {
        performSkinnerSpecialMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            otherGameroleId,
            characterId: userGameRole.characters[0].id,
            otherCharacterId,
            plus1ForUser: option.includes('You take +1forward'),
            plus1ForOther: option.includes('and so do they'),
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
    <DialogWrapper background={skinnerSpecialDialogBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <TextWS>If you and another character have sex, choose one:</TextWS>
        <Box fill align="start" justify="start">
          <RadioButtonGroup
            justify="around"
            alignSelf="center"
            name="hxChange"
            value={option}
            options={options}
            onChange={(e: any) => setOption(e.target.value)}
          />
        </Box>
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
            onClick={() => !performingSkinnerSpecialMove && !!otherCharacterId && handleSkinnerSpecialMove()}
            disabled={performingSkinnerSpecialMove || !otherCharacterId}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default SkinnerSpecialDialog;
