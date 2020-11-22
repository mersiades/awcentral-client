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

  let looksAsString = '';
  character?.looks?.forEach((look) => (looksAsString += look.look + '\t'));

  const getStepContent = (index: number): { label: string; value?: string } => {
    switch (index) {
      case 0:
      // Intentionally falls through
      case 1:
        return { label: 'Playbook', value: !!character?.playbook ? formatPlaybookType(character?.playbook) : '...' };
      case 2:
        return { label: 'Name', value: !!character?.name ? character.name : '...' };
      case 3:
        return { label: 'Looks', value: !!character?.looks ? looksAsString : '...' };
      default:
        throw Error('Character creation step does not exist');
    }
  };

  return (
    <Box direction="row" fill="horizontal" background="black" justify="center" pad="24px" align="center">
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
            align="center"
            justify="center"
            background={{ color: 'neutral-1', opacity: isSelected ? 1 : 0.5 }}
            round="medium"
            width="small"
            height="xsmall"
            border
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
