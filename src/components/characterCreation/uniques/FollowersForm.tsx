import React, { FC, useEffect, useReducer } from 'react';
import { capitalize, omit } from 'lodash';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box, CheckBox, Text } from 'grommet';

import Spinner from '../../Spinner';
import DoubleRedBox from '../../DoubleRedBox';
import RedTagsBox from '../../RedTagsBox';
import { StyledMarkdown } from '../../styledComponents';
import { ButtonWS, HeadingWS, ParagraphWS } from '../../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import SET_FOLLOWERS, { SetFollowersData, SetFollowersVars } from '../../../mutations/setFollowers';
import { CharacterCreationSteps, PlaybookType } from '../../../@types/enums';
import { FollowersInput } from '../../../@types';
import { FollowersOption } from '../../../@types/staticDataInterfaces';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { updateTags, unUpdateTags } from '../../../helpers/updateTags';
import { getFollowersDescription } from '../../../helpers/getFollowersDescription';

interface FollowersFormState {
  description: string;
  travelOption: string;
  characterization: string;
  followers: number;
  fortune: number;
  barter: number;
  surplusBarter: number;
  surplus: string[];
  wants: string[];
  selectedStrengths: FollowersOption[];
  selectedWeaknesses: FollowersOption[];
}

interface Action {
  type:
    | 'SET_EXISTING_FOLLOWERS'
    | 'SET_DEFAULT_FOLLOWERS'
    | 'UPDATE_FOLLOWERS'
    | 'SET_CHARACTERIZATION'
    | 'SET_TRAVEL_OPTION';
  payload?: any;
}

const followersFormReducer = (state: FollowersFormState, action: Action) => {
  switch (action.type) {
    case 'SET_EXISTING_FOLLOWERS':
      return {
        ...omit(action.payload, 'id'),
      };
    case 'SET_EXISTING_FOLLOWERS':
      return {
        ...state,
        ...action.payload,
      };
    case 'UPDATE_FOLLOWERS':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_CHARACTERIZATION':
      return {
        ...state,
        description: action.payload.description,
        characterization: action.payload.characterization,
      };
    case 'SET_TRAVEL_OPTION':
      return {
        ...state,
        description: action.payload.description,
        travelOption: action.payload.travelOption,
      };
    default:
      return state;
  }
};

const updateTagsWithBarter = (existingTags: string[], newBarterTag: string) => {
  // remove old barter tag
  const noBarterArray = existingTags.filter((tag) => !tag.includes('barter'));

  // Add new barter tag
  return [...noBarterArray, newBarterTag];
};

