import { useQuery } from '@apollo/client';
import { Box, Button, Grid, Heading, Paragraph, Text, TextArea } from 'grommet';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PlaybookCreator } from '../@types';
import { PlayBooks } from '../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

interface CharacterGearFormProps {
  playbookType: PlayBooks;
  characterName: string;
  handleSubmitGear: (gear: string[]) => void;
}

const GearUL = styled.ul`
  margin: unset;
  overflow-y: auto;
  width: -webkit-fill-available;
  align-self: center;
  cursor: default;
`;

const CharacterGearForm: FC<CharacterGearFormProps> = ({ playbookType, characterName, handleSubmitGear }) => {
  const [gear, setGear] = useState<string[]>([]);
  const [pbCreator, setPbCreator] = useState<PlaybookCreator | undefined>();
  const [value, setValue] = useState('');

  const { data: pbCreatorData, loading: loadingPbCreator } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    {
      variables: { playbookType },
    }
  );

  // ---------------------------------------------------- UseEffects  -------------------------------------------------------- //

  useEffect(() => {
    !!pbCreatorData && setPbCreator(pbCreatorData.playbookCreator);
  }, [pbCreatorData]);

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  const renderInAddition = () => {
    if (!!pbCreator?.gearInstructions.inAddition) {
      return <Text>{pbCreator.gearInstructions.inAddition}</Text>;
    }
  };

  const renderYouGet = () => {
    if (!!pbCreator?.gearInstructions.youGet) {
      return <Text>{pbCreator.gearInstructions.youGet}</Text>;
    }
  };

  const renderYouGetItem = () => {
    if (!!pbCreator?.gearInstructions?.youGetItems && pbCreator.gearInstructions.youGetItems.length > 0) {
      return (
        <GearUL>
          {pbCreator.gearInstructions.youGetItems.map((item, index) => (
            <li
              key={index}
              // @ts-ignore
              onMouseOver={(e: React.MouseEvent<HTMLLIElement>) => (e.target.style.color = '#CD3F3E')}
              // @ts-ignore
              onMouseOut={(e: React.MouseEvent<HTMLLIElement>) => (e.target.style.color = '#FFF')}
              onClick={(e: React.MouseEvent<HTMLLIElement>) => setValue(item)}
            >
              {item}
            </li>
          ))}
        </GearUL>
      );
    }
  };

  const renderIntroduceChoice = () => {
    if (!!pbCreator?.gearInstructions.introduceChoice) {
      return (
        <Text>{`${pbCreator.gearInstructions.introduceChoice} (choose ${pbCreator.gearInstructions.numberCanChoose}):`}</Text>
      );
    }
  };

  const renderChooseableGear = () => {
    if (!!pbCreator?.gearInstructions.chooseableGear) {
      return (
        <GearUL>
          {pbCreator.gearInstructions.chooseableGear.map((item, index) => (
            <li
              key={index}
              // @ts-ignore
              onMouseOver={(e: React.MouseEvent<HTMLLIElement>) => (e.target.style.color = '#CD3F3E')}
              // @ts-ignore
              onMouseOut={(e: React.MouseEvent<HTMLLIElement>) => (e.target.style.color = '#FFF')}
              onClick={(e: React.MouseEvent<HTMLLIElement>) => setValue(item)}
            >
              {item}
            </li>
          ))}
        </GearUL>
      );
    }
  };

  const renderWithMC = () => {
    if (!!pbCreator?.gearInstructions.withMC) {
      return <Paragraph>{pbCreator.gearInstructions.withMC}</Paragraph>;
    }
  };

  if (loadingPbCreator || !pbCreatorData || !pbCreator) {
    return (
      <Box fill background="black" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      fill
      direction="column"
      background="black"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      pad="24px"
      align="center"
      justify="start"
    >
      <Box width="70vw" height="70vh">
        <Heading level={2} textAlign="center">{`WHAT IS ${characterName.toUpperCase()}'S GEAR?`}</Heading>
        <Text textAlign="center">Select an item to add, edit or delete it, or just type your own.</Text>
        <Grid
          fill
          justifyContent="center"
          rows={['60%', '20%', '10%', '10%']}
          columns={['25%', '25%', '25%', '25%']}
          gap="12px"
          areas={[
            { name: 'instructions-box', start: [0, 0], end: [1, 0] },
            { name: 'gear-box', start: [2, 0], end: [3, 0] },
            { name: 'text-box', start: [0, 1], end: [3, 1] },
            { name: 'add-delete-box', start: [3, 1], end: [3, 1] },
            { name: 'barter-box', start: [0, 2], end: [3, 2] },
            { name: 'submit-box', start: [0, 3], end: [3, 3] },
          ]}
        >
          <Box fill gridArea="instructions-box">
            <>
              <Heading level={4} alignSelf="center">
                Options
              </Heading>
              {renderYouGet()}
              {renderYouGetItem()}
              {renderInAddition()}
              <br />
              {renderIntroduceChoice()}
              {renderChooseableGear()}
              {renderWithMC()}
            </>
          </Box>
          <Box fill gridArea="gear-box">
            <Heading level={4} alignSelf="center">
              Gear
            </Heading>
            {renderInAddition()}
            <GearUL>
              {gear.map((item, index) => (
                <li
                  key={index}
                  // @ts-ignore
                  onMouseOver={(e: React.MouseEvent<HTMLLIElement>) => (e.target.style.color = '#CD3F3E')}
                  // @ts-ignore
                  onMouseOut={(e: React.MouseEvent<HTMLLIElement>) => (e.target.style.color = '#FFF')}
                  onClick={(e: React.MouseEvent<HTMLLIElement>) => setValue(item)}
                >
                  {item}
                </li>
              ))}
            </GearUL>
          </Box>
          <Box gridArea="text-box" direction="row" gap="6px">
            <TextArea
              placeholder="Edit or type item"
              fill
              value={value}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
            />
          </Box>
          <Box gridArea="add-delete-box" direction="column" gap="6px">
            <Button
              secondary
              label="ADD"
              disabled={!value || gear.includes(value)}
              fill="horizontal"
              style={{ outline: 'none', boxShadow: 'none' }}
              onClick={() => {
                const newGear = [...gear, value];
                setGear(newGear);
                setValue('');
              }}
            />
            <Button
              label="REMOVE"
              disabled={!gear.includes(value)}
              fill="horizontal"
              style={{ outline: 'none', boxShadow: 'none' }}
              onClick={() => {
                const newGear = gear.filter((item) => item !== value);
                setGear(newGear);
                setValue('');
              }}
            />
          </Box>
          <Box gridArea="barter-box">
            <Paragraph
              fill
              textAlign="center"
            >{`... and you get oddments worth ${pbCreator.gearInstructions.startingBarter}-barter`}</Paragraph>
          </Box>
          <Box gridArea="submit-box" direction="row" justify="end" gap="24px" fill>
            <Button primary label="SET" onClick={() => console.log('clicked')} disabled={gear.length < 2} />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default CharacterGearForm;
