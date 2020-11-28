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

  const getStepContent = (index: number): { label: string; value?: any } => {
    switch (index) {
      case 0:
      // Intentionally falls through
      case 1:
        return {
          label: 'Playbook',
          value: !!character?.playbook ? <Text>{formatPlaybookType(character?.playbook)}</Text> : <Text>...</Text>,
        };
      case 2:
        return { label: 'Name', value: !!character?.name ? <Text>{character.name}</Text> : <Text>...</Text> };
      case 3:
        let reversedLooks: string[] = [];
        if (!!character && !!character.looks) {
          reversedLooks = character.looks.map((look) => look.look).reverse();
        }
        return {
          label: 'Looks',
          value:
            reversedLooks.length > 0 ? (
              <ul style={{ margin: 'unset', overflowY: 'auto', width: '100%', alignSelf: 'baseline' }}>
                {reversedLooks.map((look) => (
                  <li key={look}>{look}</li>
                ))}
              </ul>
            ) : (
              <Text>...</Text>
            ),
        };
      case 4:
        return {
          label: 'Stats',
          value:
            !!character && character.statsBlock.stats.length > 0 ? (
              <ul style={{ margin: 'unset', overflowY: 'auto', width: '100%', alignSelf: 'baseline' }}>
                {character.statsBlock.stats.map((stat) => (
                  <li key={stat.id}>{`${stat.stat} --- ${stat.value}`}</li>
                ))}
              </ul>
            ) : (
              <Text>...</Text>
            ),
        };
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
            justify="start"
            background={{ color: 'neutral-1', opacity: isSelected ? 1 : 0.5 }}
            round="medium"
            width="small"
            height="xsmall"
            border
            onClick={() => setCreationStep(index)}
            pad="12px"
          >
            <Text color="white" weight="bold">
              {content.label}
            </Text>
            {!!content.value && content.value}
          </Box>
        );
      })}
    </Box>
  );
};

export default CharacterCreationStepper;
