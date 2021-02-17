import React, { FC, useEffect, useReducer, useState } from 'react';
import { capitalize, omit } from 'lodash';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box, CheckBox, RadioButton, Select, Text } from 'grommet';

import Spinner from '../../Spinner';
import DoubleRedBox from '../../DoubleRedBox';
import RedTagsBox from '../../RedTagsBox';
import { StyledMarkdown } from '../../styledComponents';
import { ButtonWS, HeadingWS, ParagraphWS, RedBox, TextInputWS, TextWS } from '../../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import SET_FOLLOWERS, { SetFollowersData, SetFollowersVars } from '../../../mutations/setFollowers';
import { CharacterCreationSteps, PlaybookType } from '../../../@types/enums';
import { EstablishmentInput, FollowersInput } from '../../../@types';
import { FollowersOption } from '../../../@types/staticDataInterfaces';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { updateTags, unUpdateTags } from '../../../helpers/updateTags';
import { getFollowersDescription } from '../../../helpers/getFollowersDescription';

const ATTRACTIONS_INSTRUCTIONS =
  'Your establishment features one main attraction supported by 2 side attractions (like a bar features drinks, supported by music and easy food). Choose one to be your main act and 2 for lube:';

interface Action {
  type:
    | 'SET_EXISTING_ESTABLISHMENT'
    | 'SET_DEFAULT_ESTABLISHMENT'
    | 'SET_MAIN_ATTRACTION'
    | 'REMOVE_SIDE_ATTRACTION'
    | 'ADD_SIDE_ATTRACTION';
  payload?: any;
}

const establishmentFormReducer = (state: EstablishmentInput, action: Action) => {
  switch (action.type) {
    case 'SET_EXISTING_ESTABLISHMENT':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_DEFAULT_ESTABLISHMENT':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_MAIN_ATTRACTION':
      return {
        ...state,
        mainAttraction: action.payload,
      };
    case 'REMOVE_SIDE_ATTRACTION':
      return {
        ...state,
        sideAttractions: state.sideAttractions.filter((attr) => attr !== action.payload),
      };
    case 'ADD_SIDE_ATTRACTION':
      return {
        ...state,
        sideAttractions: [...state.sideAttractions, action.payload],
      };
    default:
      return state;
  }
};

const initialState: EstablishmentInput = {
  id: undefined,
  mainAttraction: '',
  sideAttractions: [],
  atmospheres: [],
  regulars: [],
  highlightedRegulars: [],
  interestedParties: [],
  highlightedInterestedParties: [],
  securityOptions: [],
  castAndCrew: [],
};

