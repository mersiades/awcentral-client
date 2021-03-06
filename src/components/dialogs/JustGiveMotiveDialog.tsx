import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, RadioButtonGroup, Select } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { StyledMarkdown } from '../styledComponents';
import { HeadingWS, ParagraphWS, ButtonWS, justGiveMotiveDialogBackground } from '../../config/grommetConfig';
import PERFORM_JUST_GIVE_MOTIVATION_MOVE, {
  PerformJustGiveMotivationMoveData,
  PerformJustGiveMotivationMoveVars,
} from '../../mutations/performJustGiveMotivationMove';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

interface JustGiveMotiveDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const JustGiveMotiveDialog: FC<JustGiveMotiveDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [targetId, setTargetId] = useState<string | undefined>();
  const [target, setTarget] = useState<'PC' | 'NPC'>('NPC');

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole, otherPlayerGameRoles } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performJustGiveMotivationMove, { loading: performingJustGiveMotivationMove }] = useMutation<
    PerformJustGiveMotivationMoveData,
    PerformJustGiveMotivationMoveVars
  >(PERFORM_JUST_GIVE_MOTIVATION_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const characters = otherPlayerGameRoles?.map((gameRole) => gameRole.characters[0]) || [];

  const handleJustGiveMotivationMove = () => {
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingJustGiveMotivationMove) {
      try {
        performJustGiveMotivationMove({
          variables: {
            gameId,
            gameRoleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            targetId,
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
    <DialogWrapper background={justGiveMotiveDialogBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <StyledMarkdown>{move.description}</StyledMarkdown>
        <Box direction="row" gap="24px">
          <Box fill align="start" justify="start">
            <ParagraphWS alignSelf="start">What are you acting against?</ParagraphWS>
            <RadioButtonGroup
              justify="around"
              alignSelf="start"
              name="pc-or-npc"
              value={target}
              options={['NPC', 'PC']}
              onChange={(e: any) => {
                setTarget(e.target.value);
                e.target.value === 'NPC' && setTargetId(undefined);
              }}
            />
          </Box>
          {target === 'PC' && (
            <Box fill align="start" justify="start">
              <ParagraphWS alignSelf="start">What are you acting against?</ParagraphWS>
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
            </Box>
          )}
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
            onClick={() => !performingJustGiveMotivationMove && handleJustGiveMotivationMove()}
            disabled={performingJustGiveMotivationMove || (target === 'PC' && !targetId)}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default JustGiveMotiveDialog;
