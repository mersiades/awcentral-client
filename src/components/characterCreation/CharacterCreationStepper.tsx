import React, { FC } from 'react';
import { Box, Text } from 'grommet';

import { CharacterCreationSteps, PlaybookType, UniqueTypes } from '../../@types/enums';
import { Character } from '../../@types/dataInterfaces';
import { decapitalize } from '../../helpers/decapitalize';
import { CustomUL } from '../../config/grommetConfig';
import { IconProps, Next, Previous } from 'grommet-icons';
import { useQuery } from '@apollo/client';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import styled, { css } from 'styled-components';

interface CharacterCreationStepperProps {
  currentStep: number;
  setCreationStep: (step: number) => void;
  character?: Character;
  playbookType?: PlaybookType;
}

const NextWithHover = styled(Next as React.FC<IconProps & JSX.IntrinsicElements['svg']>)(() => {
  return css`
    &:hover {
      stroke: #fff;
    }
  `;
});

const PreviousWithHover = styled(Previous as React.FC<IconProps & JSX.IntrinsicElements['svg']>)(() => {
  return css`
    &:hover {
      stroke: #fff;
    }
  `;
});

const CharacterCreationStepper: FC<CharacterCreationStepperProps> = ({
  currentStep,
  setCreationStep,
  character,
  playbookType,
}) => {
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    // @ts-ignore
    variables: { playbookType },
    skip: !playbookType,
  });

  const pbCreator = pbCreatorData?.playbookCreator;

  let reversedLooks: string[] = [];
  if (!!character && !!character.looks) {
    reversedLooks = character.looks.map((look) => look.look).reverse();
  }

  const box0Step1 = (
    <Box margin={{ left: 'xsmall', right: 'xsmall' }} justify="between" width="11em" height="10rem" gap="small">
      <Box
        data-testid="playbook-box"
        align="center"
        fill="horizontal"
        pad="small"
        height="5rem"
        border
        background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectPlaybook === currentStep ? 1 : 0.5 }}
        onClick={(e: any) => {
          e.currentTarget.blur();
          setCreationStep(CharacterCreationSteps.selectPlaybook);
        }}
      >
        <Text color="white" weight="bold">
          Playbook
        </Text>
        {!!character?.playbook ? <Text>{decapitalize(character?.playbook)}</Text> : <Text>...</Text>}
      </Box>
      <Box
        data-testid="name-box"
        align="center"
        fill="horizontal"
        pad="small"
        border
        height="5rem"
        background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectName === currentStep ? 1 : 0.5 }}
        onClick={(e: any) => {
          e.currentTarget.blur();
          !!character?.playbook && setCreationStep(CharacterCreationSteps.selectName);
        }}
      >
        <Text color="white" weight="bold">
          Name
        </Text>
        {!!character?.name ? <Text>{character.name}</Text> : <Text>...</Text>}
      </Box>
    </Box>
  );

  const box1Step3 = (
    <Box
      data-testid="looks-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectLooks === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && setCreationStep(CharacterCreationSteps.selectLooks);
      }}
    >
      <Text color="white" weight="bold">
        Looks
      </Text>
      {reversedLooks.length > 0 ? (
        <CustomUL>
          {reversedLooks.map((look) => (
            <li key={look} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {look}
            </li>
          ))}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const box2Step4 = (
    <Box
      data-testid="stats-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectStats === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && setCreationStep(CharacterCreationSteps.selectStats);
      }}
    >
      <Text color="white" weight="bold">
        Stats
      </Text>
      {!!character && character.statsBlock?.stats.length > 0 ? (
        <CustomUL>
          {character.statsBlock.stats.map((stat) => (
            <li key={stat.id}>{`${stat.stat} ${'--'.repeat(8 - stat.stat.length)} ${stat.value}`}</li>
          ))}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const box3Step5 = (
    <Box
      data-testid="gear-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectGear === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && setCreationStep(CharacterCreationSteps.selectGear);
      }}
    >
      <Text color="white" weight="bold">
        Gear
      </Text>
      {!!character && character.gear?.length > 0 ? (
        <CustomUL>
          {character.gear.map((item, index) => (
            <li key={index} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item}
            </li>
          ))}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const renderUnique = () => {
    if (!!character?.playbookUnique) {
      switch (character?.playbookUnique.type) {
        case UniqueTypes.angelKit:
          if (!!character.playbookUnique.angelKit) {
            const { stock, hasSupplier } = character.playbookUnique.angelKit;
            return (
              <CustomUL data-testid="angel-kit-box">
                <li key={1}>{`Stock: ${stock}`}</li>
                <li key={2}>{hasSupplier ? 'Has supplier' : 'No supplier yet'}</li>
              </CustomUL>
            );
          }
          return null;
        case UniqueTypes.customWeapons:
          if (!!character.playbookUnique.customWeapons) {
            const { weapons } = character.playbookUnique.customWeapons;
            return (
              <CustomUL>
                {weapons.map((weapon, index) => (
                  <li key={index} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {weapon}
                  </li>
                ))}
              </CustomUL>
            );
          }
          return null;
        case UniqueTypes.brainerGear:
          if (!!character.playbookUnique.brainerGear) {
            const concatGear = character.playbookUnique.brainerGear.brainerGear.map((gear) => gear.split('('));
            return (
              <CustomUL>
                {concatGear.map((item, index) => (
                  <li key={index} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item[0]}
                  </li>
                ))}
              </CustomUL>
            );
          }
          return null;
        case UniqueTypes.vehicle:
          if (!!character.playbookUnique.vehicles) {
            return (
              <CustomUL>
                {character.playbookUnique.vehicles.map((vehicle) => (
                  <li key={vehicle.id} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {vehicle.name}
                  </li>
                ))}
              </CustomUL>
            );
          }
          return null;
        default:
          return null;
      }
    }
  };

  const box4Step6 = (
    <Box
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.setUnique === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && setCreationStep(CharacterCreationSteps.setUnique);
      }}
    >
      <Text color="white" weight="bold" alignSelf="center">
        {!!pbCreator ? decapitalize(pbCreator.playbookUniqueCreator.type) : '...'}
      </Text>
      {!!character && !!character.playbookUnique ? renderUnique() : <Text>...</Text>}
    </Box>
  );

  const box5Step7 = (
    <Box
      data-testid="moves-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectMoves === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && setCreationStep(CharacterCreationSteps.selectMoves);
      }}
    >
      <Text color="white" weight="bold" alignSelf="center">
        Moves
      </Text>
      {!!character && !!character.characterMoves && character.characterMoves.length > 0 ? (
        <CustomUL>
          {character.characterMoves.map((move) => {
            if (move.isSelected) {
              return (
                <li key={move.id} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {decapitalize(move.name)}
                </li>
              );
            }
            return null;
          })}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const box6Step8 = (
    <Box
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.setHx === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && setCreationStep(CharacterCreationSteps.setHx);
      }}
    >
      <Text color="white" weight="bold" alignSelf="center">
        Hx
      </Text>
      {!!character && !!character.hxBlock && character.hxBlock.length > 0 ? (
        <CustomUL>
          {character.hxBlock.map((hxStat) => {
            return (
              <li key={hxStat.characterId}>{`${hxStat.characterName} ${'--'.repeat(10 - hxStat.characterName.length)} ${
                hxStat.hxValue
              }`}</li>
            );
          })}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const boxesArray = [box0Step1, box1Step3, box2Step4, box3Step5, box4Step6, box5Step7, box6Step8];

  const renderBoxesSmall = () => {
    switch (currentStep) {
      case 0:
      // Intentionally falls through
      case 1:
      // Intentionally falls through
      case 2:
        return (
          <>
            {boxesArray[0]}
            {boxesArray[1]}
            {boxesArray[2]}
          </>
        );
      case 8:
        return (
          <>
            {boxesArray[4]}
            {boxesArray[5]}
            {boxesArray[6]}
          </>
        );
      default:
        return (
          <>
            {boxesArray[currentStep - 3]}
            {boxesArray[currentStep - 2]}
            {boxesArray[currentStep - 1]}
          </>
        );
    }
  };

  const renderBoxes = () => {
    switch (currentStep) {
      case 0:
      // Intentionally falls through
      case 1:
      // Intentionally falls through
      case 2:
        return (
          <>
            {boxesArray[0]}
            {boxesArray[1]}
            {boxesArray[2]}
            {boxesArray[3]}
          </>
        );
      case 3:
        return (
          <>
            {boxesArray[0]}
            {boxesArray[1]}
            {boxesArray[2]}
            {boxesArray[3]}
          </>
        );
      case 4:
        return (
          <>
            {boxesArray[0]}
            {boxesArray[1]}
            {boxesArray[2]}
            {boxesArray[3]}
          </>
        );

      case 8:
        return (
          <>
            {boxesArray[3]}
            {boxesArray[4]}
            {boxesArray[5]}
            {boxesArray[6]}
          </>
        );

      default:
        return (
          <>
            {boxesArray[currentStep - 4]}
            {boxesArray[currentStep - 3]}
            {boxesArray[currentStep - 2]}
            {boxesArray[currentStep - 1]}
          </>
        );
    }
  };

  return (
    <Box
      direction="row"
      fill="horizontal"
      justify="center"
      pad="12px"
      align="center"
      flex="grow"
      style={{ maxHeight: '180px' }}
    >
      {currentStep > 1 ? (
        <PreviousWithHover
          cursor="pointer"
          onClick={() => !!character?.name && !!character?.playbook && setCreationStep(currentStep - 1)}
          size="large"
          color="accent-1"
        />
      ) : (
        <div style={{ height: 48, width: 48, background: 'transparent' }} />
      )}
      {window.innerWidth < 800 ? renderBoxesSmall() : renderBoxes()}
      {currentStep < 8 && currentStep > 1 && !!character?.name ? (
        <NextWithHover
          cursor="pointer"
          onClick={() => !!character?.name && !!character?.playbook && setCreationStep(currentStep + 1)}
          size="large"
          color="accent-1"
        />
      ) : (
        <div style={{ height: 48, width: 48, background: 'transparent' }} />
      )}
    </Box>
  );
};

export default CharacterCreationStepper;
