import React, { FC, useCallback, useEffect, useState } from 'react';
import { startsWith } from 'lodash';
import styled from 'styled-components';
import { Box, Text, TextArea, Tip } from 'grommet';

import Spinner from '../../Spinner';
import { accentColors, ButtonWS, HeadingWS, neutralColors, RedBox, TextWS } from '../../../config/grommetConfig';
import { ItemCharacteristic, TaggedItem } from '../../../@types';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { useMutation, useQuery } from '@apollo/client';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import SET_CUSTOM_WEAPONS, { SetCustomWeaponsData, SetCustomWeaponsVars } from '../../../mutations/setCustomWeapons';
import { useHistory } from 'react-router-dom';
import { CharacterCreationSteps } from '../../../@types/enums';

const WeaponsUL = styled.ul`
  margin: 0;
  padding: 5px;
  list-style-type: none;
  width: -webkit-fill-available;
  align-self: center;
  cursor: default;
`;

const CustomWeaponsForm: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [baseValue, setBaseValue] = useState<TaggedItem | undefined>();
  const [characteristics, setCharacteristics] = useState<ItemCharacteristic[]>([]);
  const [value, setValue] = useState('');
  const [weapons, setWeapons] = useState<string[]>(
    !!character?.playbookUnique?.customWeapons ? [...character.playbookUnique.customWeapons.weapons] : []
  );

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    // @ts-ignore
    variables: { playbookType: character?.playbook },
    skip: !character,
  });
  const {
    firearmsTitle,
    firearmsBaseInstructions,
    firearmsBaseOptions,
    firearmsOptionsInstructions,
    firearmsOptionsOptions,
    handTitle,
    handBaseInstructions,
    handBaseOptions,
    handOptionsInstructions,
    handOptionsOptions,
  } = pbCreatorData?.playbookCreator.playbookUniqueCreator.customWeaponsCreator || {};
  const [setCustomWeapons, { loading: settingCustomWeapons }] = useMutation<SetCustomWeaponsData, SetCustomWeaponsVars>(
    SET_CUSTOM_WEAPONS
  );

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const getParsedValue = useCallback(() => {
    if (!baseValue && characteristics.length === 0) {
      return '';
    }

    const addHarmRegex = /\+\dharm/gm;
    const harmRegex = /\d-harm/gm;
    const digitRegex = /\d+/g;
    const closeFarRegex = /close\/far/gm;
    const farRegex = /\+far/gm;
    const scopedRegex = /scoped/gm;

    let item = '';
    if (characteristics.length > 0) {
      characteristics.forEach((char, index) => {
        if (characteristics.length === index + 1) {
          item += `${char.description} `;
        } else {
          item += `${char.description}, `;
        }
      });
    }

    if (!!baseValue) {
      item = `${item}${baseValue.description}`;
    }

    let tags: string[] = [];
    if (!!baseValue) {
      tags = [...tags, ...baseValue.tags];
    }

    if (characteristics.length > 0) {
      characteristics.forEach((char, index) => {
        // To deal with any simple tag addition
        if (startsWith(char.tag, '+') && !char.tag.match(addHarmRegex)) {
          const strippedTag = char.tag.substr(1);
          tags = [...tags, strippedTag];
        }

        // To deal with any simple tag removal
        if (startsWith(char.tag, '-')) {
          const strippedTag = char.tag.substr(1);
          tags = tags.filter((tag) => tag !== strippedTag);
        }

        // To deal with any "+1harm" or "+nharm" that doesn't include "close/far"
        if (char.tag.match(addHarmRegex) && !char.tag.match(closeFarRegex) && !char.description.match(scopedRegex)) {
          const existingHarm = tags.filter((tag) => tag.match(harmRegex))[0];
          let modificationValue = 1;
          const modificationValueString = char.tag.match(digitRegex);
          if (!!modificationValueString) {
            modificationValue = parseInt(modificationValueString[0]);
          }

          if (!!existingHarm) {
            const existingHarmStringValue = existingHarm.match(digitRegex);
            const tagsToKeep = tags.filter((tag) => tag !== existingHarm);
            if (!!existingHarmStringValue) {
              const existingHarmValue = parseInt(existingHarmStringValue[0]);
              console.log('add harm 4: ', existingHarmValue);
              const newHarmValue = existingHarmValue + modificationValue;
              const newTag = `${newHarmValue}-harm`;
              tags = [...tagsToKeep, newTag];
            }
          } else {
            tags = [...tags, '1-harm'];
          }
        }

        // To deal with "close/far, or +1harm at far" and
        // to deal with "+far, or +1harm at far"
        if (
          (char.tag.match(closeFarRegex) && char.tag.match(addHarmRegex)) ||
          (char.tag.match(farRegex) && char.tag.match(addHarmRegex))
        ) {
          if (tags.includes('far')) {
            const existingHarm = tags.filter((tag) => tag.match(harmRegex))[0];

            if (!!existingHarm) {
              const existingHarmStringValue = existingHarm.match(digitRegex);
              const tagsToKeep = tags.filter((tag) => tag !== existingHarm);
              if (!!existingHarmStringValue) {
                const existingHarmValue = parseInt(existingHarmStringValue[0]);
                let newHarmValue = existingHarmValue + 1;
                const newTag = `${newHarmValue}-harm`;
                tags = [...tagsToKeep, newTag];
              }
            } else {
              tags = [...tags, '1-harm'];
            }
          } else {
            tags = [...tags, 'far'];
          }
        }
      });
    }

    setValue(`${item} (${tags.join(', ')})`);
  }, [baseValue, characteristics]);

  const removeOption = (option: ItemCharacteristic) => {
    const filteredOptions = characteristics.filter((char) => char.id !== option.id);
    console.log('filteredOptions', filteredOptions);
    setCharacteristics(filteredOptions);
    getParsedValue();
  };

  const addOption = (option: ItemCharacteristic) => {
    switch (characteristics.length) {
      case 0:
        setCharacteristics([...characteristics, option]);
        break;
      case 1:
        setCharacteristics([...characteristics, option]);
        break;
      case 2:
      // Intentionally falls through
      default:
        const array = characteristics.slice(1);
        setCharacteristics([...array, option]);
        break;
    }
  };

  const removeWeapon = () => {
    const newWeapons = weapons.filter((weapon) => weapon !== value);
    setWeapons(newWeapons);
    setValue('');
  };

  const handleSubmitCustomWeapons = async (weapons: string[]) => {
    if (!!userGameRole && !!character && !!game) {
      try {
        await setCustomWeapons({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, weapons },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ----------------------------------------------------- Effects ------------------------------------------------------- //
  useEffect(() => {
    getParsedValue();
  }, [baseValue, characteristics, getParsedValue]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  const renderBasePill = (option: TaggedItem) => {
    const selectedId = baseValue?.id;
    return (
      <Box
        key={option.id}
        height="fit-content"
        background={selectedId === option.id ? { color: accentColors[0], dark: true } : neutralColors[0]}
        round="medium"
        pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
        margin={{ vertical: '3px', horizontal: '3px' }}
        justify="center"
        onClick={() => setBaseValue(option)}
        hoverIndicator={{ color: '#698D70', dark: true }}
      >
        <Text weight="bold" size="medium">
          {option.description}
        </Text>
      </Box>
    );
  };

  const renderOptionPill = (option: ItemCharacteristic) => {
    const selectedIds = characteristics.map((char) => char.id);
    return (
      <Tip key={option.id} content={option.tag}>
        <Box
          height="fit-content"
          background={selectedIds.includes(option.id) ? { color: accentColors[0], dark: true } : neutralColors[0]}
          round="medium"
          pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
          margin={{ vertical: '3px', horizontal: '3px' }}
          justify="center"
          onClick={() => {
            if (selectedIds.includes(option.id)) {
              removeOption(option);
            } else {
              addOption(option);
            }
          }}
          hoverIndicator={{ color: '#698D70', dark: true }}
        >
          <Text weight="bold" size="medium">
            {option.description}
          </Text>
        </Box>
      </Tip>
    );
  };

  return (
    <Box
      data-testid="custom-weapons-form"
      width="60vw"
      direction="column"
      align="start"
      justify="between"
      flex="grow"
      style={{ minHeight: '625px' }}
    >
      <HeadingWS crustReady={crustReady} level={2} alignSelf="center">{`WHAT ARE ${
        !!character && !!character.name ? character.name.toUpperCase() : ' ...'
      }'S TWO CUSTOM WEAPONS?`}</HeadingWS>
      <TextWS alignSelf="center">Mix'n'match. Edit directly if necessary.</TextWS>
      <Box fill="horizontal" direction="row" justify="start" height="145px">
        <Box height="152px" gap="12px" align="center" justify="between" width="60%">
          <TextArea size="large" value={value} onChange={(e) => setValue(e.target.value)} />
          <Box direction="row" fill="horizontal" gap="12px">
            <ButtonWS
              fill="horizontal"
              label="RESET"
              disabled={!value}
              onClick={() => {
                setBaseValue(undefined);
                setValue('');
                setCharacteristics([]);
              }}
            />
            <ButtonWS fill="horizontal" label="REMOVE" disabled={!weapons.includes(value)} onClick={() => removeWeapon()} />
            <ButtonWS
              fill="horizontal"
              secondary
              label="ADD"
              disabled={!value || !baseValue || characteristics.length === 0 || characteristics.length > 2}
              onClick={() => {
                setWeapons([...weapons, value]);
                setBaseValue(undefined);
                setValue('');
                setCharacteristics([]);
              }}
            />
          </Box>
        </Box>
        <Box height="152px" justify="between" width="40%" pad={{ horizontal: '12px' }} gap="12px">
          <RedBox fill="vertical">
            <WeaponsUL>
              {weapons.map((weapon, index) => (
                <li
                  key={weapon}
                  // @ts-ignore
                  onMouseOver={(e: React.MouseEvent<HTMLLIElement>) => (e.target.style.color = '#CD3F3E')}
                  // @ts-ignore
                  onMouseOut={(e: React.MouseEvent<HTMLLIElement>) => (e.target.style.color = '#FFF')}
                  onClick={(e: React.MouseEvent<HTMLLIElement>) => setValue(weapon)}
                >
                  {weapon}
                </li>
              ))}
            </WeaponsUL>
          </RedBox>
          <ButtonWS
            label={settingCustomWeapons ? <Spinner fillColor="#FFF" fillHorizontal height="36px" /> : 'SET'}
            primary
            onClick={() => !settingCustomWeapons && handleSubmitCustomWeapons(weapons)}
            disabled={weapons.length === 0}
            // Flex required for Safari
            style={{ flex: '1 0 auto' }}
          />
        </Box>
      </Box>
      <Box direction="row" height="300px" overflow={{ vertical: 'auto' }}>
        <Box height="300px" width="50%" pad="6px">
          <HeadingWS alignSelf="center" level={4}>
            {firearmsTitle}
          </HeadingWS>
          <TextWS weight="bold">{firearmsBaseInstructions}</TextWS>
          <Box direction="row" wrap>
            {firearmsBaseOptions?.map((option) => renderBasePill(option))}
          </Box>
          <TextWS weight="bold" margin={{ top: '6px' }}>
            {firearmsOptionsInstructions}
          </TextWS>
          <Box direction="row" wrap>
            {firearmsOptionsOptions?.map((option) => renderOptionPill(option))}
          </Box>
        </Box>
        <Box height="300px" width="50%" pad="6px">
          <HeadingWS alignSelf="center" level={4}>
            {handTitle}
          </HeadingWS>
          <TextWS weight="bold">{handBaseInstructions}</TextWS>
          <Box direction="row">{handBaseOptions?.map((option) => renderBasePill(option))}</Box>
          <TextWS weight="bold" margin={{ top: '6px' }}>
            {handOptionsInstructions}
          </TextWS>
          <Box direction="row" wrap>
            {handOptionsOptions?.map((option) => renderOptionPill(option))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomWeaponsForm;
