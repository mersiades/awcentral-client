import React, { FC, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Form, FormField, TextInput, Text } from 'grommet';

import ActionButtons from '../ActionButtons';
import Spinner from '../Spinner';
import { HeadingWS } from '../../config/grommetConfig';
import { LookCategories, PlayBooks } from '../../@types/enums';
import { Look, PlaybookCreator } from '../../@types/staticDataInterfaces';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import { useFonts } from '../../contexts/fontContext';

interface CharacterLooksFormProps {
  playbookType: PlayBooks;
  characterName: string;
  settingLooks: boolean;
  handleSubmitLook: (look: string, category: LookCategories) => void;
  existingLooks: {
    gender: string;
    clothes: string;
    face: string;
    eyes: string;
    body: string;
  };
}

const CharacterLooksForm: FC<CharacterLooksFormProps> = ({
  playbookType,
  characterName,
  settingLooks,
  handleSubmitLook,
  existingLooks,
}) => {
  const [steps] = useState(Object.values(LookCategories));
  const [selectedStep, setSelectedStep] = useState(0);
  const [pbCreator, setPbCreator] = useState<PlaybookCreator | undefined>();
  const [genderValue, setGenderValue] = useState({ gender: existingLooks.gender });
  const [clothesValue, setClothesValue] = useState({ clothes: existingLooks.clothes });
  const [faceValue, setFaceValue] = useState({ face: existingLooks.face });
  const [eyesValue, setEyesValue] = useState({ eyes: existingLooks.eyes });
  const [bodyValue, setBodyValue] = useState({ body: existingLooks.body });

  const { crustReady } = useFonts();

  const { data: pbCreatorData, loading: loadingPbCreator } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    {
      variables: { playbookType },
    }
  );

  useEffect(() => {
    !!pbCreatorData && setPbCreator(pbCreatorData.playbookCreator);
  }, [pbCreatorData]);

  if (loadingPbCreator || !pbCreatorData || !pbCreator) {
    return (
      <Box fill background="transparent" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  const handleSetClick = (look: string, category: LookCategories) => {
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
      <HeadingWS crustReady={crustReady} level={2}>{`WHAT DOES ${characterName.toUpperCase()} LOOK LIKE?`}</HeadingWS>
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
          onSubmit={({ value }: any) => handleSetClick(value.gender, LookCategories.gender)}
        >
          <Box
            width="50vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <FormField name="gender" width="100%">
              <TextInput placeholder="Type or select" name="gender" size="xxlarge" />
            </FormField>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {pbCreator.looks
                .filter((look) => look.category === LookCategories.gender)
                .map((look) => renderPill(look, setGenderValue, 'gender'))}
            </Box>
          </Box>
          <ActionButtons value={genderValue.gender} primaryLabel="SET" />
        </Form>
      )}
      {selectedStep === 1 && (
        <Form
          value={clothesValue}
          onChange={(nextValue: any) => setClothesValue(nextValue)}
          onReset={() => setClothesValue({ clothes: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.clothes, LookCategories.clothes)}
        >
          <Box
            width="50vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <FormField name="clothes" width="100%">
              <TextInput placeholder="Type or select" name="clothes" size="xxlarge" />
            </FormField>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {pbCreator.looks
                .filter((look) => look.category === LookCategories.clothes)
                .map((look) => renderPill(look, setClothesValue, 'clothes'))}
            </Box>
          </Box>
          <ActionButtons value={clothesValue.clothes} primaryLabel="SET" />
        </Form>
      )}
      {selectedStep === 2 && (
        <Form
          value={faceValue}
          onChange={(nextValue: any) => setFaceValue(nextValue)}
          onReset={() => setFaceValue({ face: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.face, LookCategories.face)}
        >
          <Box
            width="50vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <FormField name="face" width="100%">
              <TextInput placeholder="Type or select" name="face" size="xxlarge" />
            </FormField>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {pbCreator.looks
                .filter((look) => look.category === LookCategories.face)
                .map((look) => renderPill(look, setFaceValue, 'face'))}
            </Box>
          </Box>
          <ActionButtons value={faceValue.face} primaryLabel="SET" />
        </Form>
      )}
      {selectedStep === 3 && (
        <Form
          value={eyesValue}
          onChange={(nextValue: any) => setEyesValue(nextValue)}
          onReset={() => setEyesValue({ eyes: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.eyes, LookCategories.eyes)}
        >
          <Box
            width="50vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <FormField name="eyes" width="100%">
              <TextInput placeholder="Type or select" name="eyes" size="xxlarge" />
            </FormField>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {pbCreator.looks
                .filter((look) => look.category === LookCategories.eyes)
                .map((look) => renderPill(look, setEyesValue, 'eyes'))}
            </Box>
          </Box>
          <ActionButtons value={eyesValue.eyes} primaryLabel="SET" />
        </Form>
      )}
      {selectedStep === 4 && (
        <Form
          value={bodyValue}
          onChange={(nextValue: any) => setBodyValue(nextValue)}
          onReset={() => setBodyValue({ body: '' })}
          onSubmit={({ value }: any) => !settingLooks && handleSetClick(value.body, LookCategories.body)}
        >
          <Box
            width="50vw"
            flex="grow"
            margin={{ bottom: '12px' }}
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <FormField name="body" width="100%">
              <TextInput placeholder="Type or select" name="body" size="xxlarge" />
            </FormField>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {pbCreator.looks
                .filter((look) => look.category === LookCategories.body)
                .map((look) => renderPill(look, setBodyValue, 'body'))}
            </Box>
          </Box>
          <ActionButtons value={bodyValue.body} primaryLabel={settingLooks ? <Spinner fillColor="#FFF" /> : 'SET'} />
        </Form>
      )}
    </Box>
  );
};

export default CharacterLooksForm;
