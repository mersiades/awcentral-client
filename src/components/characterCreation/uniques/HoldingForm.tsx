import React, { FC, useEffect, useReducer, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Box, CheckBox } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS, RedBox, TextWS } from '../../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { useHistory } from 'react-router-dom';
import { CharacterCreationSteps, GangSize, HoldingSize, PlaybookType } from '../../../@types/enums';
import { GangOption, HoldingOption } from '../../../@types/staticDataInterfaces';
import { Gang, Holding } from '../../../@types/dataInterfaces';
import SET_GANG, { SetGangData, SetGangVars } from '../../../mutations/setGang';
import { GangInput, HoldingInput } from '../../../@types';
import { omit } from 'lodash';
import { StyledMarkdown } from '../../styledComponents';
import SET_HOLDING, { SetHoldingData, SetHoldingVars } from '../../../mutations/setHolding';

interface HoldingFormProps {
  existingHolding?: Holding;
}

interface HoldingFormState {
  holdingSize: HoldingSize;
  gangSize: GangSize;
  souls: string;
  surplus: number;
  barter: number;
  gangHarm: number;
  gangArmor: number;
  gangDefenseArmorBonus: number;
  wants: string[];
  gigs: string[];
  gangTags: string[];
  selectedStrengths: HoldingOption[];
  selectedWeaknesses: HoldingOption[];
}

interface Action {
  type: 'SET_EXISTING_HOLDING' | 'SET_DEFAULT_HOLDING' | 'UPDATE_HOLDING';
  payload?: any;
}

const getSouls = (holdingSize: HoldingSize) => {
  switch (holdingSize) {
    case HoldingSize.small:
      return '50-60 souls';
    case HoldingSize.medium:
      return '75-150 souls';
    case HoldingSize.large:
      return '200-300 souls';
  }
};

