import React, { FC, useState } from 'react';
import { Box, Text } from 'grommet';
import { CharacterCreationSteps } from '../@types/enums';
import { Character } from '../@types';
import { formatPlaybookType } from '../helpers/formatPlaybookType';

interface CharacterCreationStepperProps {
  currentStep: number;
  setCreationStep: (step: number) => void;
  character?: Character;
}

const CharacterCreationStepper: FC<CharacterCreationStepperProps> = ({ currentStep, setCreationStep, character }) => {
  const [steps] = useState(Object.values(CharacterCreationSteps).filter((step) => typeof step === 'number'));

  console.log('steps', steps);
  const getStepContent = (index: number): { label: string; value?: string } => {
    switch (index) {
      case 0:
      // return { label: 'Start' };
      // Intentionally falls through
      case 1:
        return { label: 'Playbook', value: !!character?.playbook ? formatPlaybookType(character?.playbook) : '...' };
      case 2:
        return { label: 'Name', value: !!character?.name ? character.name : '...' };
      default:
        throw Error('Character creation step does not exist');
    }
  };

  return (
    <Box direction="row" fill="horizontal" background="black" border justify="center" pad="24px" align="center">
      {steps.map((step, index) => {
        const content = getStepContent(index);
        const isSelected = index === currentStep;

        if (index === 0) {
          return '';
        }

        return (
          <Box
            key={index}
            margin={{ left: 'small', right: 'small' }}
            border
            align="center"
            justify="center"
            background={{ color: isSelected ? 'brand' : 'neutral-1', opacity: isSelected ? 1 : 0.5 }}
            round="medium"
            width="small"
            height="xsmall"
            onClick={() => setCreationStep(index)}
          >
            <Text color="white" weight="bold">
              {content.label}
            </Text>
            {!!content.value && <Text>{content.value}</Text>}
          </Box>
        );
      })}
    </Box>
  );
};

export default CharacterCreationStepper;
