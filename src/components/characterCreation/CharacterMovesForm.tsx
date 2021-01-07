import React, { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Box, CheckBox, CheckBoxGroup, CheckBoxProps, Text } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import { PlayBooks } from '../../@types/enums';
import { CharacterMove } from '../../@types';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import { useFonts } from '../../contexts/fontContext';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin: unset;
    text-shadow: 0 0 1px #000, 0 0 3px #000;
  }
`;

interface CharacterMovesFormProps {
  playbookType: PlayBooks;
  characterName: string;
  settingMoves: boolean;
  handleSubmitCharacterMoves: (moveIds: string[]) => void;
}

const CharacterMovesForm: FC<CharacterMovesFormProps> = ({
  playbookType,
  characterName,
  settingMoves,
  handleSubmitCharacterMoves,
}) => {
  const [selectedMoveIds, setSelectedMoveIds] = useState<string[]>([]);

  const { crustReady } = useFonts();

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
      <Box fill background="transparent" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      fill
      direction="column"
      background="transparent"
      align="center"
      justify="start"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Box width="70vw" flex="grow">
        <HeadingWS
          level={2}
          crustReady={crustReady}
          textAlign="center"
          style={{ maxWidth: 'unset' }}
        >{`WHAT ARE ${characterName.toUpperCase()}'S MOVES?`}</HeadingWS>
        {defaultMoves.map((move) => {
          return (
            <CheckBox
              key={move.id}
              checked={move.isSelected}
              label={
                <div>
                  <Text weight="bold">{move.name}</Text>
                  <StyledMarkdown>{move.description}</StyledMarkdown>
                </div>
              }
            />
          );
        })}
        <Text size="large" weight="bold" margin={{ vertical: '12px' }}>
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
          <ButtonWS
            primary
            label={settingMoves ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
            style={{ minHeight: '52px' }}
            disabled={selectedMoveIds.length !== moveChoiceCount}
            onClick={() => !settingMoves && handleSubmitCharacterMoves([...selectedMoveIds, ...defaultMoveIds])}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterMovesForm;