const holdingFormReducer = (state: HoldingFormState, action: Action) => {
  switch (action.type) {
    case 'SET_EXISTING_HOLDING':
      return {
        ...state,
        ...action.payload,
        souls: getSouls(action.payload.holdingSize),
      };
    case 'SET_EXISTING_HOLDING':
      return {
        ...state,
        ...action.payload,
      };
    case 'UPDATE_HOLDING':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const HoldingForm: FC<HoldingFormProps> = ({ existingHolding }) => {
  const initialState: HoldingFormState = {
    holdingSize: HoldingSize.medium,
    gangSize: GangSize.medium,
    souls: getSouls(HoldingSize.medium),
    surplus: 1,
    barter: 0,
    gangHarm: 2,
    gangArmor: 1,
    gangDefenseArmorBonus: 1,
    wants: ['hungry'],
    gigs: ['hunting', 'crude farming', 'scavenging'],
    gangTags: ['unruly'],
    selectedStrengths: [],
    selectedWeaknesses: [],
  };
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [
    {
      selectedStrengths,
      selectedWeaknesses,
      holdingSize,
      gangSize,
      surplus,
      gangHarm,
      gangArmor,
      gangDefenseArmorBonus,
      wants,
      gigs,
      gangTags,
    },
    dispatch,
  ] = useReducer(holdingFormReducer, initialState);
  const [vehicleCount, setVehicleCount] = useState(4);
  const [battleVehicleCount, setBattleVehicleCount] = useState(4);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType: PlaybookType.hardholder },
  });

  const holdingCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator?.holdingCreator;
  const [setHolding, { loading: settingHolding }] = useMutation<SetHoldingData, SetHoldingVars>(SET_HOLDING);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const handleSubmitHolding = async () => {
    if (!!userGameRole && !!character && !!game) {
      // @ts-ignore
      const strengthsNoTypename = selectedStrengths.map((str: GangOption) => omit(str, ['__typename']));
      // @ts-ignore
      const weaknessesNoTypename = selectedWeaknesses.map((wk: GangOption) => omit(wk, ['__typename']));

      const holdingInput: HoldingInput = {
        id: existingHolding ? existingHolding.id : undefined,
        selectedStrengths: strengthsNoTypename,
        selectedWeaknesses: weaknessesNoTypename,
        holdingSize,
        gangSize,
        surplus,
        gangHarm,
        gangArmor,
        gangDefenseArmorBonus,
        wants,
        gigs,
        gangTags,
        souls: getSouls(holdingSize),
        barter: 0,
      };
      try {
        await setHolding({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, holding: holdingInput, vehicleCount },
        });

        if (!character.hasCompletedCharacterCreation) {
          history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateTags = (existingTags: string[], newTags: string[]) => {
    let updatedTags = existingTags;
    newTags.forEach((newTag) => {
      let tagPrefix = newTag[0];
      let tag = newTag.substring(1);
      if (tagPrefix === '-') {
        updatedTags = updatedTags.filter((t) => t !== tag);
      } else if (tagPrefix === '+') {
        updatedTags = [...updatedTags, tag];
      } else {
        console.warn('incorrect tag prefix', newTag);
      }
    });
    return updatedTags;
  };

  const unUpdateTags = (existingTags: string[], newTags: string[]) => {
    let updatedTags = existingTags;
    newTags.forEach((newTag) => {
      let tagPrefix = newTag[0];
      let tag = newTag.substring(1);
      if (tagPrefix === '+') {
        updatedTags = updatedTags.filter((t) => t !== tag);
      } else if (tagPrefix === '-') {
        updatedTags = [...updatedTags, tag];
      } else {
        console.warn('incorrect tag prefix', newTag);
      }
    });
    return updatedTags;
  };

  const addOption = (option: HoldingOption, type: 'strength' | 'weakness') => {
    let update: Partial<HoldingInput> =
      type === 'strength'
        ? { selectedStrengths: [...selectedStrengths, option] }
        : { selectedWeaknesses: [...selectedWeaknesses, option] };

    if (option.surplusChange > -2) {
      update = { ...update, surplus: surplus + option.surplusChange };
    }

    if (!!option.wantChange) {
      update = { ...update, wants: updateTags(wants, option.wantChange) };
    }

    if (!!option.newHoldingSize) {
      update = { ...update, holdingSize: option.newHoldingSize };
    }

    if (!!option.gigChange) {
      update = { ...update, gigs: updateTags(gigs, [option.gigChange]) };
    }

    if (!!option.newGangSize) {
      update = { ...update, gangSize: option.newGangSize };
    }

    if (!!option.gangTagChange) {
      update = { ...update, gangTags: updateTags(gangTags, [option.gangTagChange]) };
    }

    if (option.gangHarmChange > -2) {
      update = { ...update, gangHarm: gangHarm + option.gangHarmChange };
    }

    if (option.newArmorBonus > -1) {
      update = { ...update, gangDefenseArmorBonus: option.newArmorBonus };
    }

    if (option.newVehicleCount > -1) {
      setVehicleCount(option.newVehicleCount);
    }

    if (option.newBattleVehicleCount > -1) {
      setBattleVehicleCount(option.newBattleVehicleCount);
    }

    dispatch({ type: 'UPDATE_HOLDING', payload: update });
  };

  const removeOption = (option: HoldingOption, type: 'strength' | 'weakness') => {
    let update: Partial<HoldingInput> =
      type === 'strength'
        ? {
            selectedStrengths: selectedStrengths.filter((str: HoldingOption) => str.id !== option.id),
          }
        : {
            selectedWeaknesses: selectedWeaknesses.filter((str: HoldingOption) => str.id !== option.id),
          };

    if (option.surplusChange > -2) {
      update = { ...update, surplus: surplus - option.surplusChange };
    }

    if (!!option.wantChange) {
      update = { ...update, wants: unUpdateTags(wants, option.wantChange) };
    }

    if (!!option.newHoldingSize) {
      update = { ...update, holdingSize: holdingCreator?.defaultHoldingSize };
    }

    if (!!option.gigChange) {
      update = { ...update, gigs: unUpdateTags(gigs, [option.gigChange]) };
    }

    if (!!option.newGangSize) {
      update = { ...update, gangSize: holdingCreator?.defaultGangSize };
    }

    if (!!option.gangTagChange) {
      update = { ...update, gangTags: unUpdateTags(gangTags, [option.gangTagChange]) };
    }

    if (option.gangHarmChange > -2) {
      update = { ...update, gangHarm: gangHarm - option.gangHarmChange };
    }

    if (option.newArmorBonus > -1) {
      update = { ...update, gangDefenseArmorBonus: holdingCreator?.defaultArmorBonus };
    }

    if (option.newVehicleCount > -1) {
      !!holdingCreator && setVehicleCount(holdingCreator.defaultVehiclesCount);
    }

    if (option.newBattleVehicleCount > -1) {
      !!holdingCreator && setBattleVehicleCount(holdingCreator.defaultBattleVehicleCount);
    }

    dispatch({ type: 'UPDATE_HOLDING', payload: update });
  };

  const handleStrengthSelect = (option: HoldingOption) => {
    if (!!holdingCreator) {
      if (selectedStrengths.map((str: HoldingOption) => str.id).includes(option.id)) {
        removeOption(option, 'strength');
      } else if (selectedStrengths.length < holdingCreator.strengthCount) {
        addOption(option, 'strength');
      }
    }
  };

  const handleWeaknessSelect = (option: HoldingOption) => {
    if (!!holdingCreator) {
      if (selectedWeaknesses.map((wk: HoldingOption) => wk.id).includes(option.id)) {
        removeOption(option, 'weakness');
      } else if (selectedWeaknesses.length < holdingCreator.weaknessCount) {
        addOption(option, 'weakness');
      }
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //
  useEffect(() => {
    if (!!character?.playbookUnique?.holding) {
      dispatch({ type: 'SET_EXISTING_HOLDING', payload: character.playbookUnique.holding });
      setVehicleCount(character.vehicleCount);
      // TODO add battleVehicleCount
    } else if (!!holdingCreator) {
      const defaultState: HoldingFormState = {
        holdingSize: holdingCreator.defaultHoldingSize,
        gangSize: holdingCreator.defaultGangSize,
        souls: getSouls(holdingCreator.defaultHoldingSize),
        surplus: holdingCreator.defaultSurplus,
        barter: 0,
        gangHarm: holdingCreator.defaultGangHarm,
        gangArmor: holdingCreator.defaultGangArmor,
        gangDefenseArmorBonus: 1,
        wants: [holdingCreator.defaultWant],
        gigs: holdingCreator.defaultGigs,
        gangTags: [holdingCreator.defaultGangTag],
        selectedStrengths: [],
        selectedWeaknesses: [],
      };
      dispatch({ type: 'SET_DEFAULT_HOLDING', payload: defaultState });
      setVehicleCount(holdingCreator.defaultVehiclesCount);
      setBattleVehicleCount(holdingCreator.defaultBattleVehicleCount);
    }
  }, [character, holdingCreator]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  const renderDoubleBox = (value: string, label: string) => (
    <Box fill="horizontal" align="center" justify="between" height="90px" gap="6px" margin={{ bottom: '6px' }}>
      <RedBox pad="12px" align="center" fill justify="center">
        <HeadingWS crustReady={crustReady} level={3} margin={{ horizontal: '9px', bottom: '-3px', top: '3px' }}>
          {value}
        </HeadingWS>
      </RedBox>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );

  const renderSingleBox = (value: string, label: string) => (
    <Box align="center" justify="between" height="90px" gap="6px" margin={{ bottom: '6px' }}>
      <RedBox align="center" width="50px" fill="vertical" justify="center">
        <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
          {value}
        </HeadingWS>
      </RedBox>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );

  const renderTagBox = (tags: string[], label: string) => (
    <Box align="center" justify="between" height="100%" gap="6px" margin={{ bottom: '6px' }}>
      <RedBox pad="12px" fill justify="center">
        <TextWS>{tags.join(', ')}</TextWS>
      </RedBox>
      <TextWS style={{ fontWeight: 600 }}>{label}</TextWS>
    </Box>
  );

  return (
    <Box
      border
      data-testid="holding-form"
      width="80vw"
      direction="column"
      align="start"
      justify="between"
      overflow="auto"
      // flex="grow"
    >
      <HeadingWS crustReady={crustReady} level={2} alignSelf="center">{`${
        !!character?.name ? character.name?.toUpperCase() : '...'
      }'S HOLDING`}</HeadingWS>
      <Box border fill="horizontal" direction="row" align="start" justify="between">
        <Box fill="horizontal" pad="12px" gap="6px">
          {!!holdingCreator && <StyledMarkdown>{holdingCreator.instructions}</StyledMarkdown>}
          <ParagraphWS>Then, choose {!!holdingCreator ? holdingCreator?.strengthCount : 2}:</ParagraphWS>
          {!!holdingCreator &&
            holdingCreator.strengthOptions.map((option) => {
              return (
                <CheckBox
                  key={option.id}
                  checked={selectedStrengths.map((str: HoldingOption) => str.id).includes(option.id)}
                  label={option.description}
                  onChange={(event) => handleStrengthSelect(option)}
                />
              );
            })}
          <ParagraphWS>And choose {!!holdingCreator ? holdingCreator?.weaknessCount : 1}:</ParagraphWS>
          {!!holdingCreator &&
            holdingCreator.weaknessOptions.map((option) => {
              return (
                <CheckBox
                  key={option.id}
                  checked={selectedWeaknesses.map((wk: HoldingOption) => wk.id).includes(option.id)}
                  label={option.description}
                  onChange={(event) => handleWeaknessSelect(option)}
                />
              );
            })}
        </Box>
        <Box flex="grow" width="150px" pad="12px" gap="12px">
          <TextWS textAlign="center">---- Holding ----</TextWS>
          {renderDoubleBox(holdingSize, 'Size')}
          {renderDoubleBox(`+${surplus}barter`, 'Surplus')}
          {wants.length > 0 && renderTagBox(wants, 'Wants')}
          {gigs.length > 0 && renderTagBox(gigs, 'Gigs')}
          {renderDoubleBox(`+${gangDefenseArmorBonus}armor`, 'Defense bonus')}
        </Box>
        <Box flex="grow" width="150px" pad="12px" gap="12px">
          <TextWS textAlign="center">----- Gang -----</TextWS>
          {renderDoubleBox(gangSize, 'Size')}
          <Box fill="horizontal" direction="row" justify="between">
            {renderSingleBox(gangHarm, 'Harm')}
            {renderSingleBox(gangArmor, 'Armor')}
          </Box>
          {gangTags.length > 0 && renderTagBox(gangTags, 'Tags')}
          <ButtonWS
            primary
            fill="horizontal"
            label={settingHolding ? <Spinner fillColor="#FFF" width="36px" height="36px" /> : 'SET'}
            onClick={() => !settingHolding && handleSubmitHolding()}
            disabled={
              settingHolding ||
              (!!holdingCreator && selectedStrengths.length < holdingCreator.strengthCount) ||
              (!!holdingCreator && selectedWeaknesses.length < holdingCreator.weaknessCount)
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HoldingForm;
