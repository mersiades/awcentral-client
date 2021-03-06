import React, { FC, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Box, CheckBox, Text } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import SET_CHARACTER_MOVES, { SetCharacterMovesData, SetCharacterMovesVars } from '../../mutations/setCharacterMoves';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import { CharacterCreationSteps } from '../../@types/enums';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin: unset;
    text-shadow: 0 0 1px #000, 0 0 3px #000;
  }
`;

const CharacterMovesForm: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [selectedMoveIds, setSelectedMoveIds] = useState<string[]>([]);
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // --------------------------------------------------3rd party hooks ----------------------------------------------------- //
  const history = useHistory();

  // --------------------------------------------------- Graphql hooks ----------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    // @ts-ignore
    { variables: { playbookType: character?.playbook }, skip: !character?.playbook }
  );

  const optionalMoves = pbCreatorData?.playbookCreator.optionalMoves;
  const defaultMoves = pbCreatorData?.playbookCreator.defaultMoves;
  const moveChoiceCount = pbCreatorData?.playbookCreator.moveChoiceCount;
  const defaultMoveIds = defaultMoves?.map((move) => move.id) as string[]; // This will never be undefined; playbooks have at least one default move
  const [setCharacterMoves, { loading: settingMoves }] = useMutation<SetCharacterMovesData, SetCharacterMovesVars>(
    SET_CHARACTER_MOVES
  );

  // ------------------------------------------ Component functions and variables ------------------------------------------ //
  const handleSelectMove = (moveId: string) => {
    if (selectedMoveIds.includes(moveId)) {
      setSelectedMoveIds(selectedMoveIds.filter((id) => id !== moveId));
    } else {
      if (!!moveChoiceCount) {
        selectedMoveIds.length < moveChoiceCount && setSelectedMoveIds([...selectedMoveIds, moveId]);
      }
    }
  };

  const handleSubmitCharacterMoves = async (moveIds: string[]) => {
    if (!!userGameRole && !!character && !!game) {
      try {
        await setCharacterMoves({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, moveIds },
        });
        if (!character.hasCompletedCharacterCreation) {
          history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setVehicle}`);
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // -------------------------------------------------- Render component  ---------------------------------------------------- //
  return (
    <Box
      data-testid="character-moves-form"
      fill
      align="center"
      justify="start"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Box width="85vw" align="start" style={{ maxWidth: '763px' }} margin={{ bottom: '24px' }}>
        <Box direction="row" fill="horizontal" justify="between" align="center">
          <HeadingWS
            level={2}
            crustReady={crustReady}
            textAlign="center"
            style={{ maxWidth: 'unset', height: '34px', lineHeight: '44px' }}
          >{`WHAT ARE ${!!character?.name ? character.name.toUpperCase() : '...'}'S MOVES?`}</HeadingWS>
          <ButtonWS
            primary
            label={settingMoves ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
            disabled={selectedMoveIds.length !== moveChoiceCount}
            onClick={() => !settingMoves && handleSubmitCharacterMoves([...selectedMoveIds, ...defaultMoveIds])}
          />
        </Box>

        <StyledMarkdown>{pbCreatorData?.playbookCreator.movesInstructions}</StyledMarkdown>

        <Text size="large" weight="bold" margin={{ vertical: '12px' }}>
          Default moves
        </Text>
        {!!defaultMoves &&
          defaultMoves.map((move) => (
            <CheckBox key={move.id} checked label={<StyledMarkdown>{move.description}</StyledMarkdown>} />
          ))}
        {!!moveChoiceCount && moveChoiceCount > 0 && (
          <Text size="large" weight="bold" margin={{ vertical: '12px' }}>
            Select {moveChoiceCount}
          </Text>
        )}
        <Box align="start" gap="12px">
          {!!optionalMoves &&
            optionalMoves.map((move) => {
              return (
                <CheckBox
                  key={move.id}
                  label={
                    <div>
                      <StyledMarkdown>{move.description}</StyledMarkdown>
                    </div>
                  }
                  checked={selectedMoveIds.includes(move.id)}
                  onChange={() => handleSelectMove(move.id)}
                />
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterMovesForm;
