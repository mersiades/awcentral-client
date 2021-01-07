import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Box, CheckBoxGroup, CheckBoxProps, Text } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS } from '../../../config/grommetConfig';
import { PlaybookUniqueCreator } from '../../../@types';
import { useFonts } from '../../../contexts/fontContext';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin: unset;
    text-shadow: 0 0 1px #000, 0 0 3px #000;
  }
`;

interface BrainerGearFormProps {
  characterName: string;
  settingBrainerGear: boolean;
  playbookUniqueCreator: PlaybookUniqueCreator;
  handleSubmitBrainerGear: (brainerGear: string[]) => void;
}

const BrainerGearForm: FC<BrainerGearFormProps> = ({
  characterName,
  settingBrainerGear,
  playbookUniqueCreator,
  handleSubmitBrainerGear,
}) => {
  const [selectedGear, setSelectedGear] = useState([]);

  const { crustReady } = useFonts();

  const renderOptions = () => {
    let optionsArray: CheckBoxProps[] = [];
    playbookUniqueCreator.brainerGearCreator.gear.forEach((item, index) => {
      const splitItem = item.split(')');
      const option: CheckBoxProps = {
        id: item,
        label: (
          <div key={index}>
            <Text weight="bold">{splitItem[0] + ') '}</Text>
            <StyledMarkdown>{splitItem[1]}</StyledMarkdown>
          </div>
        ),
      };
      optionsArray = [...optionsArray, option];
    });
    return optionsArray;
  };

  return (
    <Box width="70vw" flex="grow" direction="column" align="center" justify="between">
      <HeadingWS
        crustReady={crustReady}
        level={2}
      >{`WHAT SPECIAL BRAINER GEAR DOES ${characterName.toUpperCase()} HAVE?`}</HeadingWS>
      <ParagraphWS size="large">Choose two</ParagraphWS>
      <CheckBoxGroup
        overflow="auto"
        options={renderOptions()}
        labelKey="label"
        valueKey="id"
        onChange={({ value, option }: any) => setSelectedGear(value)}
      />
      <Box fill="horizontal" direction="row" justify="end">
        <ButtonWS
          label={settingBrainerGear ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
          primary
          disabled={selectedGear.length !== 2}
          onClick={() => !settingBrainerGear && handleSubmitBrainerGear(selectedGear)}
        />
      </Box>
    </Box>
  );
};

export default BrainerGearForm;