const EstablishmentForm: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [{ mainAttraction, sideAttractions }, dispatch] = useReducer(establishmentFormReducer, initialState);
  const [workingAttractions, setWorkingAttractions] = useState<string[]>([]);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType: PlaybookType.maestroD },
  });

  const establishmentCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator?.establishmentCreator;
  // const [setFollowers, { loading: settingFollowers }] = useMutation<SetFollowersData, SetFollowersVars>(SET_FOLLOWERS);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  // const handleSubmitFollowers = async () => {
  //   if (!!userGameRole && !!character && !!game) {
  //     // @ts-ignore
  //     const strengthsNoTypename = selectedStrengths.map((str: FollowersOption) => omit(str, ['__typename']));
  //     // @ts-ignore
  //     const weaknessesNoTypename = selectedWeaknesses.map((wk: FollowersOption) => omit(wk, ['__typename']));
  //     const followersInput: FollowersInput = {
  //       id: character?.playbookUnique?.followers ? character.playbookUnique.followers.id : undefined,
  //       selectedStrengths: strengthsNoTypename,
  //       selectedWeaknesses: weaknessesNoTypename,
  //       description,
  //       travelOption,
  //       characterization,
  //       followers,
  //       fortune,
  //       barter,
  //       surplusBarter,
  //       surplus,
  //       wants,
  //     };
  //     try {
  //       await setFollowers({
  //         variables: { gameRoleId: userGameRole.id, characterId: character.id, followers: followersInput },
  //       });
  //       if (!character.hasCompletedCharacterCreation) {
  //         history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
  //         window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };
  const handleMainAttractionSelect = (attraction: string) => {
    if (!!establishmentCreator) {
      setWorkingAttractions(() => establishmentCreator?.attractions.filter((attr) => attr !== attraction));
      dispatch({ type: 'SET_MAIN_ATTRACTION', payload: attraction });
      if (sideAttractions.includes(attraction)) {
        dispatch({ type: 'REMOVE_SIDE_ATTRACTION', payload: attraction });
      }
    }
  };

  const handleSelectSideAttraction = (attraction: string) => {
    if (sideAttractions.includes(attraction)) {
      dispatch({ type: 'REMOVE_SIDE_ATTRACTION', payload: attraction });
    } else if (sideAttractions.length < 2) {
      dispatch({ type: 'ADD_SIDE_ATTRACTION', payload: attraction });
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  // Set workingAttractions when component mounts
  useEffect(() => {
    if (!!establishmentCreator && !character?.playbookUnique?.establishment) {
      setWorkingAttractions(establishmentCreator.attractions);
    } else if (!!establishmentCreator && !!character?.playbookUnique?.establishment) {
      const { mainAttraction, sideAttractions } = character.playbookUnique.establishment;
      const filteredAttractions = establishmentCreator.attractions.filter(
        (attr) => attr !== mainAttraction && !sideAttractions.includes(attr)
      );
      setWorkingAttractions(filteredAttractions);
    }
  }, [character, establishmentCreator]);

  // Set existing or blank Establishment when component mounts
  useEffect(() => {
    if (!!character?.playbookUnique?.establishment) {
      dispatch({ type: 'SET_EXISTING_ESTABLISHMENT', payload: character.playbookUnique.establishment });
    } else if (!!establishmentCreator) {
      dispatch({ type: 'SET_DEFAULT_ESTABLISHMENT', payload: initialState });
    }
  }, [character, establishmentCreator]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  // const renderPills = () => (
  //   <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
  //     {!!followersCreator &&
  //       followersCreator.characterizationOptions.map((option) => (
  //         <Box
  //           data-testid={`${option}-pill`}
  //           key={option}
  //           background={characterization === option ? { color: '#698D70', dark: true } : '#4C684C'}
  //           round="medium"
  //           pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
  //           margin={{ vertical: '3px', horizontal: '3px' }}
  //           justify="center"
  //           onClick={() => handleCharacterizationSelect(option)}
  //           style={{ boxShadow: '0 0 3px 0.5px #000' }}
  //           hoverIndicator={{ color: '#698D70', dark: true }}
  //         >
  //           <Text weight="bold" size="large">
  //             {option}
  //           </Text>
  //         </Box>
  //       ))}
  //   </Box>
  // );

  return (
    <Box data-testid="followers-form" width="90vw" align="start" justify="between" overflow="auto">
      <HeadingWS crustReady={crustReady} level={2} alignSelf="center">{`${
        !!character?.name ? character.name?.toUpperCase() : '...'
      }'S ESTABLISHMENT`}</HeadingWS>
      <Box fill="horizontal" direction="row" justify="between" gap="12px">
        <Box>
          <Box direction="row" gap="12px">
            <ParagraphWS style={{ maxWidth: '500px' }} margin={{ top: '0px' }}>
              {ATTRACTIONS_INSTRUCTIONS}
            </ParagraphWS>
            <Select
              id="main-attraction-input"
              aria-label="main-attraction-input"
              name="main-attraction"
              placeholder="Main attraction"
              options={establishmentCreator?.attractions || []}
              onChange={(e) => handleMainAttractionSelect(e.value)}
            />
          </Box>
          <ParagraphWS margin={{ top: '0px' }}>Select side attractions:</ParagraphWS>
          <Box direction="row" wrap gap="6px">
            {workingAttractions.map((attr, index) => (
              <CheckBox
                key={attr + index.toString()}
                name={attr}
                checked={sideAttractions.includes(attr)}
                label={<TextWS style={{ minWidth: '90px' }}>{attr}</TextWS>}
                value={attr}
                onChange={(e) => handleSelectSideAttraction(e.target.value)}
              />
            ))}
          </Box>
        </Box>
        <Box align="center" width="200px" flex="grow" fill="vertical">
          <RedBox fill justify="center" pad="12px" gap="12px">
            {!!mainAttraction && <TextWS>Main: {mainAttraction}</TextWS>}
            {sideAttractions.length > 0 && <TextWS>Side: {sideAttractions.join(', ')}</TextWS>}
          </RedBox>
          <TextWS weight={600}>Attractions</TextWS>
        </Box>
      </Box>
    </Box>
  );
};

export default EstablishmentForm;
