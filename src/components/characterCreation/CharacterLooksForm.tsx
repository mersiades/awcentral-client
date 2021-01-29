import React, { FC, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box, Form, FormField, TextInput, Text } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import SET_CHARACTER_LOOK, { SetCharacterLookData, SetCharacterLookVars } from '../../mutations/setCharacterLook';
import { CharacterCreationSteps, LookType } from '../../@types/enums';
import { Look } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

const CharacterLooksForm: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const existingLooks = {
    gender: character?.looks?.filter((look) => look.category === LookType.gender)[0]?.look || '',
    clothes: character?.looks?.filter((look) => look.category === LookType.clothes)[0]?.look || '',
    face: character?.looks?.filter((look) => look.category === LookType.face)[0]?.look || '',
    eyes: character?.looks?.filter((look) => look.category === LookType.eyes)[0]?.look || '',
    body: character?.looks?.filter((look) => look.category === LookType.body)[0]?.look || '',
  };
  const [steps] = useState(Object.values(LookType));
  const [selectedStep, setSelectedStep] = useState(0);
  const [genderValue, setGenderValue] = useState({ gender: existingLooks.gender });
  const [clothesValue, setClothesValue] = useState({ clothes: existingLooks.clothes });
  const [faceValue, setFaceValue] = useState({ face: existingLooks.face });
  const [eyesValue, setEyesValue] = useState({ eyes: existingLooks.eyes });
  const [bodyValue, setBodyValue] = useState({ body: existingLooks.body });

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
  const handleSubmitLook = async (look: string, category: LookType) => {
    if (!!userGameRole && !!character && !!game) {
      try {
        const data = await setCharacterLook({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, look, category },
        });
        if (data.data?.setCharacterLook.looks?.length === 5) {
          history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectStats}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSetClick = (look: string, category: LookType) => {
    setSelectedStep((prevStep) => {
      if (prevStep < 4) {
        return prevStep + 1;
      } else {
        return prevStep;
      }
    });
    handleSubmitLook(look, category);
  };

  const renderPill = (look: Look, onClick: any, field: string) => (
    <Box
      data-testid={`${look.look}-pill`}
      key={look.id}
      background="#4C684C"
      round="medium"
      pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
      margin={{ vertical: '3px', horizontal: '3px' }}
      justify="center"
      onClick={() => onClick({ [field]: look.look })}
      hoverIndicator={{ color: '#698D70', dark: true }}
    >
      <Text weight="bold" size="large">
        {look.look}
      </Text>
    </Box>
  );

  return (
    <Box
      fill
      direction="column"
      background="transparent"
      pad="24px"
      align="center"
      justify="start"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <HeadingWS crustReady={crustReady} level={2}>{`WHAT DOES ${
        !!character?.name ? character.name.toUpperCase() : '...'
      } LOOK LIKE?`}</HeadingWS>
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
            >
              {step}
            </HeadingWS>
          );
        })}
      </Box>
      {selectedStep === 0 && (
        <Form
          value={genderValue}
          onChange={(nextValue: any) => setGenderValue(nextValue)}
          onReset={() => setGenderValue({ gender: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.gender, LookType.gender)}
        >
          <Box
            width="60vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" align="center" gap="12px">
              <FormField name="gender" width="100%">
                <TextInput placeholder="Type or select" name="gender" size="xxlarge" />
              </FormField>
              <ButtonWS type="reset" label="CLEAR" />
              <ButtonWS
                type="submit"
                primary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={genderValue.gender === ''}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {!!looks &&
                looks
                  .filter((look) => look.category === LookType.gender)
                  .map((look) => renderPill(look, setGenderValue, 'gender'))}
            </Box>
          </Box>
        </Form>
      )}
      {selectedStep === 1 && (
        <Form
          value={clothesValue}
          onChange={(nextValue: any) => setClothesValue(nextValue)}
          onReset={() => setClothesValue({ clothes: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.clothes, LookType.clothes)}
        >
          <Box
            width="60vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" align="center" gap="12px">
              <FormField name="clothes" width="100%">
                <TextInput placeholder="Type or select" name="clothes" size="xxlarge" />
              </FormField>
              <ButtonWS type="reset" label="CLEAR" />
              <ButtonWS
                type="submit"
                primary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={clothesValue.clothes === ''}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {!!looks &&
                looks
                  .filter((look) => look.category === LookType.clothes)
                  .map((look) => renderPill(look, setClothesValue, 'clothes'))}
            </Box>
          </Box>
        </Form>
      )}
      {selectedStep === 2 && (
        <Form
          value={faceValue}
          onChange={(nextValue: any) => setFaceValue(nextValue)}
          onReset={() => setFaceValue({ face: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.face, LookType.face)}
        >
          <Box
            width="60vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" align="center" gap="12px">
              <FormField name="face" width="100%">
                <TextInput placeholder="Type or select" name="face" size="xxlarge" />
              </FormField>
              <ButtonWS type="reset" label="CLEAR" />
              <ButtonWS
                type="submit"
                primary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={faceValue.face === ''}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {!!looks &&
                looks
                  .filter((look) => look.category === LookType.face)
                  .map((look) => renderPill(look, setFaceValue, 'face'))}
            </Box>
          </Box>
        </Form>
      )}
      {selectedStep === 3 && (
        <Form
          value={eyesValue}
          onChange={(nextValue: any) => setEyesValue(nextValue)}
          onReset={() => setEyesValue({ eyes: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.eyes, LookType.eyes)}
        >
          <Box
            width="60vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" align="center" gap="12px">
              <FormField name="eyes" width="100%">
                <TextInput placeholder="Type or select" name="eyes" size="xxlarge" />
              </FormField>
              <ButtonWS type="reset" label="CLEAR" />
              <ButtonWS
                type="submit"
                primary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={eyesValue.eyes === ''}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {!!looks &&
                looks
                  .filter((look) => look.category === LookType.eyes)
                  .map((look) => renderPill(look, setEyesValue, 'eyes'))}
            </Box>
          </Box>
        </Form>
      )}
      {selectedStep === 4 && (
        <Form
          value={bodyValue}
          onChange={(nextValue: any) => setBodyValue(nextValue)}
          onReset={() => setBodyValue({ body: '' })}
          onSubmit={({ value }: any) => !settingLooks && handleSetClick(value.body, LookType.body)}
        >
          <Box
            width="60vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <Box direction="row" align="center" gap="12px">
              <FormField name="body" width="100%">
                <TextInput placeholder="Type or select" name="body" size="xxlarge" />
              </FormField>
              <ButtonWS type="reset" label="CLEAR" />
              <ButtonWS
                type="submit"
                primary
                label={settingLooks ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
                disabled={bodyValue.body === ''}
              />
            </Box>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {!!looks &&
                looks
                  .filter((look) => look.category === LookType.body)
                  .map((look) => renderPill(look, setBodyValue, 'body'))}
            </Box>
          </Box>
        </Form>
      )}
    </Box>
  );
};

export default CharacterLooksForm;
