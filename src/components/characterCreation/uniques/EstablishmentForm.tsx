import React, { ChangeEvent, FC, useEffect, useReducer, useState } from 'react';
import { capitalize, omit } from 'lodash';
import { useMutation, useQuery } from '@apollo/client';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router-dom';
import { Box, CheckBox, Select, Text } from 'grommet';

import { StyledMarkdown } from '../../styledComponents';
import { ButtonWS, HeadingWS, ParagraphWS, RedBox, TextInputWS, TextWS } from '../../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import SET_FOLLOWERS, { SetFollowersData, SetFollowersVars } from '../../../mutations/setFollowers';
import { CharacterCreationSteps, PlaybookType } from '../../../@types/enums';
import { EstablishmentInput, FollowersInput } from '../../../@types';
import { FollowersOption, SecurityOption } from '../../../@types/staticDataInterfaces';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { updateTags, unUpdateTags } from '../../../helpers/updateTags';
import { getFollowersDescription } from '../../../helpers/getFollowersDescription';
import { CastCrew } from '../../../@types/dataInterfaces';
import SET_ESTABLISHMENT, { SetEstablishmentData, SetEstablishmentVars } from '../../../mutations/setEstablishment';
import Spinner from '../../Spinner';

const ATTRACTIONS_INSTRUCTIONS =
  'Your establishment features one main attraction supported by 2 side attractions (like a bar features drinks, supported by music and easy food). Choose one to be your main act and 2 for lube:';

const CAST_CREW_INSTRUCTIONS =
  "Your cast & crew can consist entirely of the other players' characters, with their agreement, or entirely of NPCs, or any mix. If it includes any NPCs, sketch them out - names and the 1-line descriptions - with the MC. Make sure they suit your establishment's scene.";

const REGULARS_INSTRUCTIONS = '_**Your regulars**_ include these 5 NPCs (at least): Lamprey, Ba, Camo, Toyota and Lits.';

const ATMOSPHERE_INSTRUCTIONS = "_**For your establishment's atmosphere**_, choose 3 or 4:";

const INTERESTED_NPCS_INSTRUCTIONS =
  'These 3 NPCs (at least) have an _**interest in your establishment**_: Been, Rolfball, Gams.';

const SECURITY_INSTRUCTIONS = '_**For security, choose 2**_';

interface Action {
  type:
    | 'SET_EXISTING_ESTABLISHMENT'
    | 'SET_DEFAULT_ESTABLISHMENT'
    | 'SET_MAIN_ATTRACTION'
    | 'REMOVE_SIDE_ATTRACTION'
    | 'ADD_SIDE_ATTRACTION'
    | 'REMOVE_ATMOSPHERE'
    | 'ADD_ATMOSPHERE'
    | 'ADD_REGULAR'
    | 'SET_BEST_REGULAR'
    | 'SET_WORST_REGULAR'
    | 'ADD_INTERESTED_NPC'
    | 'SET_WANTS_IN'
    | 'SET_OWES_FOR_IT'
    | 'SET_WANTS_IT_GONE'
    | 'REMOVE_SECURITY_OPTION'
    | 'ADD_SECURITY_OPTION'
    | 'ADD_CREW';
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
    case 'REMOVE_ATMOSPHERE':
      return {
        ...state,
        atmospheres: state.atmospheres.filter((atmos) => atmos !== action.payload),
      };
    case 'ADD_ATMOSPHERE':
      return {
        ...state,
        atmospheres: [...state.atmospheres, action.payload],
      };
    case 'ADD_REGULAR':
      return {
        ...state,
        regulars: [...state.regulars, action.payload],
      };
    case 'SET_BEST_REGULAR':
      return {
        ...state,
        bestRegular: action.payload,
      };
    case 'SET_WORST_REGULAR':
      return {
        ...state,
        worstRegular: action.payload,
      };
    case 'ADD_INTERESTED_NPC':
      return {
        ...state,
        interestedParties: [...state.interestedParties, action.payload],
      };
    case 'SET_WANTS_IN':
      return {
        ...state,
        wantsInOnIt: action.payload,
      };
    case 'SET_OWES_FOR_IT':
      return {
        ...state,
        oweForIt: action.payload,
      };
    case 'SET_WANTS_IT_GONE':
      return {
        ...state,
        wantsItGone: action.payload,
      };
    case 'REMOVE_SECURITY_OPTION':
      return {
        ...state,
        securityOptions: state.securityOptions.filter((opt) => opt.id !== action.payload.id),
      };
    case 'ADD_SECURITY_OPTION':
      return {
        ...state,
        securityOptions: [...state.securityOptions, action.payload],
      };
    case 'ADD_CREW':
      return {
        ...state,
        castAndCrew: [...state.castAndCrew, action.payload],
      };
    default:
      return state;
  }
};

