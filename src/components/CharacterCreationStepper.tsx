import React, { FC } from 'react';
import { Box, Grid, Text } from 'grommet';
import { CharacterCreationSteps } from '../@types/enums';
import { Character } from '../@types';
import { formatPlaybookType } from '../helpers/formatPlaybookType';
import styled from 'styled-components';

interface CharacterCreationStepperProps {
  currentStep: number;
  setCreationStep: (step: number) => void;
  character?: Character;
}

const CustomUL = styled.ul`
  margin: unset;
  overflow-y: auto;
  width: 100%;
  align-self: inherit;
  list-style-type: none;
`;

const CharacterCreationStepper: FC<CharacterCreationStepperProps> = ({ currentStep, setCreationStep, character }) => {
  let reversedLooks: string[] = [];
  if (!!character && !!character.looks) {
    reversedLooks = character.looks.map((look) => look.look).reverse();
  }

  return (
    <Box direction="row" fill="horizontal" background="black" justify="center" pad="24px" align="center">
      <Grid
        fill
        gap="small"
        justifyContent="center"
        rows={['50%', '50%']}
        columns={['small', 'small', 'small', 'small']}
        areas={[
          { name: 'playbook-box', start: [0, 0], end: [0, 0] },
          { name: 'name-box', start: [0, 1], end: [0, 1] },
          { name: 'looks-box', start: [1, 0], end: [1, 1] },
          { name: 'stats-box', start: [2, 0], end: [2, 1] },
          { name: 'gear-box', start: [3, 0], end: [3, 1] },
        ]}
      >
        <Box
          fill
          gridArea="playbook-box"
          margin={{ left: 'small', right: 'small' }}
          align="center"
          justify="start"
          background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectPlaybook === currentStep ? 1 : 0.5 }}
          round="medium"
          border
          onClick={() => setCreationStep(CharacterCreationSteps.selectPlaybook)}
          pad="12px"
        >
          <Text color="white" weight="bold">
            Playbook
          </Text>
          {!!character?.playbook ? <Text>{formatPlaybookType(character?.playbook)}</Text> : <Text>...</Text>}
        </Box>
        <Box
          fill
          gridArea="name-box"
          margin={{ left: 'small', right: 'small' }}
          align="center"
          justify="start"
          background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectName === currentStep ? 1 : 0.5 }}
          round="medium"
          border
          onClick={() => setCreationStep(CharacterCreationSteps.selectName)}
          pad="12px"
        >
          <Text color="white" weight="bold">
            Name
          </Text>
          {!!character?.name ? <Text>{character.name}</Text> : <Text>...</Text>}
        </Box>
        <Box
          fill
          gridArea="looks-box"
          margin={{ left: 'small', right: 'small' }}
          align="center"
          justify="start"
          background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectLooks === currentStep ? 1 : 0.5 }}
          round="medium"
          border
          onClick={() => setCreationStep(CharacterCreationSteps.selectLooks)}
          pad="12px"
        >
          <Text color="white" weight="bold">
            Looks
          </Text>
          {reversedLooks.length > 0 ? (
            <CustomUL>
              {reversedLooks.map((look) => (
                <li key={look}>{look}</li>
              ))}
            </CustomUL>
          ) : (
            <Text>...</Text>
          )}
        </Box>
        <Box
          fill
          gridArea="stats-box"
          margin={{ left: 'small', right: 'small' }}
          align="center"
          justify="start"
          background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectStats === currentStep ? 1 : 0.5 }}
          round="medium"
          border
          onClick={() => setCreationStep(CharacterCreationSteps.selectStats)}
          pad="12px"
        >
          <Text color="white" weight="bold">
            Stats
          </Text>
          {!!character && character.statsBlock?.stats?.length > 0 ? (
            <CustomUL>
              {character.statsBlock.stats.map((stat) => (
                <li key={stat.id}>{`${stat.stat} ${'--'.repeat(8 - stat.stat.length)} ${stat.value}`}</li>
              ))}
            </CustomUL>
          ) : (
            <Text>...</Text>
          )}
        </Box>
        <Box
          fill
          gridArea="gear-box"
          margin={{ left: 'small', right: 'small' }}
          align="center"
          justify="start"
          background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectGear === currentStep ? 1 : 0.5 }}
          round="medium"
          border
          onClick={() => setCreationStep(CharacterCreationSteps.selectGear)}
          pad="12px"
        >
          <Text color="white" weight="bold">
            Gear
          </Text>
          {!!character && character.gear?.length > 0 ? (
            <CustomUL>
              {character.gear.map((item) => (
                <li key={item}>item</li>
              ))}
            </CustomUL>
          ) : (
            <Text>...</Text>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default CharacterCreationStepper;
