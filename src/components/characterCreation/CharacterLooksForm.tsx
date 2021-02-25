import React, { FC, useEffect, useReducer, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { omit } from 'lodash';
import { Box, FormField, TextInput, Text } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import SET_CHARACTER_LOOK, { SetCharacterLookData, SetCharacterLookVars } from '../../mutations/setCharacterLook';
import { CharacterCreationSteps, LookType } from '../../@types/enums';
import { Look } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { LookInput } from '../../@types';

interface LooksFormState {
  gender?: Look;
  clothes?: Look;
  face?: Look;
  eyes?: Look;
  body?: Look;
}

interface Action {
  type: 'SET_GENDER' | 'SET_CLOTHES' | 'SET_FACE' | 'SET_EYES' | 'SET_BODY';
  payload?: any;
}

const looksReducer = (state: LooksFormState, action: Action) => {
  switch (action.type) {
    case 'SET_GENDER':
      return { ...state, gender: action.payload };
    case 'SET_CLOTHES':
      return { ...state, clothes: action.payload };
    case 'SET_FACE':
      return { ...state, face: action.payload };
    case 'SET_EYES':
      return { ...state, eyes: action.payload };
    case 'SET_BODY':
      return { ...state, body: action.payload };
    default:
      return state;
  }
};

const CharacterLooksForm: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [{ gender, clothes, face, eyes, body }, dispatch] = useReducer(looksReducer, {});

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [steps] = useState(Object.values(LookType));
  const [selectedStep, setSelectedStep] = useState(0);

  // --------------------------------------------------3rd party hooks ----------------------------------------------------- //
  const history = useHistory();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    // @ts-ignore
    { variables: { playbookType: character?.playbook }, skip: !character?.playbook }
  );
  const looks = pbCreatorData?.playbookCreator.looks;
  const [setCharacterLook, { loading: settingLooks }] = useMutation<SetCharacterLookData, SetCharacterLookVars>(
    SET_CHARACTER_LOOK
  );

  // ------------------------------------------ Component functions and variables ------------------------------------------ //
  const handleSubmitLook = async (look: Look) => {
    if (!!userGameRole && !!character && !!game) {
      // Prepare LookInput
      const lookInput: LookInput = omit(look, ['__typename']);

      // Prepare optimistic response
      const matchIndex = character.looks.findIndex((l: Look) => l.category === look.category);
      let optimisticLooks: Look[] = [...character.looks];
      if (matchIndex > -1) {
        optimisticLooks[matchIndex] = { ...look, id: look.id ? look.id : 'temp-id' };
      } else {
        optimisticLooks = [...optimisticLooks, { ...look, id: look.id ? look.id : 'temp-id' }];
      }

      // Send Look
      try {
        const data = await setCharacterLook({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, look: lookInput },
          optimisticResponse: {
            __typename: 'Mutation',
            setCharacterLook: {
              ...character,
              looks: optimisticLooks,
              __typename: 'Character',
            },
          },
        });
        if (data.data?.setCharacterLook.looks?.length === 5) {
          history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectStats}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Create custom Look when User types
  const handleTypeLook = (look: string, category: LookType) => {
    if (!!character) {
      const newLook: LookInput = { look, category, playbookType: character?.playbook };
      switch (category) {
        case LookType.gender:
          dispatch({ type: 'SET_GENDER', payload: newLook });
          break;
        default:
      }
    }
  };

  // Change LookType 'tab'
  const handlePillOrSetClick = (look: Look) => {
    setSelectedStep((prevStep) => {
      if (prevStep < 4) {
        return prevStep + 1;
      } else {
        return prevStep;
      }
    });
    handleSubmitLook(look);
  };

  // ------------------------------------------------------- Effects ------------------------------------------------------- //

  useEffect(() => {
    const existingGender: Look | undefined = character?.looks.find((look) => look.category === LookType.gender);
    !!existingGender && dispatch({ type: 'SET_GENDER', payload: existingGender });
    const existingClothes: Look | undefined = character?.looks.find((look) => look.category === LookType.clothes);
    !!existingClothes && dispatch({ type: 'SET_CLOTHES', payload: existingClothes });
    const existingFace: Look | undefined = character?.looks.find((look) => look.category === LookType.face);
    !!existingFace && dispatch({ type: 'SET_FACE', payload: existingFace });
    const existingEyes: Look | undefined = character?.looks.find((look) => look.category === LookType.eyes);
    !!existingEyes && dispatch({ type: 'SET_EYES', payload: existingEyes });
    const existingBody: Look | undefined = character?.looks.find((look) => look.category === LookType.body);
    !!existingBody && dispatch({ type: 'SET_BODY', payload: existingBody });
  }, [character]);
  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  const renderPill = (look: Look) => {
    let isSelected = false;
    switch (look.category) {
      case LookType.gender:
        isSelected = gender?.id === look.id;
        break;
      default:
    }
    return (
      <Box
        data-testid={`${look.look}-pill`}
        key={look.id}
        background={isSelected ? { color: '#698D70', dark: true } : '#4C684C'}
        round="medium"
        pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
        margin={{ vertical: '3px', horizontal: '3px' }}
        justify="center"
        onClick={() => handlePillOrSetClick(look)}
        hoverIndicator={{ color: '#698D70', dark: true }}
      >
        <Text weight="bold" size="large">
          {look.look}
        </Text>
      </Box>
    );
  };

  return (
    <Box
      data-testid="character-looks-form"
      fill
      pad="24px"
      align="center"
      justify="start"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Box width="85vw" align="center" style={{ maxWidth: '763px' }}>
        <Box direction="row" fill="horizontal" justify="between" align="center">
          <HeadingWS crustReady={crustReady} level={2}>{`WHAT DOES ${
            !!character?.name ? character.name.toUpperCase() : '...'
          } LOOK LIKE?`}</HeadingWS>
        </Box>
        <Box direction="row" justify="between" gap="24px" style={{ minHeight: '70px' }}>
          {steps.map((step, index) => {
            const isSelected = index === selectedStep;
            return (
              <HeadingWS
                key={index}
                level={4}
                color={isSelected ? 'accent-1' : 'white'}
                onClick={() => setSelectedStep(index)}
                style={{ cursor: 'pointer' }}
                margin={{ top: '12px' }}
              >
                {step}
              </HeadingWS>
            );
          })}
        </Box>
        {selectedStep === 0 && (
          <Box
            fill="horizontal"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" fill="horizontal" align="center" gap="12px">
              <FormField width="100%">
                <TextInput
                  placeholder="Type or select"
                  aria-label="gender-input"
                  size="xxlarge"
                  value={gender ? gender.look : ''}
                  onChange={(e) => handleTypeLook(e.target.value, LookType.gender)}
                />
              </FormField>

              <ButtonWS
                secondary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={!gender || gender.look === '' || settingLooks}
                onClick={() => handlePillOrSetClick(gender)}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {!!looks && looks.filter((look) => look.category === LookType.gender).map((look) => renderPill(look))}
            </Box>
          </Box>
        )}
        {selectedStep === 1 && (
          <Box
            fill="horizontal"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" fill="horizontal" align="center" gap="12px">
              <FormField width="100%">
                <TextInput
                  placeholder="Type or select"
                  aria-label="clothes-input"
                  size="xxlarge"
                  value={clothes ? clothes.look : ''}
                  onChange={(e) => handleTypeLook(e.target.value, LookType.clothes)}
                />
              </FormField>
              <ButtonWS
                secondary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={!clothes || clothes.look === '' || settingLooks}
                onClick={() => handlePillOrSetClick(clothes)}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {!!looks && looks.filter((look) => look.category === LookType.clothes).map((look) => renderPill(look))}
            </Box>
          </Box>
        )}
        {selectedStep === 2 && (
          <Box
            fill="horizontal"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" fill="horizontal" align="center" gap="12px">
              <FormField width="100%">
                <TextInput
                  placeholder="Type or select"
                  aria-label="face-input"
                  size="xxlarge"
                  value={face ? face.look : ''}
                  onChange={(e) => handleTypeLook(e.target.value, LookType.face)}
                />
              </FormField>
              <ButtonWS
                secondary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={!face || gender.face === '' || settingLooks}
                onClick={() => handlePillOrSetClick(face)}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {!!looks && looks.filter((look) => look.category === LookType.face).map((look) => renderPill(look))}
            </Box>
          </Box>
        )}
        {selectedStep === 3 && (
          <Box
            fill="horizontal"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" fill="horizontal" align="center" gap="12px">
              <FormField width="100%">
                <TextInput
                  placeholder="Type or select"
                  aria-label="eyes-input"
                  size="xxlarge"
                  value={eyes ? eyes.look : ''}
                  onChange={(e) => handleTypeLook(e.target.value, LookType.eyes)}
                />
              </FormField>
              <ButtonWS
                secondary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={!eyes || eyes.look === '' || settingLooks}
                onClick={() => handlePillOrSetClick(eyes)}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {!!looks && looks.filter((look) => look.category === LookType.eyes).map((look) => renderPill(look))}
            </Box>
          </Box>
        )}
        {selectedStep === 4 && (
          <Box
            fill="horizontal"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" fill="horizontal" align="center" gap="12px">
              <FormField width="100%">
                <TextInput
                  placeholder="Type or select"
                  aria-label="body-input"
                  size="xxlarge"
                  value={body ? body.look : ''}
                  onChange={(e) => handleTypeLook(e.target.value, LookType.body)}
                />
              </FormField>
              <ButtonWS
                secondary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={!body || body.look === '' || settingLooks}
                onClick={() => handlePillOrSetClick(body)}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {!!looks && looks.filter((look) => look.category === LookType.body).map((look) => renderPill(look))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CharacterLooksForm;
