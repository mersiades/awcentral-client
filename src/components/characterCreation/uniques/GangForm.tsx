import React, { FC, useEffect, useReducer } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Box, CheckBox } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS, RedBox, TextWS } from '../../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { useHistory } from 'react-router-dom';
import { CharacterCreationSteps, GangSize, PlaybookType } from '../../../@types/enums';
import { GangOption } from '../../../@types/staticDataInterfaces';
import { Gang } from '../../../@types/dataInterfaces';
import SET_GANG, { SetGangData, SetGangVars } from '../../../mutations/setGang';
import { GangInput } from '../../../@types';
import { omit } from 'lodash';
import DoubleRedBox from '../../DoubleRedBox';
import SingleRedBox from '../../SingleRedBox';
import RedTagsBox from '../../RedTagsBox';

interface GangFormProps {
  existingGang?: Gang;
}

interface GangFormState {
  size: GangSize;
  harm: number;
  armor: number;
  strengths: GangOption[];
  weaknesses: GangOption[];
  tags: string[];
}

interface Action {
  type: 'SET_EXISTING_GANG' | 'ADD_STRENGTH' | 'REMOVE_STRENGTH' | 'REMOVE_WEAKNESS' | 'ADD_WEAKNESS';
  payload?: any;
}

const gangFormReducer = (state: GangFormState, action: Action) => {
  let tagPrefix: string;
  let tag: string;
  switch (action.type) {
    case 'SET_EXISTING_GANG':
      return {
        size: action.payload.size,
        harm: action.payload.harm,
        armor: action.payload.armor,
        strengths: action.payload.strengths,
        weaknesses: action.payload.weaknesses,
        tags: action.payload.tags,
      };
    case 'ADD_STRENGTH':
      if (!!action.payload.modifier) {
        switch (action.payload.modifier) {
          case GangSize.medium:
            return {
              ...state,
              strengths: [...state.strengths, action.payload],
              size: GangSize.medium,
            };
          case '+1harm':
            return {
              ...state,
              strengths: [...state.strengths, action.payload],
              harm: 3,
            };
          case '+1armor':
            return {
              ...state,
              strengths: [...state.strengths, action.payload],
              armor: 2,
            };
          default:
            return state;
        }
      } else if (!!action.payload.tag) {
        tagPrefix = action.payload.tag[0];
        tag = action.payload.tag.substring(1);

        return {
          ...state,
          strengths: [...state.strengths, action.payload],
          tags: tagPrefix === '-' ? state.tags.filter((t) => t !== tag) : [...state.tags, tag],
        };
      } else {
        return {
          ...state,
          strengths: [...state.strengths, action.payload],
        };
      }
    case 'REMOVE_STRENGTH':
      if (!!action.payload.modifier) {
        switch (action.payload.modifier) {
          case GangSize.medium:
            return {
              ...state,
              strengths: state.strengths.filter((opt) => opt.id !== action.payload.id),
              size: GangSize.small,
            };
          case '+1harm':
            return {
              ...state,
              strengths: state.strengths.filter((opt) => opt.id !== action.payload.id),
              harm: 2,
            };
          case '+1armor':
            return {
              ...state,
              strengths: state.strengths.filter((opt) => opt.id !== action.payload.id),
              armor: 1,
            };
          default:
            return state;
        }
      } else if (!!action.payload.tag) {
        tagPrefix = action.payload.tag[0];
        tag = action.payload.tag.substring(1);
        return {
          ...state,
          strengths: state.strengths.filter((opt) => opt.id !== action.payload.id),
          tags: tagPrefix === '-' ? [...state.tags, tag] : state.tags.filter((t) => t !== tag),
        };
      } else {
        return {
          ...state,
          strengths: state.strengths.filter((opt) => opt !== action.payload),
        };
      }
    case 'ADD_WEAKNESS':
      tagPrefix = action.payload.tag[0];
      tag = action.payload.tag.substring(1);

      return {
        ...state,
        weaknesses: [...state.weaknesses, action.payload],
        tags: tagPrefix === '-' ? state.tags.filter((t) => t !== tag) : [...state.tags, tag],
      };
    case 'REMOVE_WEAKNESS':
      tagPrefix = action.payload.tag[0];
      tag = action.payload.tag.substring(1);
      return {
        ...state,
        weaknesses: state.weaknesses.filter((w) => w.id !== action.payload.id),
        tags: tagPrefix === '-' ? [...state.tags, tag] : state.tags.filter((t) => t !== tag),
      };
    default:
      return state;
  }
};

