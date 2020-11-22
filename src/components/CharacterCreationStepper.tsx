import React, { FC } from 'react';
import { Box } from 'grommet';

interface CharacterCreationStepperProps {
  numberOfSteps: number;
  currentStep: number;
}

const CharacterCreationStepper: FC<CharacterCreationStepperProps> = ({ currentStep, numberOfSteps }) => {
  return (
    <Box fill="horizontal" background="black" border align="center" pad="24px">
      stepper: {currentStep}
    </Box>
  );
};

export default CharacterCreationStepper;
