import { useQuery } from '@apollo/client';
import { Box, Button, Form, FormField, Heading, TextInput, Text } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { Look, PlaybookCreator } from '../@types';
import { LookCategories, PlayBooks } from '../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';

interface CharacterLooksFormProps {
  playbookType: PlayBooks;
  characterName: string;
  handleSubmitLook: (look: string, category: LookCategories) => void;
  existingLooks: {
    gender: string;
    clothes: string;
    face: string;
    eyes: string;
    body: string;
  };
}

interface ActionButtonsProps {
  value: string;
}

const CharacterLooksForm: FC<CharacterLooksFormProps> = ({
  playbookType,
  characterName,
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
      <Box fill background="black" justify="center" align="center">
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

  const ActionButtons: FC<ActionButtonsProps> = ({ value }) => (
    <Box direction="row" justify="end" gap="24px">
      <Button type="reset" label="CLEAR" />
      <Button type="submit" primary label="SET" disabled={!value} />
    </Box>
  );

  return (
    <Box
      fill
      direction="column"
      background="black"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      pad="24px"
      align="center"
      justify="center"
    >
      <Heading level={1}>{`WHAT DOES ${characterName} LOOK LIKE?`}</Heading>
      <Box direction="row" justify="between" gap="24px">
        {steps.map((step, index) => {
          const isSelected = index === selectedStep;
          return (
            <Heading key={index} level={4} color={isSelected ? 'accent-1' : 'white'} onClick={() => setSelectedStep(index)}>
              {step}
            </Heading>
          );
        })}
      </Box>
      {selectedStep === 0 && (
        <Form
          value={genderValue}
          onChange={(nextValue) => setGenderValue(nextValue)}
          onReset={() => setGenderValue({ gender: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.gender, LookCategories.gender)}
        >
          <Box
            width="50vw"
            height="30vh"
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <FormField name="gender" width="100%">
              <TextInput placeholder="Type or select" name="gender" size="xxlarge" />
            </FormField>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {pbCreator.looks
                .filter((look) => look.category === LookCategories.gender)
                .map((look) => renderPill(look, setGenderValue, 'gender'))}
            </Box>
          </Box>
          <ActionButtons value={genderValue.gender} />
        </Form>
      )}
      {selectedStep === 1 && (
        <Form
          value={clothesValue}
          onChange={(nextValue) => setClothesValue(nextValue)}
          onReset={() => setClothesValue({ clothes: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.clothes, LookCategories.clothes)}
        >
          <Box
            width="50vw"
            height="30vh"
            align="center"
            animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
          >
            <FormField name="clothes" width="100%">
              <TextInput placeholder="Type or select" name="clothes" size="xxlarge" />
            </FormField>
            <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
              {pbCreator.looks
                .filter((look) => look.category === LookCategories.clothes)
                .map((look) => renderPill(look, setClothesValue, 'clothes'))}
            </Box>
          </Box>
          <ActionButtons value={clothesValue.clothes} />
        </Form>
      )}
      {selectedStep === 2 && (
        <Form
          value={faceValue}
          onChange={(nextValue) => setFaceValue(nextValue)}
          onReset={() => setFaceValue({ face: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.face, LookCategories.face)}
        >
          <Box
            width="50vw"
            height="30vh"
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
          <ActionButtons value={faceValue.face} />
        </Form>
      )}
      {selectedStep === 3 && (
        <Form
          value={eyesValue}
          onChange={(nextValue) => setEyesValue(nextValue)}
          onReset={() => setEyesValue({ eyes: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.eyes, LookCategories.eyes)}
        >
          <Box
            width="50vw"
            height="30vh"
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
          <ActionButtons value={eyesValue.eyes} />
        </Form>
      )}
      {selectedStep === 4 && (
        <Form
          value={bodyValue}
          onChange={(nextValue) => setBodyValue(nextValue)}
          onReset={() => setBodyValue({ body: '' })}
          onSubmit={({ value }: any) => handleSetClick(value.body, LookCategories.body)}
        >
          <Box
            width="50vw"
            height="30vh"
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
          <ActionButtons value={bodyValue.body} />
        </Form>
      )}
    </Box>
  );
};

export default CharacterLooksForm;
