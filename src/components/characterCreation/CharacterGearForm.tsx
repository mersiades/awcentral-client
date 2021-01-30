import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { Box, TextArea } from 'grommet';

import Spinner from '../Spinner';
import { accentColors, ButtonWS, HeadingWS, ParagraphWS, TextWS } from '../../config/grommetConfig';
import { CharacterCreationSteps, PlaybookType } from '../../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { useHistory } from 'react-router-dom';
import SET_CHARACTER_BARTER, { SetCharacterBarterData, SetCharacterBarterVars } from '../../mutations/setCharacterBarter';
import SET_CHARACTER_GEAR, { SetCharacterGearData, SetCharacterGearVars } from '../../mutations/setCharacterGear';

const GearUL = styled.ul`
  margin: unset;
  width: -webkit-fill-available;
  align-self: center;
  cursor: default;
`;

const CharacterGearForm: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const existingGear = character?.gear;
  const [gear, setGear] = useState<string[]>(existingGear || []);
  const [value, setValue] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);

  // --------------------------------------------------3rd party hooks ----------------------------------------------------- //
  const history = useHistory();

  const instructionsBoxRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    // @ts-ignore
    { variables: { playbookType: character?.playbook }, skip: !character?.playbook }
  );
  const pbCreator = pbCreatorData?.playbookCreator;
  const [setCharacterGear, { loading: settingGear }] = useMutation<SetCharacterGearData, SetCharacterGearVars>(
    SET_CHARACTER_GEAR
  );

  const [setCharacterBarter, { loading: settingBarter }] = useMutation<SetCharacterBarterData, SetCharacterBarterVars>(
    SET_CHARACTER_BARTER
  );

  // ------------------------------------------ Component functions and variables ------------------------------------------ //

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

  const handleSubmitGear = async (gear: string[], amount: number) => {
    if (!!userGameRole && !!character && !!game) {
      try {
        await setCharacterGear({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, gear },
        });
        await setCharacterBarter({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, amount },
        });
        // Skip playbookUnique form if Driver
        const nextStep =
          character.playbook === PlaybookType.driver ? CharacterCreationSteps.setVehicle : CharacterCreationSteps.setUnique;
        history.push(`/character-creation/${game.id}?step=${nextStep}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ------------------------------------------------------ Effects  --------------------------------------------------------- //

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

  const renderGearIntro = () => {
    if (!!pbCreator?.gearInstructions.gearIntro) {
      return <TextWS>{pbCreator.gearInstructions.gearIntro}</TextWS>;
    }
  };

  const renderYouGetItem = () => {
    if (!!pbCreator?.gearInstructions?.youGetItems && pbCreator.gearInstructions.youGetItems.length > 0) {
      return (
        <GearUL>
          {pbCreator.gearInstructions.youGetItems.map((item, index) => (
            <li
              data-testid={`${item}-listitem`}
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
              data-testid={`${item}-chooseable-listitem`}
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
        <HeadingWS level={2} crustReady={crustReady} textAlign="center" style={{ maxWidth: 'unset' }}>{`WHAT IS ${
          !!character?.name ? character.name.toUpperCase() : '...'
        }'S GEAR?`}</HeadingWS>
        <Box direction="row" align="center" fill="horizontal" justify="between">
          <TextWS textAlign="center">Select an item to add, edit or delete it, or just type your own.</TextWS>
          <Box direction="row" pad="6px" justify="end" align="center" style={{ minHeight: 52 }}>
            <ButtonWS
              primary
              label={settingGear || settingBarter ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
              onClick={() =>
                !settingBarter &&
                !settingGear &&
                !!pbCreator &&
                handleSubmitGear(gear, pbCreator.gearInstructions.startingBarter)
              }
              disabled={gear.length < 1 || JSON.stringify(gear) === JSON.stringify(existingGear)}
            />
          </Box>
        </Box>
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
            {renderGearIntro()}
            {renderYouGetItem()}
            <br />
            {renderIntroduceChoice()}
            {renderChooseableGear()}
            {renderWithMC()}
            <ParagraphWS textAlign="start">{`... and you get oddments worth ${
              !!pbCreator ? pbCreator.gearInstructions.startingBarter : 'x'
            }-barter`}</ParagraphWS>
          </Box>
          <Box fill gridArea="gear-box" pad="6px">
            <Box fill="horizontal">
              <HeadingWS level={4} alignSelf="center">
                Gear
              </HeadingWS>
            </Box>
            <Box style={{ minHeight: '150px' }} margin={{ bottom: ' 6px' }}>
              <GearUL data-testid="interim-gear-list">
                {gear.map((item, index) => (
                  <li
                    data-testid={`${item}-interim-listitem`}
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
      </Box>
    </Box>
  );
};

export default CharacterGearForm;