const FollowersForm: FC = () => {
  const initialState: FollowersFormState = {
    description: '',
    travelOption: '',
    characterization: '',
    followers: 20,
    fortune: 1,
    barter: 0,
    surplusBarter: 1,
    surplus: ['1-barter'],
    wants: ['desertion'],
    selectedStrengths: [],
    selectedWeaknesses: [],
  };
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [
    {
      description,
      travelOption,
      characterization,
      followers,
      fortune,
      barter,
      surplusBarter,
      surplus,
      wants,
      selectedStrengths,
      selectedWeaknesses,
    },
    dispatch,
  ] = useReducer(followersFormReducer, initialState);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType: PlaybookType.hocus },
  });

  const followersCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator?.followersCreator;
  const [setFollowers, { loading: settingFollowers }] = useMutation<SetFollowersData, SetFollowersVars>(SET_FOLLOWERS);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const handleSubmitFollowers = async () => {
    if (!!userGameRole && !!character && !!game) {
      // @ts-ignore
      const strengthsNoTypename = selectedStrengths.map((str: FollowersOption) => omit(str, ['__typename']));
      // @ts-ignore
      const weaknessesNoTypename = selectedWeaknesses.map((wk: FollowersOption) => omit(wk, ['__typename']));
      const followersInput: FollowersInput = {
        id: character?.playbookUnique?.followers ? character.playbookUnique.followers.id : undefined,
        selectedStrengths: strengthsNoTypename,
        selectedWeaknesses: weaknessesNoTypename,
        description,
        travelOption,
        characterization,
        followers,
        fortune,
        barter,
        surplusBarter,
        surplus,
        wants,
      };
      try {
        await setFollowers({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, followers: followersInput },
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

  const handleCharacterizationSelect = (option: string) => {
    const description = getFollowersDescription(option, followers, travelOption);
    dispatch({ type: 'SET_CHARACTERIZATION', payload: { characterization: option, description } });
  };

  const handleTravelOptionSelect = (option: string) => {
    const description = getFollowersDescription(characterization, followers, option);
    dispatch({ type: 'SET_TRAVEL_OPTION', payload: { travelOption: option, description } });
  };

  const addOption = (option: FollowersOption, type: 'strength' | 'weakness') => {
    let update: Partial<FollowersInput> =
      type === 'strength'
        ? { selectedStrengths: [...selectedStrengths, option] }
        : { selectedWeaknesses: [...selectedWeaknesses, option] };

    if (option.newNumberOfFollowers > -1) {
      const description = getFollowersDescription(characterization, option.newNumberOfFollowers, travelOption);
      update = { ...update, followers: option.newNumberOfFollowers, description };
    }

    if (option.surplusBarterChange > -2) {
      const newBarter = surplusBarter + option.surplusBarterChange;
      const newSurplus = updateTagsWithBarter(surplus, `${newBarter}-barter`);
      update = { ...update, surplusBarter: newBarter, surplus: newSurplus };
    }

    if (option.fortuneChange > 0) {
      update = { ...update, fortune: fortune + option.fortuneChange };
    }

    if (!!option.surplusChange) {
      update = { ...update, surplus: updateTags(surplus, [option.surplusChange]) };
    }

    if (!!option.wantChange) {
      update = { ...update, wants: updateTags(wants, option.wantChange) };
    }

    dispatch({ type: 'UPDATE_FOLLOWERS', payload: update });
  };

  const removeOption = (option: FollowersOption, type: 'strength' | 'weakness') => {
    let update: Partial<FollowersInput> =
      type === 'strength'
        ? {
            selectedStrengths: selectedStrengths.filter((str: FollowersOption) => str.id !== option.id),
          }
        : {
            selectedWeaknesses: selectedWeaknesses.filter((str: FollowersOption) => str.id !== option.id),
          };

    if (!!followersCreator && option.newNumberOfFollowers > -1) {
      const description = getFollowersDescription(characterization, followersCreator.defaultNumberOfFollowers, travelOption);
      update = { ...update, followers: followersCreator.defaultNumberOfFollowers, description };
    }

    if (option.surplusBarterChange > -2) {
      const newBarter = surplusBarter - option.surplusBarterChange;
      const newSurplus = updateTagsWithBarter(surplus, `${newBarter}-barter`);
      update = { ...update, surplusBarter: newBarter, surplus: newSurplus };
    }

    if (option.fortuneChange > 0) {
      update = { ...update, fortune: fortune - option.fortuneChange };
    }

    if (!!option.surplusChange) {
      update = { ...update, surplus: unUpdateTags(surplus, [option.surplusChange]) };
    }

    if (!!option.wantChange) {
      update = { ...update, wants: unUpdateTags(wants, option.wantChange) };
    }

    dispatch({ type: 'UPDATE_FOLLOWERS', payload: update });
  };

  const handleStrengthSelect = (option: FollowersOption) => {
    if (!!followersCreator) {
      if (selectedStrengths.map((str: FollowersOption) => str.id).includes(option.id)) {
        removeOption(option, 'strength');
      } else if (selectedStrengths.length < followersCreator.strengthCount) {
        addOption(option, 'strength');
      }
    }
  };

  const handleWeaknessSelect = (option: FollowersOption) => {
    if (!!followersCreator) {
      if (selectedWeaknesses.map((wk: FollowersOption) => wk.id).includes(option.id)) {
        removeOption(option, 'weakness');
      } else if (selectedWeaknesses.length < followersCreator.weaknessCount) {
        addOption(option, 'weakness');
      }
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //
  useEffect(() => {
    if (!!character?.playbookUnique?.followers) {
      dispatch({ type: 'SET_EXISTING_FOLLOWERS', payload: character.playbookUnique.followers });
    } else if (!!followersCreator) {
      const defaultState: FollowersFormState = {
        description: '',
        travelOption: '',
        characterization: '',
        followers: followersCreator.defaultNumberOfFollowers,
        fortune: followersCreator.defaultFortune,
        barter: 0,
        surplusBarter: followersCreator.defaultSurplusBarter,
        surplus: ['1-barter'],
        wants: followersCreator.defaultWants,
        selectedStrengths: [],
        selectedWeaknesses: [],
      };
      dispatch({ type: 'SET_DEFAULT_FOLLOWERS', payload: defaultState });
    }
  }, [character, followersCreator]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  const renderPills = () => (
    <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
      {!!followersCreator &&
        followersCreator.characterizationOptions.map((option) => (
          <Box
            data-testid={`${option}-pill`}
            key={option}
            background={characterization === option ? { color: '#698D70', dark: true } : '#4C684C'}
            round="medium"
            pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
            margin={{ vertical: '3px', horizontal: '3px' }}
            justify="center"
            onClick={() => handleCharacterizationSelect(option)}
            style={{ boxShadow: '0 0 3px 0.5px #000' }}
            hoverIndicator={{ color: '#698D70', dark: true }}
          >
            <Text weight="bold" size="large">
              {option}
            </Text>
          </Box>
        ))}
    </Box>
  );

  return (
    <Box data-testid="followers-form" width="80vw" direction="column" align="start" justify="between" overflow="auto">
      <HeadingWS crustReady={crustReady} level={2} alignSelf="center">{`${
        !!character?.name ? character.name?.toUpperCase() : '...'
      }'S FOLLOWERS`}</HeadingWS>
      <Box fill="horizontal" direction="row" align="start" justify="between">
        <Box fill="horizontal" pad="12px" gap="6px">
          {!!followersCreator && <StyledMarkdown>{followersCreator.instructions}</StyledMarkdown>}
          <ParagraphWS margin={{ bottom: '0px' }}>Characterize them:</ParagraphWS>
          {renderPills()}
          <ParagraphWS margin={{ bottom: '0px' }}>If you travel, they:</ParagraphWS>
          {!!followersCreator &&
            followersCreator.travelOptions.map((option) => {
              return (
                <CheckBox
                  key={option}
                  checked={travelOption === option}
                  label={option}
                  onChange={() => handleTravelOptionSelect(option)}
                />
              );
            })}
          <ParagraphWS margin={{ bottom: '0px' }}>
            Choose {!!followersCreator ? followersCreator?.strengthCount : 2}:
          </ParagraphWS>
          {!!followersCreator &&
            followersCreator.strengthOptions.map((option) => {
              return (
                <CheckBox
                  key={option.id}
                  checked={selectedStrengths.map((str: FollowersOption) => str.id).includes(option.id)}
                  label={option.description}
                  onChange={(event) => handleStrengthSelect(option)}
                />
              );
            })}
          <ParagraphWS margin={{ bottom: '0px' }}>
            Choose {!!followersCreator ? followersCreator?.weaknessCount : 2}:
          </ParagraphWS>
          {!!followersCreator &&
            followersCreator.weaknessOptions.map((option) => {
              return (
                <CheckBox
                  key={option.id}
                  checked={selectedWeaknesses.map((wk: FollowersOption) => wk.id).includes(option.id)}
                  label={option.description}
                  onChange={(event) => handleWeaknessSelect(option)}
                />
              );
            })}
        </Box>
        <Box flex="grow" width="150px" pad="12px" gap="12px">
          <DoubleRedBox value={`+${fortune}fortune`} label="Fortune" />
          {!!description && <RedTagsBox tags={[description]} label="Description" height="100%" />}
          {surplus.length > 0 && <RedTagsBox tags={surplus} label="Surplus" height="100%" />}
          {wants.length > 0 && <RedTagsBox tags={wants} label="Want" height="100%" />}
          <ButtonWS
            primary
            fill="horizontal"
            label={settingFollowers ? <Spinner fillColor="#FFF" width="36px" height="36px" /> : 'SET'}
            onClick={() => !settingFollowers && handleSubmitFollowers()}
            disabled={
              settingFollowers ||
              (!!followersCreator && selectedStrengths.length < followersCreator.strengthCount) ||
              (!!followersCreator && selectedWeaknesses.length < followersCreator.weaknessCount)
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default FollowersForm;
