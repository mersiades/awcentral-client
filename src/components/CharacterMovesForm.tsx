import { useQuery } from '@apollo/client';
import { Box, Button, CheckBox, CheckBoxGroup, CheckBoxProps, Heading, Text } from 'grommet';
import { omit } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { CharacterMove } from '../@types';
import { PlayBooks } from '../@types/enums';
import { accentColors } from '../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin: unset;
    color: ${accentColors[0]};
  }
`;

interface CharacterMovesFormProps {
  playbookType: PlayBooks;
  characterName: string;
  handleSubmitCharacterMoves: (moveIds: string[]) => void;
}

const CharacterMovesForm: FC<CharacterMovesFormProps> = ({ playbookType, characterName, handleSubmitCharacterMoves }) => {
  const [selectedMoveIds, setSelectedMoveIds] = useState<string[]>([]);
  const { data: pbCreatorData, loading: loadingPbCreator } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    {
      variables: { playbookType },
    }
  );

  const playbookMoves = pbCreatorData?.playbookCreator.playbookMoves;
  const defaultMoveCount = pbCreatorData?.playbookCreator.defaultMoveCount;
  const moveChoiceCount = pbCreatorData?.playbookCreator.moveChoiceCount;
  const defaultMoves = playbookMoves?.filter((move) => !!move.isSelected);
  const defaultMoveIds = defaultMoves?.map((move) => move.id);
  const moveOptions = playbookMoves?.filter((move) => !move.isSelected);

  const renderOptions = (options: CharacterMove[]) => {
    let optionsArray: CheckBoxProps[] = [];
    options.forEach((item) => {
      const option: CheckBoxProps = {
        id: item.id,
        label: (
          <div key={item.id}>
            <Text weight="bold">{item.name}</Text>
            <StyledMarkdown>{item.description}</StyledMarkdown>
          </div>
        ),
      };
      optionsArray = [...optionsArray, option];
    });
    return optionsArray;
  };

  if (
    loadingPbCreator ||
    !pbCreatorData ||
    !playbookMoves ||
    !defaultMoves ||
    !moveOptions ||
    !defaultMoveCount ||
    !moveChoiceCount ||
    !defaultMoveIds
  ) {
    return (
      <Box fill justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      fill
      direction="column"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      align="center"
      justify="start"
    >
      <Box width="70vw">
        <Heading level={2} textAlign="center">{`WHAT ARE ${characterName.toUpperCase()}'S MOVES?`}</Heading>
        {defaultMoves.map((move) => {
          return (
            <CheckBox
              key={move.id}
              checked={move.isSelected}
              label={
                <div style={{ marginBottom: '12px' }}>
                  <Text weight="bold">{move.name}</Text>
                  <StyledMarkdown>{move.description}</StyledMarkdown>
                </div>
              }
            />
          );
        })}
        <Text size="large" weight="bold">
          Select {moveChoiceCount}
        </Text>
        <CheckBoxGroup
          overflow="auto"
          options={renderOptions(moveOptions)}
          labelKey="label"
          valueKey="id"
          onChange={({ value, option }: any) => setSelectedMoveIds(value)}
        />
        <Box direction="row" justify="end" gap="24px" margin={{ vertical: '12px' }}>
          <Button
            primary
            label="SET"
            style={{ minHeight: '52px' }}
            disabled={selectedMoveIds.length !== moveChoiceCount}
            onClick={() => handleSubmitCharacterMoves([...selectedMoveIds, ...defaultMoveIds])}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterMovesForm;