const GangForm: FC<GangFormProps> = ({ existingGang }) => {
  const initialState: GangFormState = {
    size: GangSize.small,
    harm: 2,
    armor: 1,
    strengths: [],
    weaknesses: [],
    tags: ['savage'],
  };
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [{ size, harm, armor, strengths, weaknesses, tags }, dispatch] = useReducer(gangFormReducer, initialState);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType: PlaybookType.chopper },
  });
  const gangCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator?.gangCreator;
  const [setGang, { loading: settingGang }] = useMutation<SetGangData, SetGangVars>(SET_GANG);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const handleSubmitGang = async () => {
    if (!!userGameRole && !!character && !!game) {
      // @ts-ignore
      const strengthsNoTypename = strengths.map((str: GangOption) => omit(str, ['__typename']));
      // @ts-ignore
      const weaknessesNoTypename = weaknesses.map((wk: GangOption) => omit(wk, ['__typename']));

      const gangInput: GangInput = {
        id: existingGang ? existingGang.id : undefined,
        size,
        harm,
        armor,
        strengths: strengthsNoTypename,
        weaknesses: weaknessesNoTypename,
        tags,
      };
      try {
        await setGang({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, gang: gangInput },
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

  const handleStrengthSelect = (option: GangOption) => {
    if (!!gangCreator) {
      if (strengths.map((str: GangOption) => str.id).includes(option.id)) {
        dispatch({ type: 'REMOVE_STRENGTH', payload: option });
      } else if (strengths.length < gangCreator.strengthChoiceCount) {
        dispatch({ type: 'ADD_STRENGTH', payload: option });
      }
    }
  };

  const handleWeaknessSelect = (option: GangOption) => {
    if (!!gangCreator) {
      if (weaknesses.map((wk: GangOption) => wk.id).includes(option.id)) {
        dispatch({ type: 'REMOVE_WEAKNESS', payload: option });
      } else if (weaknesses.length < gangCreator.weaknessChoiceCount) {
        dispatch({ type: 'ADD_WEAKNESS', payload: option });
      }
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //
  useEffect(() => {
    if (!!character?.playbookUnique?.gang) {
      dispatch({ type: 'SET_EXISTING_GANG', payload: character.playbookUnique.gang });
    }
  }, [character]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  return (
    <Box
      data-testid="gang-form"
      justify="start"
      width="85vw"
      align="start"
      style={{ maxWidth: '742px' }}
      margin={{ bottom: '24px' }}
    >
      <Box direction="row" fill="horizontal" align="center" justify="between">
        <HeadingWS crustReady={crustReady} level={2} style={{ maxWidth: 'unset', height: '34px', lineHeight: '44px' }}>{`${
          !!character?.name ? character.name?.toUpperCase() : '...'
        }'S GANG`}</HeadingWS>
        <ButtonWS
          primary
          label={settingGang ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
          onClick={() => !settingGang && handleSubmitGang()}
          disabled={
            settingGang ||
            (!!gangCreator && strengths.length < gangCreator.strengthChoiceCount) ||
            (!!gangCreator && weaknesses.length < gangCreator.weaknessChoiceCount)
          }
        />
      </Box>
      {!!gangCreator && (
        <ParagraphWS style={{ maxWidth: 'unset' }} margin={{ top: '0px' }}>
          {gangCreator.intro}
        </ParagraphWS>
      )}
      <ParagraphWS>Then, choose {!!gangCreator ? gangCreator?.strengthChoiceCount : 2}:</ParagraphWS>

      <Box direction="row" fill="horizontal" gap="12px">
        <Box>
          {!!gangCreator &&
            gangCreator.strengths.map((option) => {
              return (
                <CheckBox
                  key={option.id}
                  checked={strengths.map((str: GangOption) => str.id).includes(option.id)}
                  label={option.description}
                  onChange={() => handleStrengthSelect(option)}
                  style={{ marginBottom: '3px' }}
                />
              );
            })}
          <ParagraphWS>And choose {!!gangCreator ? gangCreator?.weaknessChoiceCount : 1}:</ParagraphWS>
          {!!gangCreator &&
            gangCreator.weaknesses.map((option) => {
              return (
                <CheckBox
                  key={option.id}
                  checked={weaknesses.map((wk: GangOption) => wk.id).includes(option.id)}
                  label={option.description}
                  onChange={() => handleWeaknessSelect(option)}
                  style={{ marginBottom: '3px' }}
                />
              );
            })}
        </Box>
        <Box align="center" width="150px" flex="grow" fill="vertical" style={{ maxWidth: '150px' }}>
          <DoubleRedBox value={size} label="Size" width="150px" height="100%" />
          <Box fill="horizontal" direction="row" justify="between" flex="grow">
            <SingleRedBox value={harm} label="Harm" />
            <SingleRedBox value={armor} label="Armor" />
          </Box>
          <RedTagsBox tags={tags} label="Tags" height="100%" width="150px" />
        </Box>
      </Box>
    </Box>
  );
};

export default GangForm;
