import { useQuery } from '@apollo/client';
import { Box, TextArea } from 'grommet';
import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PlaybookCreator } from '../@types';
import { PlayBooks } from '../@types/enums';
import { accentColors, ButtonWS, HeadingWS, ParagraphWS, TextWS } from '../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

interface CharacterGearFormProps {
  existingGear: string[];
  playbookType: PlayBooks;
  characterName: string;
  handleSubmitGear: (gear: string[]) => void;
}

const GearUL = styled.ul`
  margin: unset;
  width: -webkit-fill-available;
  align-self: center;
  cursor: default;
`;

const CharacterGearForm: FC<CharacterGearFormProps> = ({
  existingGear = [],
  playbookType,
  characterName,
  handleSubmitGear,
}) => {
  const [gear, setGear] = useState<string[]>(existingGear);
  const [pbCreator, setPbCreator] = useState<PlaybookCreator | undefined>();
  const [value, setValue] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);

  const instructionsBoxRef = useRef<HTMLDivElement>(null);

  const { data: pbCreatorData, loading: loadingPbCreator } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    {
      variables: { playbookType },
    }
  );

  const handleScroll = (e: any) => {
    if (!e.currentTarget) {
      return;
    }
    if (e.currentTarget.scrollHeight <= e.currentTarget.offsetHeight) {
      setShowScrollDown(false);
      return;
    }

    if (e.currentTarget.scrollTop > 0) {
      setShowScrollDown(false);
      return;
    }

    if (e.currentTarget.scrollTop === 0) {
      setShowScrollDown(true);
      return;
    }
  };

  // ---------------------------------------------------- UseEffects  -------------------------------------------------------- //

  useEffect(() => {
    !!pbCreatorData && setPbCreator(pbCreatorData.playbookCreator);
  }, [pbCreatorData]);

  useEffect(() => {
    if (instructionsBoxRef.current) {
      if (instructionsBoxRef.current.scrollHeight > instructionsBoxRef.current.offsetHeight) {
        setShowScrollDown(true);
      } else {
        setShowScrollDown(false);
      }
      instructionsBoxRef.current.scrollTop = 0;
    }
    return () => {};
  }, [instructionsBoxRef, pbCreator]);

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  const renderInAddition = () => {
    if (!!pbCreator?.gearInstructions.inAddition) {
      return <TextWS>{pbCreator.gearInstructions.inAddition}</TextWS>;
    }
  };

  const renderYouGet = () => {
    if (!!pbCreator?.gearInstructions.youGet) {
      return <TextWS>{pbCreator.gearInstructions.youGet}</TextWS>;
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
        <TextWS>{`${pbCreator.gearInstructions.introduceChoice} (choose ${pbCreator.gearInstructions.numberCanChoose}):`}</TextWS>
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
      return <ParagraphWS>{pbCreator.gearInstructions.withMC}</ParagraphWS>;
    }
  };

  if (loadingPbCreator || !pbCreatorData || !pbCreator) {
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
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      pad="6px"
      align="center"
      justify="start"
    >
      <Box width="70vw" flex="grow" overflow="auto">
        <HeadingWS
          level={2}
          textAlign="center"
          style={{ maxWidth: 'unset' }}
        >{`WHAT IS ${characterName.toUpperCase()}'S GEAR?`}</HeadingWS>
        <TextWS textAlign="center">Select an item to add, edit or delete it, or just type your own.</TextWS>
        <Box direction="row">
          <Box
            ref={instructionsBoxRef}
            fill
            gridArea="instructions-box"
            overflow="auto"
            onScroll={(e) => handleScroll(e)}
            style={showScrollDown ? { boxShadow: `0px -10px 10px -8px ${accentColors[0]} inset` } : undefined}
            pad="6px"
          >
            <HeadingWS level={4} alignSelf="center">
              Options
            </HeadingWS>
            {renderYouGet()}
            {renderYouGetItem()}
            {renderInAddition()}
            <br />
            {renderIntroduceChoice()}
            {renderChooseableGear()}
            {renderWithMC()}
            <ParagraphWS textAlign="end">{`... and you get oddments worth ${pbCreator.gearInstructions.startingBarter}-barter`}</ParagraphWS>
          </Box>
          <Box fill gridArea="gear-box" pad="6px">
            <Box fill="horizontal">
              <HeadingWS level={4} alignSelf="center">
                Gear
              </HeadingWS>
            </Box>
            <Box style={{ minHeight: '150px' }} margin={{ bottom: ' 6px' }}>
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
            <Box fill="horizontal">
              <TextArea
                placeholder="Edit or type item"
                fill
                value={value}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
              />
            </Box>
            <Box direction="row" fill="horizontal" gap="6px" margin={{ top: '6px' }}>
              <ButtonWS
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
              <ButtonWS
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
          </Box>
        </Box>
        <Box direction="row" pad="6px" justify="end" align="center" style={{ minHeight: 52 }}>
          <ButtonWS
            primary
            label="SET"
            onClick={() => handleSubmitGear(gear)}
            disabled={gear.length < 1 || JSON.stringify(gear) === JSON.stringify(existingGear)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterGearForm;
