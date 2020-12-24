import { Box, Button, CheckBoxGroup, CheckBoxProps, Heading, Paragraph, Text } from 'grommet';
import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { PlaybookUniqueCreator } from '../@types';
import { accentColors } from '../config/grommetConfig';

interface UniqueFormBrainerProps {
  characterName: string;
  playbookUniqueCreator: PlaybookUniqueCreator;
}

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin: unset;
    color: ${accentColors[0]};
  }
`;

const UniqueFormBrainer: FC<UniqueFormBrainerProps> = ({ characterName, playbookUniqueCreator }) => {
  const [selectedGear, setSelectedGear] = useState([]);

  const renderOptions = () => {
    let optionsArray: CheckBoxProps[] = [];
    playbookUniqueCreator.brainerGearCreator.gear.forEach((item, index) => {
      const splitItem = item.split(')');
      const option: CheckBoxProps = {
        id: item,
        label: (
          <div key={index}>
            <Text weight="bold">{splitItem[0]}</Text>
            <StyledMarkdown>{splitItem[1]}</StyledMarkdown>
          </div>
        ),
      };
      optionsArray = [...optionsArray, option];
    });
    console.log('optionsArray', optionsArray);
    return optionsArray;
  };

  const anOption: CheckBoxProps = {
    label: <h1>french</h1>,
  };
  return (
    <Box width="70vw" height="575px" direction="column" align="center" justify="between">
      <Heading level={2}>{`WHAT SPECIAL BRAINER GEAR DOES ${characterName.toUpperCase()} HAVE?`}</Heading>
      <Paragraph size="large">Choose two</Paragraph>
      <CheckBoxGroup
        overflow="auto"
        options={renderOptions()}
        labelKey="label"
        valueKey="id"
        onChange={({ value, option }: any) => setSelectedGear(value)}
      />
      <Box fill="horizontal" direction="row" justify="end">
        <Button label="SET" primary disabled={selectedGear.length !== 2} />
      </Box>
    </Box>
  );
};

export default UniqueFormBrainer;