const initialState: EstablishmentInput = {
  id: undefined,
  mainAttraction: '',
  bestRegular: '',
  worstRegular: '',
  wantsInOnIt: '',
  oweForIt: '',
  wantsItGone: '',
  sideAttractions: [],
  atmospheres: [],
  regulars: [],
  interestedParties: [],
  securityOptions: [],
  castAndCrew: [],
};

const EstablishmentForm: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [
    {
      mainAttraction,
      bestRegular,
      worstRegular,
      wantsInOnIt,
      oweForIt,
      wantsItGone,
      sideAttractions,
      atmospheres,
      regulars,
      interestedParties,
      securityOptions,
      castAndCrew,
    },
    dispatch,
  ] = useReducer(establishmentFormReducer, initialState);
  const [workingAttractions, setWorkingAttractions] = useState<string[]>([]);
  const [regularName, setRegularName] = useState('');
  const [interestedNpcName, setInterestedNpcName] = useState('');
  const [crewName, setCrewName] = useState('');
  const [crewDesc, setCrewDesc] = useState('');

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
  const [setEstablishment, { loading: settingEstablishment }] = useMutation<SetEstablishmentData, SetEstablishmentVars>(
    SET_ESTABLISHMENT
  );

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const securityValues = securityOptions.map((opt: SecurityOption) => opt.value);

  const isEstablishmentComplete =
    !!mainAttraction &&
    !!bestRegular &&
    !!worstRegular &&
    !!wantsInOnIt &&
    !!oweForIt &&
    !!wantsItGone &&
    sideAttractions.length === 2 &&
    [3, 4].includes(atmospheres.length) &&
    regulars.length >= 5 &&
    interestedParties.length >= 3 &&
    securityValues.length > 0 &&
    securityValues.reduce((a: number, b: number) => a + b) === 2 &&
    castAndCrew.length > 0;

  const handleSubmitEstablishment = async () => {
    if (!!userGameRole && !!character && !!game && isEstablishmentComplete) {
      // @ts-ignore
      const securityNoTypename = securityOptions.map((so: SecurityOption) => omit(so, ['__typename']));
      // @ts-ignore
      const crewNoTypename = castAndCrew.map((cc: CastCrew) => omit(cc, ['__typename']));

      const establishmentInput: EstablishmentInput = {
        id: character.playbookUnique?.establishment ? character.playbookUnique.establishment.id : undefined,
        mainAttraction,
        bestRegular,
        worstRegular,
        wantsInOnIt,
        oweForIt,
        wantsItGone,
        sideAttractions,
        atmospheres,
        regulars,
        interestedParties,
        securityOptions: securityNoTypename,
        castAndCrew: crewNoTypename,
      };
      try {
        await setEstablishment({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, establishment: establishmentInput },
          // TODO: add optimisticResponse
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
    if (!!establishmentCreator) {
      if (sideAttractions.includes(attraction)) {
        dispatch({ type: 'REMOVE_SIDE_ATTRACTION', payload: attraction });
      } else if (sideAttractions.length < establishmentCreator.sideAttractionCount) {
        dispatch({ type: 'ADD_SIDE_ATTRACTION', payload: attraction });
      }
    }
  };

  const handleAtmosphereSelect = (atmosphere: string) => {
    if (!!establishmentCreator) {
      if (atmospheres.includes(atmosphere)) {
        dispatch({ type: 'REMOVE_ATMOSPHERE', payload: atmosphere });
      } else if (atmospheres.length < 4) {
        dispatch({ type: 'ADD_ATMOSPHERE', payload: atmosphere });
      }
    }
  };

  const handleAddRegular = () => {
    dispatch({ type: 'ADD_REGULAR', payload: regularName });
    setRegularName('');
  };

  const handleAddInterestedNpc = () => {
    dispatch({ type: 'ADD_INTERESTED_NPC', payload: interestedNpcName });
    setInterestedNpcName('');
  };

  const handleSelectSecurity = (option: SecurityOption) => {
    if (securityOptions.includes(option)) {
      dispatch({ type: 'REMOVE_SECURITY_OPTION', payload: option });
    } else if (securityValues.length === 0 || securityValues.reduce((a: number, b: number) => a + b) + option.value <= 2) {
      dispatch({ type: 'ADD_SECURITY_OPTION', payload: option });
    }
  };

  const handleAddCrew = () => {
    const crew: CastCrew = {
      id: uuid(),
      name: crewName,
      description: crewDesc,
    };
    dispatch({ type: 'ADD_CREW', payload: crew });
    setCrewName('');
    setCrewDesc('');
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  // Set workingAttractions when component mounts
  useEffect(() => {
    if (!!establishmentCreator && !character?.playbookUnique?.establishment) {
      setWorkingAttractions(establishmentCreator.attractions);
    } else if (!!establishmentCreator && !!character?.playbookUnique?.establishment) {
      const { mainAttraction, sideAttractions } = character.playbookUnique.establishment;
      const filteredAttractions = establishmentCreator.attractions.filter((attr) => attr !== mainAttraction);
      setWorkingAttractions(filteredAttractions);
    }
  }, [character, establishmentCreator]);

  // Set existing or blank Establishment when component mounts
  useEffect(() => {
    if (!!character?.playbookUnique?.establishment) {
      dispatch({ type: 'SET_EXISTING_ESTABLISHMENT', payload: character.playbookUnique.establishment });
    } else if (!!establishmentCreator) {
      dispatch({
        type: 'SET_DEFAULT_ESTABLISHMENT',
        payload: {
          ...initialState,
          regulars: establishmentCreator.regularsNames,
          interestedParties: establishmentCreator.interestedPartyNames,
        },
      });
    }
  }, [character, establishmentCreator]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  const renderPills = (atmosphere: string) => (
    <Box
      data-testid={`${atmosphere}-pill`}
      key={atmosphere}
      background={atmospheres.includes(atmosphere) ? { color: '#698D70', dark: true } : '#4C684C'}
      round="medium"
      pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
      margin={{ vertical: '3px', horizontal: '3px' }}
      justify="center"
      onClick={() => handleAtmosphereSelect(atmosphere)}
      style={{ boxShadow: '0 0 3px 0.5px #000' }}
      hoverIndicator={{ color: '#698D70', dark: true }}
    >
      <Text size="medium">{atmosphere}</Text>
    </Box>
  );

  return (
    <Box data-testid="followers-form" width="80vw" align="start" justify="between" overflow="auto" gap="18px">
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
              value={mainAttraction}
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
      <Box fill="horizontal" justify="between" gap="12px" margin={{ top: '6px' }}>
        <StyledMarkdown>{ATMOSPHERE_INSTRUCTIONS}</StyledMarkdown>
        <Box direction="row" gap="12px">
          <Box direction="row" wrap>
            {establishmentCreator?.atmospheres.map((atmosphere) => renderPills(atmosphere))}
          </Box>
          <Box align="center" width="200px" flex="grow" fill="vertical">
            <RedBox fill justify="center" pad="12px" gap="12px">
              {atmospheres.length > 0 && <TextWS>{atmospheres.join(', ')}</TextWS>}
            </RedBox>
            <TextWS weight={600}>Atmosphere</TextWS>
          </Box>
        </Box>
      </Box>
      <Box fill="horizontal" justify="between" gap="12px" margin={{ top: '6px' }}>
        <StyledMarkdown>{REGULARS_INSTRUCTIONS}</StyledMarkdown>
        <Box direction="row" justify="between" align="center" gap="12px">
          <Box gap="12px">
            <Box direction="row" fill align="center" gap="12px">
              <TextInputWS
                placeholder="Add regular (optional)"
                value={regularName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRegularName(e.target.value)}
              />
              <ButtonWS
                secondary
                label="ADD"
                disabled={!regularName || regulars.includes(regularName)}
                fill="horizontal"
                style={{ outline: 'none', boxShadow: 'none', width: '100px' }}
                onClick={() => handleAddRegular()}
              />
            </Box>
            <Box direction="row" fill align="center" gap="12px">
              <TextWS style={{ minWidth: '250px' }}>{establishmentCreator?.regularsQuestions[0]}</TextWS>
              <Select
                aria-label="best-regular-input"
                placeholder="Select regular"
                value={bestRegular}
                options={regulars.filter((reg: string) => reg !== worstRegular)}
                onChange={(e) => dispatch({ type: 'SET_BEST_REGULAR', payload: e.value })}
              />
            </Box>
            <Box direction="row" fill align="center" gap="12px">
              <TextWS style={{ minWidth: '250px' }}>{establishmentCreator?.regularsQuestions[1]}</TextWS>
              <Select
                aria-label="worst-regular-input"
                placeholder="Select regular"
                value={worstRegular}
                options={regulars.filter((reg: string) => reg !== bestRegular)}
                onChange={(e) => dispatch({ type: 'SET_WORST_REGULAR', payload: e.value })}
              />
            </Box>
          </Box>
          <Box align="center" width="200px" fill="vertical">
            <RedBox fill justify="center" pad="12px" gap="12px">
              {regulars.length > 0 && <TextWS>{regulars.join(', ')}</TextWS>}
              {!!bestRegular && <TextWS>{bestRegular} is your best regular</TextWS>}
              {!!worstRegular && <TextWS>{worstRegular} is your worst regular</TextWS>}
            </RedBox>
            <TextWS weight={600}>Regulars</TextWS>
          </Box>
        </Box>
      </Box>
      <Box fill="horizontal" justify="between" gap="12px" margin={{ top: '6px' }}>
        <StyledMarkdown>{INTERESTED_NPCS_INSTRUCTIONS}</StyledMarkdown>
        <Box direction="row" justify="between" gap="12px">
          <Box gap="12px">
            <Box direction="row" fill align="center" gap="12px">
              <TextInputWS
                placeholder="Add interested NPC (optional)"
                value={interestedNpcName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInterestedNpcName(e.target.value)}
              />
              <ButtonWS
                secondary
                label="ADD"
                disabled={!interestedNpcName || interestedParties.includes(interestedNpcName)}
                fill="horizontal"
                style={{ outline: 'none', boxShadow: 'none', width: '100px' }}
                onClick={() => handleAddInterestedNpc()}
              />
            </Box>
            <Box direction="row" fill align="center" gap="12px">
              <TextWS style={{ minWidth: '250px' }}>{establishmentCreator?.interestedPartyQuestions[0]}</TextWS>
              <Select
                aria-label="wants-in-on-it-input"
                placeholder="Select NPC"
                value={wantsInOnIt}
                options={interestedParties.filter((npc: string) => npc !== oweForIt && npc !== wantsItGone)}
                onChange={(e) => dispatch({ type: 'SET_WANTS_IN', payload: e.value })}
              />
            </Box>
            <Box direction="row" fill align="center" gap="12px">
              <TextWS style={{ minWidth: '250px' }}>{establishmentCreator?.interestedPartyQuestions[1]}</TextWS>
              <Select
                aria-label="owes-for-it-input"
                placeholder="Select NPC"
                value={oweForIt}
                options={interestedParties.filter((npc: string) => npc !== wantsInOnIt && npc !== wantsItGone)}
                onChange={(e) => dispatch({ type: 'SET_OWES_FOR_IT', payload: e.value })}
              />
            </Box>
            <Box direction="row" fill align="center" gap="12px">
              <TextWS style={{ minWidth: '250px' }}>{establishmentCreator?.interestedPartyQuestions[2]}</TextWS>
              <Select
                aria-label="wants-it-gone-input"
                placeholder="Select NPC"
                value={wantsItGone}
                options={interestedParties.filter((npc: string) => npc !== wantsInOnIt && npc !== oweForIt)}
                onChange={(e) => dispatch({ type: 'SET_WANTS_IT_GONE', payload: e.value })}
              />
            </Box>
          </Box>
          <Box align="center" width="200px" fill="vertical">
            <RedBox fill justify="center" pad="12px" gap="12px">
              {interestedParties.length > 0 && <TextWS>{interestedParties.join(', ')}</TextWS>}
              {!!wantsInOnIt && <TextWS>{wantsInOnIt} wants in on it</TextWS>}
              {!!oweForIt && <TextWS>You owe {oweForIt} for it</TextWS>}
              {!!wantsItGone && <TextWS>{wantsItGone} wants it gone</TextWS>}
            </RedBox>
            <TextWS weight={600}>Interested NPCs</TextWS>
          </Box>
        </Box>
      </Box>
      <Box fill="horizontal" justify="between" gap="12px" margin={{ top: '6px' }}>
        <StyledMarkdown>{SECURITY_INSTRUCTIONS}</StyledMarkdown>
        <Box direction="row" justify="between">
          <Box gap="12px">
            {establishmentCreator?.securityOptions.map((option) => (
              <CheckBox
                key={option.id}
                checked={securityOptions.map((opt: SecurityOption) => opt.id).includes(option.id)}
                label={
                  <TextWS>
                    {option.description}
                    {option.value > 1 && ` (counts as ${option.value})`}
                  </TextWS>
                }
                onChange={() => handleSelectSecurity(option)}
              />
            ))}
          </Box>
          <Box align="center" width="200px" fill="vertical">
            <RedBox fill justify="center" pad="12px" gap="12px">
              {securityOptions.length > 0 &&
                securityOptions.map((opt: SecurityOption) => <TextWS key={opt.id}>{opt.description}</TextWS>)}
            </RedBox>
            <TextWS weight={600}>Security</TextWS>
          </Box>
        </Box>
      </Box>
      <Box fill="horizontal" justify="between" gap="12px" margin={{ top: '6px' }}>
        <StyledMarkdown>{CAST_CREW_INSTRUCTIONS}</StyledMarkdown>
        <Box direction="row" justify="between" gap="12px">
          <Box gap="12px" flex="grow">
            <Box direction="row" fill="horizontal" align="center" gap="12px">
              <TextInputWS
                placeholder="Name"
                value={crewName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCrewName(e.target.value)}
              />
              <ButtonWS
                secondary
                label="ADD"
                disabled={!crewName}
                fill="horizontal"
                style={{ outline: 'none', boxShadow: 'none', width: '100px' }}
                onClick={() => handleAddCrew()}
              />
            </Box>
            <TextInputWS
              placeholder="Short description"
              value={crewDesc}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCrewDesc(e.target.value)}
            />
          </Box>
          <Box align="center" width="200px" fill="vertical">
            <RedBox fill justify="center" pad="12px" gap="12px">
              {castAndCrew.length > 0 && <TextWS>{castAndCrew.map((cc: CastCrew) => cc.name).join(', ')}</TextWS>}
            </RedBox>
            <TextWS weight={600}>Cast & Crew</TextWS>
          </Box>
        </Box>
      </Box>
      <ButtonWS
        primary
        fill="horizontal"
        label={settingEstablishment ? <Spinner fillColor="#FFF" width="36px" height="36px" /> : 'SET'}
        onClick={() => !settingEstablishment && handleSubmitEstablishment()}
        disabled={settingEstablishment || !isEstablishmentComplete}
      />
    </Box>
  );
};

export default EstablishmentForm;

/**
 * mainAttraction,
        bestRegular,
        worstRegular,
        wantsInOnIt,
        oweForIt,
        wantsItGone,
        sideAttractions,
        atmospheres,
        regulars,
        interestedParties,
        securityOptions: securityNoTypename,
        castAndCrew: crewNoTypename,
 */
